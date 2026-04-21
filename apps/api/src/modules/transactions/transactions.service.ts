import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TransactionStatus } from '@prisma/client';
import { CreateTransactionDto, UpdateTransactionStatusDto } from './dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTransactionDto) {
    // 生成订单号
    const orderNo = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // 根据类型获取卖家信息
    let sellerId: string;
    let title: string;
    let price: number;

    if (dto.type === 'SERVICE' && dto.serviceId) {
      const service = await this.prisma.service.findUnique({
        where: { id: dto.serviceId },
        include: { provider: true },
      });
      if (!service) throw new NotFoundException('服务不存在');
      sellerId = service.providerId;
      title = service.title;
      price = dto.price || (service.price as any)?.fixed || 0;
    } else if (dto.type === 'DEMAND' && dto.demandId) {
      const demand = await this.prisma.demand.findUnique({
        where: { id: dto.demandId },
        include: { requester: true },
      });
      if (!demand) throw new NotFoundException('需求不存在');
      sellerId = demand.requesterId;
      title = demand.title;
      price = dto.price || (demand.budget as any)?.fixed || 0;
    } else {
      throw new ForbiddenException('无效的交易类型');
    }

    // 不能和自己交易
    if (userId === sellerId) {
      throw new ForbiddenException('不能和自己交易');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        orderNo,
        buyerId: userId,
        sellerId,
        type: dto.type,
        serviceId: dto.serviceId,
        demandId: dto.demandId,
        title,
        price,
        status: TransactionStatus.PENDING,
      },
      include: {
        buyer: { select: { id: true, nickname: true, avatar: true } },
        seller: { select: { id: true, nickname: true, avatar: true } },
      },
    });

    return transaction;
  }

  async findByUser(userId: string, role?: 'buyer' | 'seller') {
    const where: any = {};
    if (role === 'buyer') where.buyerId = userId;
    else if (role === 'seller') where.sellerId = userId;
    else where.OR = [{ buyerId: userId }, { sellerId: userId }];

    const transactions = await this.prisma.transaction.findMany({
      where,
      include: {
        buyer: { select: { id: true, nickname: true, avatar: true } },
        seller: { select: { id: true, nickname: true, avatar: true } },
        service: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return transactions;
  }

  async findById(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        buyer: { select: { id: true, nickname: true, avatar: true } },
        seller: { select: { id: true, nickname: true, avatar: true } },
        service: true,
        messages: {
          include: {
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!transaction) throw new NotFoundException('订单不存在');

    // 检查权限
    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      throw new ForbiddenException('无权查看此订单');
    }

    return transaction;
  }

  async updateStatus(
    id: string,
    userId: string,
    dto: UpdateTransactionStatusDto,
  ) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) throw new NotFoundException('订单不存在');

    // 验证状态流转权限
    const validTransitions = this.getValidTransitions(transaction, userId);
    if (!validTransitions.includes(dto.status)) {
      throw new ForbiddenException('无效的状态变更');
    }

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.status === TransactionStatus.COMPLETED && {
          completedAt: new Date(),
        }),
      },
    });

    return updated;
  }

  private getValidTransitions(
    transaction: any,
    userId: string,
  ): TransactionStatus[] {
    const isBuyer = transaction.buyerId === userId;
    const isSeller = transaction.sellerId === userId;

    switch (transaction.status) {
      case TransactionStatus.PENDING:
        return isSeller ? [TransactionStatus.CONFIRMED] : [];
      case TransactionStatus.CONFIRMED:
        return isSeller ? [TransactionStatus.IN_PROGRESS] : [];
      case TransactionStatus.IN_PROGRESS:
        return isSeller ? [TransactionStatus.DELIVERED] : [];
      case TransactionStatus.DELIVERED:
        return isBuyer ? [TransactionStatus.COMPLETED] : [];
      default:
        return [];
    }
  }

  async addMessage(
    transactionId: string,
    senderId: string,
    content: string,
    attachments?: string[],
  ) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) throw new NotFoundException('订单不存在');
    if (transaction.buyerId !== senderId && transaction.sellerId !== senderId) {
      throw new ForbiddenException('无权发送消息');
    }

    const message = await this.prisma.transactionMessage.create({
      data: {
        transactionId,
        senderId,
        content,
        attachments: attachments || [],
      },
      include: {
      },
    });

    return message;
  }
}
