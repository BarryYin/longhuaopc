import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { PolicyCategory, Prisma } from '@prisma/client';
import { QueryPoliciesDto, MatchPoliciesDto, CreatePolicyDto } from './dto';

@Injectable()
export class PoliciesService {
  constructor(private prisma: PrismaService) {}

  // 查询政策列表
  async findAll(query: QueryPoliciesDto) {
    const where: Prisma.PolicyWhereInput = {
      status: 'PUBLISHED',
    };

    if (query.category) {
      where.category = query.category as PolicyCategory;
    }

    if (query.keyword) {
      where.OR = [
        { title: { contains: query.keyword, mode: 'insensitive' } },
        { summary: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }

    const [policies, total] = await Promise.all([
      this.prisma.policy.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        select: {
          id: true,
          title: true,
          summary: true,
          category: true,
          tags: true,
          viewCount: true,
          createdAt: true,
        },
      }),
      this.prisma.policy.count({ where }),
    ]);

    return {
      data: policies,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  }

  // 获取政策详情
  async findById(id: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id },
    });

    if (!policy) {
      throw new NotFoundException('政策不存在');
    }

    // 增加浏览量
    await this.prisma.policy.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return policy;
  }

  // 智能匹配政策
  async matchPolicies(dto: MatchPoliciesDto) {
    // 基础匹配逻辑：根据用户画像筛选政策
    const where: Prisma.PolicyWhereInput = {
      status: 'PUBLISHED',
    };

    // 根据创业领域匹配
    if (dto.industry === 'AI') {
      where.OR = [
        { category: 'COMPUTING' },
        { tags: { has: 'AI' } },
        { tags: { has: '人工智能' } },
      ];
    }

    // 根据地区匹配
    if (dto.location?.includes('龙华') || dto.location?.includes('徐汇')) {
      where.tags = { hasSome: ['龙华', '徐汇', '漕河泾', '西岸', '模速空间'] };
    }

    const policies = await this.prisma.policy.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // 计算匹配度（简化版）
    const matches = policies.map((policy) => {
      let score = 50; // 基础分

      // 根据关键词增加匹配度
      if (dto.description) {
        const keywords = ['算力', '场地', '资金', '人才', '税收'];
        keywords.forEach((kw) => {
          if (dto.description.includes(kw) && policy.title.includes(kw)) {
            score += 15;
          }
        });
      }

      return {
        ...policy,
        matchScore: Math.min(score, 100),
        reason: this.generateMatchReason(policy, dto),
      };
    });

    // 按匹配度排序
    matches.sort((a, b) => b.matchScore - a.matchScore);

    return {
      matches: matches.slice(0, 5),
      userProfile: dto,
    };
  }

  private generateMatchReason(policy: any, dto: MatchPoliciesDto): string {
    const reasons: string[] = [];

    if (policy.category === 'COMPUTING' && dto.industry === 'AI') {
      reasons.push('AI企业可申请算力补贴');
    }
    if (policy.category === 'SPACE') {
      reasons.push('提供低成本办公空间');
    }

    return reasons.join('，') || '符合您的创业需求';
  }

  // 创建政策（管理员用）
  async create(dto: CreatePolicyDto, createdBy: string) {
    return this.prisma.policy.create({
      data: {
        ...dto,
        validFrom: new Date(dto.validFrom),
        validTo: dto.validTo ? new Date(dto.validTo) : undefined,
        publishDate: new Date(),
        createdBy,
        status: 'PENDING',
      },
    });
  }

  // 收藏政策
  async favorite(userId: string, policyId: string) {
    const existing = await this.prisma.userFavorite.findUnique({
      where: {
        userId_policyId: { userId, policyId },
      },
    });

    if (existing) {
      // 取消收藏
      await this.prisma.userFavorite.delete({
        where: { id: existing.id },
      });
      await this.prisma.policy.update({
        where: { id: policyId },
        data: { favoriteCount: { decrement: 1 } },
      });
      return { favorited: false };
    } else {
      // 添加收藏
      await this.prisma.userFavorite.create({
        data: { userId, policyId },
      });
      await this.prisma.policy.update({
        where: { id: policyId },
        data: { favoriteCount: { increment: 1 } },
      });
      return { favorited: true };
    }
  }

  // 获取用户的收藏列表
  async getFavorites(userId: string) {
    const favorites = await this.prisma.userFavorite.findMany({
      where: { userId },
      include: {
        policy: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => f.policy);
  }
}
