import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/common/prisma/prisma.service';

interface WishReport {
  userId: string;
  done: Array<{ title: string; summary: string; category: string }>;
  failed: Array<{ title: string; error: string; category: string }>;
  timeout: Array<{ title: string; category: string }>;
  pending: Array<{ title: string; category: string }>;
}

@Injectable()
export class WishReportService {
  private readonly logger = new Logger(WishReportService.name);

  constructor(private prisma: PrismaService) {}

  @Cron('0 8 * * *')
  async morningReport() {
    this.logger.log('=== Generating Morning Wish Reports ===');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const executedWishes = await this.prisma.wish.findMany({
      where: {
        executedAt: {
          gte: yesterday,
          lt: today,
        },
      },
      include: { user: true },
    });

    const userMap = new Map<string, WishReport>();

    for (const wish of executedWishes) {
      if (!userMap.has(wish.userId)) {
        userMap.set(wish.userId, {
          userId: wish.userId,
          done: [],
          failed: [],
          timeout: [],
          pending: [],
        });
      }

      const report = userMap.get(wish.userId)!;

      if (wish.status === 'done') {
        report.done.push({
          title: wish.title,
          summary: wish.resultSummary || '已完成',
          category: wish.category,
        });
      } else if (wish.status === 'failed') {
        report.failed.push({
          title: wish.title,
          error: wish.resultSummary || '未知错误',
          category: wish.category,
        });
      } else if (wish.status === 'timeout') {
        report.timeout.push({
          title: wish.title,
          category: wish.category,
        });
      }
    }

    for (const [userId, report] of userMap) {
      const pending = await this.prisma.wish.findMany({
        where: { userId, status: 'needs_confirm' },
        select: { title: true, category: true },
        take: 5,
      });
      report.pending = pending;
    }

    for (const [userId, report] of userMap) {
      this.logger.log(
        `Report for user ${userId}: ` +
          `${report.done.length} done, ${report.failed.length} failed, ` +
          `${report.timeout.length} timeout, ${report.pending.length} pending`,
      );
      this.formatReport(report);
    }

    this.logger.log(`Generated ${userMap.size} morning reports`);
  }

  private formatReport(report: WishReport): string {
    const lines: string[] = [];
    lines.push('=== 昨夜心愿执行报告 ===\n');

    if (report.done.length > 0) {
      lines.push(`✅ 已完成 (${report.done.length}):`);
      for (const item of report.done) {
        lines.push(`  • [${item.category}] ${item.title}`);
        lines.push(`    → ${item.summary}`);
      }
      lines.push('');
    }

    if (report.failed.length > 0) {
      lines.push(`❌ 失败 (${report.failed.length}):`);
      for (const item of report.failed) {
        lines.push(`  • [${item.category}] ${item.title}`);
        lines.push(`    → ${item.error}`);
      }
      lines.push('');
    }

    if (report.timeout.length > 0) {
      lines.push(`⏳ 超时 (${report.timeout.length}):`);
      for (const item of report.timeout) {
        lines.push(`  • [${item.category}] ${item.title}`);
      }
      lines.push('');
    }

    if (report.pending.length > 0) {
      lines.push(`📋 待确认 (${report.pending.length}):`);
      for (const item of report.pending) {
        lines.push(`  • [${item.category}] ${item.title}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  async generateUserReport(userId: string, since?: Date) {
    const sinceDate = since || new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [done, failed, pending] = await Promise.all([
      this.prisma.wish.findMany({
        where: { userId, status: 'done', executedAt: { gte: sinceDate } },
        orderBy: { executedAt: 'desc' },
      }),
      this.prisma.wish.findMany({
        where: {
          userId,
          status: { in: ['failed', 'timeout'] },
          executedAt: { gte: sinceDate },
        },
        orderBy: { executedAt: 'desc' },
      }),
      this.prisma.wish.findMany({
        where: { userId, status: 'needs_confirm' },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      }),
    ]);

    return {
      since: sinceDate,
      done: done.map((w) => ({
        id: w.id,
        title: w.title,
        category: w.category,
        summary: w.resultSummary,
        executedAt: w.executedAt,
      })),
      failed: failed.map((w) => ({
        id: w.id,
        title: w.title,
        category: w.category,
        error: w.resultSummary,
        status: w.status,
      })),
      pending: pending.map((w) => ({
        id: w.id,
        title: w.title,
        category: w.category,
        confidence: w.confidence,
        createdAt: w.createdAt,
      })),
    };
  }
}
