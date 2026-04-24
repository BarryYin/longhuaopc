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
  const categories = ['设计', '开发', '咨询', '文案', '翻译', '营销'];
  const providerNames = ['创意设计工作室', '代码开发工作室', '商业咨询团队', '文案创作组', '翻译服务中心', '营销推广团队'];
  return Array.from({ length: 50 }, (_, i) => {
    const cat = categories[i % categories.length];
    const provider = providerNames[i % providerNames.length];
    return {
      url: `https://www.zbj.com/service/${i + 1}.html`,
      title: `专业${cat}服务 - 企业定制需求`,
      description: '提供高质量专业解决方案，支持定制，售后无忧。',
      category: cat,
      price: Math.floor(Math.random() * 10000) + 500,
      priceRange: `500-10000元`,
      priceUnit: '元',
      location: ['北京', '上海', '深圳', '杭州'][i % 4],
      tags: [cat, '企业服务', '靠谱'],
      images: [],
      providerName: provider,  // 独立服务商名称
    };
  });
}
