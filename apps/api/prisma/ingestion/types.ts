// @ts-nocheck

/**
 * 原始抓取数据的通用类型定义
 * 各平台 fetcher 返回的数据格式
 */

export type RawService = {
  url: string;
  title: string;
  description?: string;
  category: string;           // 原始分类（中文或英文）
  price?: number;
  priceRange?: string;        // 如 "500-1000元"
  priceUnit?: string;
  location?: string;
  tags?: string[];
  images?: string[];
  providerName?: string;  // 服务提供者名称（用于生成独立 User）
  providerId?: string;
};

export type RawMentor = {
  name: string;
  avatar?: string;
  bio?: string;
  rating?: string | number;
  reviewCount?: number;
  contact?: string;           // 联系方式（手机/微信）
  platform?: string;
};

export type RawCourse = {
  url: string;
  title: string;
  description?: string;
  price?: number;
  priceUnit?: string;
  tags?: string[];
  mentor: RawMentor;
  platform?: string;
  metrics?: {
    viewCount?: number;
    likeCount?: number;
    coinCount?: number;
    collectCount?: number;
  };
};

export type FetcherResult<T> = {
  success: boolean;
  data: T[];
  errors?: Array<{ platform: string; message: string }>;
};
