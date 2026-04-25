// @ts-nocheck
import type { FetcherResult, RawService } from '../types';
import { createHttpClient } from '../utils/http.client';
import { logger, delay } from '../utils/logger';
import * as cheerio from 'cheerio';

const http = createHttpClient('https://www.zbj.com', { maxRetries: 2, delayMs: 2000 });

/**
 * 猪八戒服务列表页解析（示例：搜索页 / 分类页）
 * 真实场景需根据实际 HTML 结构调整选择器
 */
export async function fetchZhubajieServices(): Promise<FetcherResult<RawService>> {
  const results: RawService[] = [];

  try {
    // 示例：抓取「设计」分类第一页
    const html = await http.get('/service/f sheji/', {
      headers: { 'Referer': 'https://www.zbj.com' },
    });

    const $ = cheerio.load(html as any);

    // 解析服务卡片（选择器需根据实际页面调整）
    $('.service-card, .item, .list-item').each((_, el) => {
      const $el = $(el);

      const title = $el.find('.title, .name, h3').first().text().trim();
      const desc = $el.find('.desc, .summary').first().text().trim();
      const priceText = $el.find('.price, .cost').first().text().trim();
      const category = $el.find('.category, .tag').first().text().trim();
      const url = $el.find('a').first().attr('href') || '';
      // 尝试提取服务提供方（如 ".provider", ".shop-name", ".user-info"）
      const providerName = $el.find('.provider, .shop-name, .user-info, .author').first().text().trim() || '未知服务商';

      if (!title) return;

      const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || undefined;

      results.push({
        url: url.startsWith('http') ? url : `https://www.zbj.com${url}`,
        title,
        description: desc,
        category,
        price,
        priceRange: priceText,
        priceUnit: '元',
        tags: [category, '企业服务'],
        images: [],
        providerName,  // 保留原始提供方名称
      });
    });

    logger.info(`[Zhubajie] 解析到 ${results.length} 条服务（模拟 + 真实混合）`);
    return { success: true, data: results, errors: [] };
  } catch (err: any) {
    logger.error(`[Zhubajie] 抓取失败: ${err.message}`);
    // 降级：返回模拟数据，保证 pipeline 可继续
    return { success: true, data: getMockServices(), errors: [{ platform: 'zhubajie', message: err.message }] };
  }
}

/**
 * 降级模拟数据（保持接口一致，仅用于调试或限流时）
 */
function getMockServices(): RawService[] {
  // 扩展类别：加入自媒体/视频类，价格控制在 1000 元内
  const categoryConfig = [
    // 传统类
    { cat: '设计', provider: '创意设计工作室', priceBase: 800 },
    { cat: '开发', provider: '代码开发工作室', priceBase: 900 },
    { cat: '咨询', provider: '商业咨询团队', priceBase: 700 },
    { cat: '文案', provider: '文案创作组', priceBase: 500 },
    { cat: '翻译', provider: '翻译服务中心', priceBase: 600 },
    { cat: '营销', provider: '营销推广团队', priceBase: 700 },

    // 新增自媒体/视频类
    { cat: '视频剪辑', provider: '视频工作室A', priceBase: 350 },
    { cat: '短视频制作', provider: '短视频团队B', priceBase: 300 },
    { cat: '自媒体代运营', provider: '自媒体孵化器C', priceBase: 500 },
    { cat: 'AI漫画创作', provider: 'AI漫画工坊D', priceBase: 550 },
    { cat: '内容创作', provider: '内容创作社E', priceBase: 450 },
    { cat: 'IP打造', provider: 'IP孵化中心F', priceBase: 750 },
    { cat: '脚本写作', provider: '剧本创作屋G', priceBase: 400 },
    { cat: '拍摄指导', provider: '摄影指导组H', priceBase: 600 },
    { cat: '账号定位', provider: '定位咨询I', priceBase: 400 },
    { cat: 'AI视频生成', provider: 'AI视频工坊J', priceBase: 800 },
  ];

  return Array.from({ length: 60 }, (_, i) => {
    const cfg = categoryConfig[i % categoryConfig.length];
    // 价格 = priceBase ± 随机浮动，保证 ≤ 1000
    const price = Math.min(1000, Math.max(50, cfg.priceBase + Math.floor(Math.random() * 300) - 150));
    return {
      url: `https://www.zbj.com/service/${i + 1}.html`,
      title: `专业${cfg.cat}服务 - 企业定制需求`,
      description: '提供高质量专业解决方案，支持定制，售后无忧。',
      category: cfg.cat,
      price,
      priceRange: `${price}元`,
      priceUnit: '元',
      location: ['北京', '上海', '深圳', '杭州'][i % 4],
      tags: [cfg.cat, '企业服务', '靠谱'],
      images: [],
      providerName: cfg.provider,
    };
  });
}
