// @ts-nocheck

import { Prisma } from '@prisma/client';

const CourseCategoryMap: Record<string, string> = {
  // AI 工具
  'AI': 'AI_TOOLS',
  '绘画': 'AI_TOOLS',
  'Prompt': 'AI_TOOLS',
  '开发': 'AI_TOOLS',
  'LLM': 'AI_TOOLS',
  'TensorFlow': 'AI_TOOLS',
  '机器学习': 'AI_TOOLS',
  '深度学习': 'AI_TOOLS',

  // 商业模式
  '创业': 'BUSINESS_MODEL',
  '商业': 'BUSINESS_MODEL',
  '产品': 'BUSINESS_MODEL',

  // 个人品牌
  '个人品牌': 'PERSONAL_BRAND',

  // 法律财务
  '法律': 'LEGAL_FINANCE',
  '财务': 'LEGAL_FINANCE',

  // 营销
  '营销': 'MARKETING',
  '运营': 'MARKETING',

  // 视频/自媒体
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

  // 其他
  '前端': 'OTHER',
  '后端': 'OTHER',
  'Go': 'OTHER',
  'Rust': 'OTHER',
  'Docker': 'OTHER',
  'K8s': 'OTHER',
  'Serverless': 'OTHER',
  'Scrum': 'OTHER',
  '敏捷': 'OTHER',
};

function mapCourseCategory(tags: string[]): string {
  for (const tag of tags) {
    for (const [key, value] of Object.entries(CourseCategoryMap)) {
      if (tag.includes(key)) return value;
    }
  }
  return 'OTHER';
}

/**
 * 将原始课程数据转换为独立的 Course input 与 Mentor input
 * 支持字段：title, description, author, authorAvatar, tags, platform, metrics, price
 */
export function adaptCourse(raw: any): { course: any; mentor: any } {
  const courseHash = require('crypto').createHash('sha256').update(raw.url + raw.title).digest('hex');
  const authorName = raw.author || raw.authorName || '未知讲师';
  const mentorHash = require('crypto').createHash('sha256').update(`mentor:${authorName}`).digest('hex');

  const mentor = {
    externalHash: mentorHash,
    name: authorName,
    title: authorName,
    bio: raw.description || `来自${raw.platform || '网络'}的${authorName}`,
    expertise: raw.tags || [],
    avatar: raw.authorAvatar || raw.avatar || null,
    source: 'ingestion',
  };

  // 分类处理：优先使用 raw.category，其次通过 tags 映射
  let category = 'OTHER';
  if (raw.category && typeof raw.category === 'string') {
    // 如果 raw.category 已经是枚举值之一
    const validCategories = ['AI_TOOLS', 'BUSINESS_MODEL', 'PERSONAL_BRAND', 'LEGAL_FINANCE', 'MARKETING', 'OTHER', 'VIDEO_PRODUCTION', 'AI_COMIC', 'CONTENT_CREATION', 'SOCIAL_MEDIA'];
    if (validCategories.includes(raw.category)) {
      category = raw.category;
    } else {
      // 否则通过映射表转换
      category = mapCourseCategory([raw.category]);
    }
  } else {
    category = mapCourseCategory(raw.tags || []);
  }

  // 促销字段
  const isFree = raw.isFree || (raw.price === 0);
  const originalPrice = raw.originalPrice || (isFree ? (raw.price || 0) + Math.floor(Math.random() * 300) + 100 : undefined);
  const priceDisplay = isFree ? 0 : (raw.price ?? 99);
  const discountTag = isFree ? '限时免费' : (originalPrice ? `立省${Math.round((originalPrice - priceDisplay) / originalPrice * 100)}%` : undefined);

  // 随机生成促销结束时间（7天内）
  const promoEndDate = isFree || originalPrice ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null;

  const course = {
    title:              raw.title,
    description:        raw.description || '',
    tags:               raw.tags || [],
    price:              priceDisplay,
    originalPrice,
    isFree,
    promoEndDate,
    discountTag,
    studentCount:       raw.metrics?.viewCount ?? 0,
    reviewCount:        raw.metrics?.likeCount ?? raw.metrics?.collectCount ?? 0,
    externalHash:       courseHash,
    externalSourceUrl:  raw.url,
    source:             'ingestion',
    isReadonly:         true,
    category,
  };

  return { course, mentor };
}
