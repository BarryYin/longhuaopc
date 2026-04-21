import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';

@Injectable()
export class AiGatewayService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  // 生成API Key
  async generateApiKey(userId: string, name: string, type: 'live' | 'test') {
    const keyId = crypto.randomUUID();
    const keyPlain = `sk_${type}_${crypto.randomBytes(32).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(keyPlain).digest('hex');
    const keyPrefix = keyPlain.slice(0, 12);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        userId,
        name,
        type: type.toUpperCase() as any,
        keyHash,
        keyPrefix,
        rateLimit: type === 'live' ? 1000 : 100,
      },
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      type: apiKey.type,
      key: keyPlain, // 只返回一次
      prefix: keyPrefix,
      createdAt: apiKey.createdAt,
    };
  }

  // 验证API Key
  async validateApiKey(keyPlain: string) {
    const keyHash = crypto.createHash('sha256').update(keyPlain).digest('hex');

    const apiKey = await this.prisma.apiKey.findFirst({
      where: { keyHash, status: 'ACTIVE' },
      include: { user: true },
    });

    if (!apiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      throw new UnauthorizedException('API Key expired');
    }

    // 检查日配额
    const today = new Date().toISOString().split('T')[0];
    const dailyKey = `api:daily:${apiKey.id}:${today}`;
    const dailyCount = parseInt((await this.redisService.get(dailyKey)) || '0');

    if (dailyCount >= apiKey.dailyQuota) {
      throw new ForbiddenException('Daily quota exceeded');
    }

    // 检查速率限制
    const rateKey = `api:rate:${apiKey.id}`;
    const rateCount = await this.redisService.increment(rateKey);
    if (rateCount === 1) {
      await this.redisService.expire(rateKey, 60); // 1分钟窗口
    }

    if (rateCount > apiKey.rateLimit) {
      throw new ForbiddenException('Rate limit exceeded');
    }

    // 更新调用统计
    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: {
        callCount: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });

    // 增加日调用计数
    await this.redisService.increment(dailyKey);
    await this.redisService.expire(dailyKey, 24 * 60 * 60); // 24小时过期

    return {
      userId: apiKey.userId,
      apiKeyId: apiKey.id,
    };
  }

  // 获取用户的API Keys
  async getUserApiKeys(userId: string) {
    const keys = await this.prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        type: true,
        keyPrefix: true,
        rateLimit: true,
        dailyQuota: true,
        callCount: true,
        lastUsedAt: true,
        status: true,
        createdAt: true,
      },
    });

    return keys;
  }

  // 撤销API Key
  async revokeApiKey(userId: string, keyId: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id: keyId, userId },
    });

    if (!apiKey) {
      throw new UnauthorizedException('API Key not found');
    }

    await this.prisma.apiKey.update({
      where: { id: keyId },
      data: { status: 'REVOKED' },
    });

    return { revoked: true };
  }

  // 记录API调用日志
  async logApiCall(logData: {
    keyId?: string;
    userId: string;
    method: string;
    endpoint: string;
    path: string;
    query?: any;
    body?: any;
    statusCode: number;
    responseSize: number;
    latency: number;
    ip: string;
    userAgent?: string;
    error?: string;
  }) {
    await this.prisma.apiLog.create({
      data: logData,
    });
  }
}