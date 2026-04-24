// @ts-nocheck

import { Prisma } from '@prisma/client';

const CourseCategoryMap: Record<string, string> = {
  'AI': 'AI_TOOLS',
  '绘画': 'AI_TOOLS',
  'Prompt': 'AI_TOOLS',
  '开发': 'AI_TOOLS',
  'LLM': 'AI_TOOLS',
  'TensorFlow': 'AI_TOOLS',
  '机器学习': 'AI_TOOLS',
  '深度学习': 'AI_TOOLS',
  '创业': 'BUSINESS_MODEL',
  '商业': 'BUSINESS_MODEL',
  '产品': 'BUSINESS_MODEL',
  '个人品牌': 'PERSONAL_BRAND',
  '法律': 'LEGAL_FINANCE',
  '财务': 'LEGAL_FINANCE',
  '营销': 'MARKETING',
  '运营': 'MARKETING',
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
  // 基于作者名生成稳定哈希，同一讲师多门课程复用同一 mentor
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

  const course = {
    title:              raw.title,
    description:        raw.description || '',
    tags:               raw.tags || [],
    price:              raw.price ?? 0,
    studentCount:       raw.metrics?.viewCount ?? 0,
    reviewCount:        raw.metrics?.likeCount ?? raw.metrics?.collectCount ?? 0,
    externalHash:       courseHash,
    externalSourceUrl:  raw.url,
    source:             'ingestion',
    isReadonly:         true,
    category:           mapCourseCategory(raw.tags || []),
  };

  return { course, mentor };
}
