// @ts-nocheck

const ServiceCategory = {
  AI_DEVELOPMENT: 'AI_DEVELOPMENT',
  DESIGN: 'DESIGN',
  COPYWRITING: 'COPYWRITING',
  CONSULTING: 'CONSULTING',
  MARKETING: 'MARKETING',
  TRANSLATION: 'TRANSLATION',
  OTHER: 'OTHER',
  VIDEO_PRODUCTION: 'VIDEO_PRODUCTION',
  AI_COMIC: 'AI_COMIC',
  CONTENT_CREATION: 'CONTENT_CREATION',
  SOCIAL_MEDIA: 'SOCIAL_MEDIA',
};

function mapCategory(cat: string): string {
  const map: Record<string, string> = {
    '设计': 'DESIGN',
    '开发': 'AI_DEVELOPMENT',
    '咨询': 'CONSULTING',
    '文案': 'COPYWRITING',
    '翻译': 'TRANSLATION',
    '营销': 'MARKETING',

    // 自媒体/视频类
    '视频': 'VIDEO_PRODUCTION',
    '剪辑': 'VIDEO_PRODUCTION',
    '拍摄': 'VIDEO_PRODUCTION',
    '自媒体': 'SOCIAL_MEDIA',
    '内容创作': 'CONTENT_CREATION',
    'AI漫画': 'AI_COMIC',
    '漫剧': 'AI_COMIC',
    '短视频': 'SOCIAL_MEDIA',
    'IP打造': 'CONTENT_CREATION',
    '脚本': 'CONTENT_CREATION',
    '运营': 'SOCIAL_MEDIA',

    'other': 'OTHER',
  };

  if (!cat) return ServiceCategory.OTHER;

  // 完整匹配优先
  if (map[cat]) return map[cat];

  // 子串匹配（如 "视频剪辑" 包含 "视频"）
  for (const [key, value] of Object.entries(map)) {
    if (cat.includes(key)) return value;
  }

  return ServiceCategory.OTHER;
}

/**
 * 将原始服务数据映射为 Service Create Input
 * 同时返回需要的 Provider 信息（用于创建/关联 User）
 */
export function adaptService(raw: any): { service: any; providerName: string } {
  // 生成唯一外部哈希
  const externalHash = require('crypto').createHash('sha256').update(raw.url + raw.title).digest('hex');

  // 提取 provider 名称：优先使用原始提供方名称，否则从标题推断
  const providerName = raw.providerName || extractProviderName(raw.title) || '未知服务商';

  const service = {
    title:              raw.title,
    description:        raw.description || '',
    category:          mapCategory(raw.category) as any,
    status:            'PUBLISHED',
    viewCount:         0,
    rating:            0,
    reviewCount:       0,
    tags:              raw.tags || [],
    portfolio:         raw.images || [],
    externalSourceUrl: raw.url,
    externalHash:      externalHash,
    priceUnit:         raw.priceUnit || '元',
    deliveryTime:      '3-7天',
    source:            'ingestion',  // 标注数据来源
  };

  if (raw.price != null) service.price = raw.price;
  if (raw.priceRange) {
    const parts = raw.priceRange.split(/[-~至～]/);
    if (parts[0]) service.priceMin = parseFloat(parts[0]);
    if (parts[1]) service.priceMax = parseFloat(parts[1]);
  }

  return { service, providerName };
}

/**
 * 从标题中推测服务商名称（例如："专业设计服务 - 企业定制需求" → "设计服务"）
 */
function extractProviderName(title: string): string | null {
  if (!title) return null;
  // 简单启发式：取"专业"后的第一个词
  const match = title.match(/专业([^服务]+)服务/);
  if (match) return `${match[1]}服务商`;
  return null;
}
