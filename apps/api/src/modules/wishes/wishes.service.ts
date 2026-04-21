import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class WishesService {
  private readonly logger = new Logger(WishesService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: any) {
    const wish = await this.prisma.wish.create({
      data: {
        userId,
        title: dto.title,
        category: dto.category,
        source: dto.source || 'manual',
        sourceSessionId: dto.sourceSessionId,
        originalContext: dto.originalContext || undefined,
        extractedIntent: dto.extractedIntent || undefined,
        confidence: dto.confidence ?? 1.0,
        priority: dto.priority || 'medium',
        executionConfig: dto.executionConfig || undefined,
        status: dto.source === 'conversation' ? 'needs_confirm' : 'needs_confirm',
      },
    });

    this.logger.log(`Wish created: ${wish.id} - ${wish.title}`);
    return wish;
  }

  async findById(id: string) {
    const wish = await this.prisma.wish.findUnique({
      where: { id },
      include: { executions: { orderBy: { startedAt: 'desc' } } },
    });
    if (!wish) throw new NotFoundException('心愿不存在');
    return wish;
  }

  async findByUser(userId: string, options?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, category, page = 1, limit = 20 } = options || {};
    const where: any = { userId };
    if (status) where.status = status;
    if (category) where.category = category;

    const [items, total] = await Promise.all([
      this.prisma.wish.findMany({
        where,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          executions: {
            orderBy: { startedAt: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.wish.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async confirm(id: string, userId: string, dto?: any) {
    const wish = await this.prisma.wish.findFirst({ where: { id, userId } });
    if (!wish) throw new NotFoundException('心愿不存在');
    if (wish.status !== 'needs_confirm') {
      throw new BadRequestException(`当前状态 ${wish.status} 不允许确认`);
    }

    const updated = await this.prisma.wish.update({
      where: { id },
      data: {
        status: 'confirmed',
        confirmedAt: new Date(),
        ...(dto?.title && { title: dto.title }),
        ...(dto?.category && { category: dto.category }),
        ...(dto?.priority && { priority: dto.priority }),
        ...(dto?.executionConfig && { executionConfig: dto.executionConfig }),
      },
    });

    this.logger.log(`Wish confirmed: ${id}`);
    return updated;
  }

  async confirmAll(userId: string, ids: string[]) {
    const results = await Promise.allSettled(
      ids.map((id) => this.confirm(id, userId)),
    );
    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    this.logger.log(`Batch confirm: ${succeeded} succeeded, ${failed} failed`);
    return { succeeded, failed, total: ids.length };
  }

  async cancel(id: string, userId: string) {
    const wish = await this.prisma.wish.findFirst({ where: { id, userId } });
    if (!wish) throw new NotFoundException('心愿不存在');
    if (!['needs_confirm', 'confirmed'].includes(wish.status)) {
      throw new BadRequestException(`当前状态 ${wish.status} 不允许取消`);
    }

    return this.prisma.wish.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }

  async delete(id: string, userId: string) {
    const wish = await this.prisma.wish.findFirst({ where: { id, userId } });
    if (!wish) throw new NotFoundException('心愿不存在');
    return this.prisma.wish.delete({ where: { id } });
  }

  async getConfirmedForExecution(limit = 5) {
    return this.prisma.wish.findMany({
      where: { status: 'confirmed' },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      take: limit,
      include: { user: true },
    });
  }

  async markQueued(id: string) {
    return this.prisma.wish.update({
      where: { id },
      data: { status: 'queued' },
    });
  }

  async markExecuting(id: string) {
    return this.prisma.wish.update({
      where: { id },
      data: { status: 'executing' },
    });
  }

  async markDone(id: string, result: any, summary: string) {
    return this.prisma.wish.update({
      where: { id },
      data: {
        status: 'done',
        result,
        resultSummary: summary,
        executedAt: new Date(),
      },
    });
  }

  async markFailed(id: string, error: string) {
    return this.prisma.wish.update({
      where: { id },
      data: {
        status: 'failed',
        resultSummary: error,
        executedAt: new Date(),
      },
    });
  }

  async createExecution(wishId: string) {
    return this.prisma.wishExecution.create({
      data: { wishId, status: 'running' },
    });
  }

  async completeExecution(executionId: string, data: any) {
    return this.prisma.wishExecution.update({
      where: { id: executionId },
      data: {
        ...data,
        completedAt: new Date(),
      },
    });
  }

  async getStats(userId: string) {
    const [total, byStatus, byCategory] = await Promise.all([
      this.prisma.wish.count({ where: { userId } }),
      this.prisma.wish.groupBy({
        by: ['status'],
        where: { userId },
        _count: true,
      }),
      this.prisma.wish.groupBy({
        by: ['category'],
        where: { userId },
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byCategory: byCategory.reduce((acc, item) => {
        acc[item.category] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
