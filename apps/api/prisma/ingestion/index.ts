// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import { fetchZhubajieServices } from './fetchers/zhubajie.fetcher';
import { fetchZhihuCourses } from './fetchers/zhihu.fetcher';
import { fetchBilibiliCourses } from './fetchers/bilibili.fetcher';
import { fetchJuejinCourses } from './fetchers/juejin.fetcher';
import { adaptService } from './adapters/service.adapter';
import { adaptCourse } from './adapters/course.adapter';
import { deduplicateByHash } from './cleaners/text.cleaner';
import { batchUpsertServices, batchCreateCourses } from './storage/batch.storage';
import logger from './utils/logger';
import { SITES } from './config/sites.config';

const prisma = new PrismaClient();

async function main() {
  logger.info('🌍 开始数据采集（一键填库模式 - kiro implementation）');
  logger.info(`可用站点: ${Object.keys(SITES).join(', ')}`);

  // ── Phase 1: 能力市场服务数据 ──────────────────────────────────────────
  if (SITES.zhubajie.enabled) {
    logger.info('>>> 阶段 1/2: 能力市场服务数据（找活干 - 技能发布）');
    const rawResult = await fetchZhubajieServices();
    const rawArray: any[] = rawResult.success ? (rawResult.data || []) : [];
    const uniqueServices = deduplicateByHash(rawArray, 'url');
    logger.info(`[Zhubajie] 获取服务数据 ${uniqueServices.length} 条`);
    logger.info('开始写入 Service 表...');

    for (let i = 0; i < uniqueServices.length; i++) {
      const raw = uniqueServices[i];
      const { service: input, providerName } = adaptService(raw);

      // 1. 确保 Provider User 存在（每个服务提供者一个独立用户）
      const providerUserId = `provider-${require('crypto').createHash('sha256').update(providerName).digest('hex').slice(0, 12)}`;
      const providerUser = await prisma.user.upsert({
        where: { id: providerUserId },
        update: {},
        create: {
          id: providerUserId,
          phone: `138${String(Math.floor(Math.random() * 1e8)).padStart(8, '0')}`,
          nickname: providerName,
          role: 'PROVIDER',
          status: 'ACTIVE',
        },
      });

      // 2. 写入 Service（关联 providerId）
      const upsert = await batchUpsertServices(prisma, [{ ...input, providerId: providerUser.id }]);
      logger.info(`[${i + 1}/${uniqueServices.length}] Service created → ${input.title} (provider:${providerUser.nickname})`);
    }
    logger.info(`✅ Service 写入完成，共 ${uniqueServices.length} 条`);
  }

  // ── Phase 2: 成长学院课程数据 ──────────────────────────────────────────
  logger.info('>>> 阶段 2/2: 成长学院课程数据');

  const enabledFetchers: Array<{ name: string; run: () => Promise<any> }> = [];
  if (SITES.zhihu.enabled)    enabledFetchers.push({ name: 'Zhihu',   run: () => fetchZhihuCourses() });
  if (SITES.bilibili.enabled) enabledFetchers.push({ name: 'Bilibili',run: () => fetchBilibiliCourses() });
  if (SITES.juejin.enabled)   enabledFetchers.push({ name: 'JueJin',  run: () => fetchJuejinCourses() });

  let totalCourses = 0;
  let totalMentors = 0;

  for (const { name, run } of enabledFetchers) {
    logger.info(`\n▶ ${name} 平台抓取中...`);
    const rawCourses = await run();
    const uniqueCourses = deduplicateByHash(rawCourses.data, 'url');
    logger.info(`[${name}] 生成课程数据 ${uniqueCourses.length} 条`);

    for (let i = 0; i < uniqueCourses.length; i++) {
      try {
        const raw = uniqueCourses[i];
        const { course: input, mentor: mentorData } = adaptCourse(raw);

        // 1. 确保讲师对应的 User 存在（基于讲师名生成稳定ID）
        const authorKey = mentorData.name.length > 2 ? mentorData.name : `author-${i}`;
        const mentorUserId = `mentor-${require('crypto').createHash('sha256').update(authorKey).digest('hex').slice(0, 12)}`;
        const mentorUser = await prisma.user.upsert({
          where: { id: mentorUserId },
          update: {},
          create: {
            id: mentorUserId,
            phone: `138${String(Math.floor(Math.random() * 1e8)).padStart(8, '0')}`,
            nickname: mentorData.name,
            role: 'MENTOR',
            status: 'ACTIVE',
          },
        });

        // 2. Upsert Mentor（基于外部哈希幂等，同一讲师多门课程共享同一记录）
        const mentorUpsert = await prisma.mentor.upsert({
          where: { externalHash: mentorData.externalHash },
          update: { ...mentorData, userId: mentorUser.id },
          create: { ...mentorData, userId: mentorUser.id },
        });
        totalMentors++;

        // 3. Create Course
        const course = await prisma.course.create({
          data: {
            ...input,
            instructorId: mentorUser.id,
            instructorName: mentorData.name,
          },
          select: { id: true, title: true },
        });
        totalCourses++;
        logger.info(`  [${i + 1}/${uniqueCourses.length}] Course created → ${course.title} (instructor:${mentorData.name})`);
      } catch (err: any) {
        logger.error(`  [${name}] 写入失败: ${err.message}`);
      }
    }

    logger.info(`✅ ${name} 写入完成 — 新增导师 ${uniqueCourses.length} 人，课程 ${uniqueCourses.length} 门`);
  }

  logger.info(`\n🎉 数据采集完成`);
  logger.info(`统计汇总: Service=${(await prisma.service.count())}, Course=${totalCourses}, Mentor=${totalMentors}`);
}

main()
  .catch((err) => {
    logger.error('采集脚本异常:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
