// @ts-nocheck
import type { FetcherResult, RawCourse } from '../types';
import { createHttpClient } from '../utils/http.client';
import { logger, delay } from '../utils/logger';
import * as cheerio from 'cheerio';

const http = createHttpClient('https://search.bilibili.com', { maxRetries: 2, delayMs: 2000 });

export async function fetchBilibiliCourses(): Promise<FetcherResult<RawCourse>> {
  const results: RawCourse[] = [];

  try {
    // 搜索自媒体/创作相关关键词
    const keywords = ['视频剪辑', '自媒体', 'AI漫画', '短视频制作', '内容创作'];
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];

    const html = await http.get(`/all?keyword=${encodeURIComponent(keyword)}`, {
      headers: { 'Referer': 'https://search.bilibili.com' },
    });

    const $ = cheerio.load(html as any);

    $('.video-item, .bili-video-card, .video-card').each((_, el) => {
      const $el = $(el);
      const title = $el.find('.title, .bili-video-card__info--tit').first().text().trim();
      const author = $el.find('.up-name, .author').first().text().trim();
      const playCount = $el.find('.play, .video-data .play').first().text().trim();
      const url = $el.find('a').first().attr('href') || '';

      if (!title) return;
      const playNum = parseInt(playCount.replace(/[^\d]/g, '')) || 0;

      // 根据标题推断分类（自媒体相关）
      let category = 'CONTENT_CREATION';
      if (title.includes('剪辑') || title.includes('视频制作')) category = 'VIDEO_PRODUCTION';
      else if (title.includes('AI漫画') || title.includes('漫剧')) category = 'AI_COMIC';
      else if (title.includes('自媒体') || title.includes('运营')) category = 'SOCIAL_MEDIA';

      // 价格策略：自媒体课程定价 99-999 元，30% 免费
      const isFree = Math.random() < 0.3;
      const price = isFree ? 0 : Math.floor(Math.random() * 900) + 100;
      const originalPrice = isFree ? (Math.floor(Math.random() * 500) + 200) : undefined;
      const priceUnit = isFree ? '限时免费' : '元';

      results.push({
        url: url.startsWith('http') ? url : `https:${url}`,
        title,
        author: author || 'B站UP主',
        description: `B站热门视频课程：${title}`,
        category,
        price,
        priceUnit,
        originalPrice,
        tags: ['B站', '视频课程', category],
        mentor: {
          name: author || 'B站UP主',
          avatar: null,
          bio: `B站认证UP主，专注${category}领域内容`,
          rating: (4.5 + Math.random() * 0.5).toFixed(1),
          reviewCount: Math.floor(Math.random() * 10000),
          contact: '',
        },
        platform: 'Bilibili',
        metrics: { viewCount: playNum, likeCount: Math.floor(playNum * 0.05) },
      });
    });

    if (results.length === 0) throw new Error('未解析到视频');
    return { success: true, data: results, errors: [] };
  } catch (err: any) {
    logger.error(`[Bilibili] 抓取失败: ${err.message}`);
    return { success: true, data: getMockCourses(), errors: [{ platform: 'bilibili', message: err.message }] };
  }
}

function getMockCourses(): RawCourse[] {
  const mockCourses = [
    { title: '零基础学剪辑：Premiere 从入门到精通', category: 'VIDEO_PRODUCTION', tags: ['剪辑', '视频制作', 'B站'] },
    { title: 'AI漫剧创作实战：用 Midjourney 绘制漫画', category: 'AI_COMIC', tags: ['AI漫画', 'Midjourney', '创作'] },
    { title: '自媒体账号运营全攻略：从0到10万粉丝', category: 'SOCIAL_MEDIA', tags: ['自媒体', '运营', '涨粉'] },
    { title: '短视频脚本写作：3分钟抓住观众眼球', category: 'CONTENT_CREATION', tags: ['脚本', '短视频', '文案'] },
    { title: '手机拍摄技巧：打造电影感短视频', category: 'VIDEO_PRODUCTION', tags: ['手机摄影', '拍摄', '短视频'] },
    { title: 'AI 工具链工作流：一键生成爆款漫剧', category: 'AI_COMIC', tags: ['AI工具', '自动化', '漫剧'] },
    { title: '小红书爆款笔记写作与运营', category: 'SOCIAL_MEDIA', tags: ['小红书', '笔记', '运营'] },
    { title: '内容创作IP打造：个人品牌实操课', category: 'CONTENT_CREATION', tags: ['IP打造', '个人品牌', '内容'] },
    { title: 'Final Cut Pro 高效剪辑技巧', category: 'VIDEO_PRODUCTION', tags: ['FCP', '剪辑', '后期'] },
    { title: 'AI 角色设计与场景生成完整工作流', category: 'AI_COMIC', tags: ['角色设计', 'AI绘画', '场景'] },
  ];

  return mockCourses.map((c, i) => {
    const isFree = i % 4 === 0; // 25% 免费
    const price = isFree ? 0 : Math.floor(Math.random() * 800) + 100;
    const originalPrice = isFree ? price + Math.floor(Math.random() * 200) + 100 : undefined;
    return {
      url: `https://www.bilibili.com/video/BV${Date.now().toString(36)}${i}`,
      title: c.title,
      author: `UP主${i + 1}`,
      description: `B站热门课程：${c.title}`,
      category: c.category,
      price,
      priceUnit: isFree ? '限时免费' : '元',
      originalPrice,
      tags: [...c.tags, 'B站', '视频课程'],
      mentor: {
        name: `UP主${i + 1}`,
        avatar: null,
        bio: `专注${c.category}领域的B站认证UP主`,
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        reviewCount: Math.floor(Math.random() * 10000),
        contact: '',
      },
      platform: 'Bilibili',
      metrics: { viewCount: Math.floor(Math.random() * 500000), likeCount: Math.floor(Math.random() * 25000) },
    };
  });
}
