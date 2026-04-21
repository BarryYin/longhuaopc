import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ServiceStatus, DemandStatus } from '@prisma/client';
import { CreateServiceDto, CreateDemandDto, QueryServicesDto, QueryDemandsDto } from './dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  // 服务相关
  async findServices(query: QueryServicesDto) {
    const where: any = { status: ServiceStatus.PUBLISHED };

    if (query.category) where.category = query.category;
    if (query.minPrice) where.price = { gte: query.minPrice };
    if (query.maxPrice) where.price = { lte: query.maxPrice };

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        include: { provider: { select: { nickname: true, avatar: true, level: true } } },
        orderBy: query.sortBy === 'rating' ? { rating: 'desc' } : { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.service.count({ where }),
    ]);

    return { data: services, pagination: { page: query.page, pageSize: query.pageSize, total } };
  }

  async findServiceById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { provider: { select: { nickname: true, avatar: true, bio: true, level: true } } },
    });
    if (!service) throw new NotFoundException('服务不存在');

    // 增加浏览量
    await this.prisma.service.update({ where: { id }, data: { viewCount: { increment: 1 } } });
    return service;
  }

  async createService(providerId: string, dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        ...dto,
        providerId,
        status: ServiceStatus.PUBLISHED,
      },
    });
  }

  // 需求相关
  async findDemands(query: QueryDemandsDto) {
    const where: any = { status: DemandStatus.OPEN };
    if (query.category) where.category = query.category;

    const [demands, total] = await Promise.all([
      this.prisma.demand.findMany({
        where,
        include: { requester: { select: { nickname: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.demand.count({ where }),
    ]);

    return { data: demands, pagination: { page: query.page, pageSize: query.pageSize, total } };
  }

  async createDemand(requesterId: string, dto: CreateDemandDto) {
    return this.prisma.demand.create({
      data: {
        ...dto,
        requesterId,
        status: DemandStatus.OPEN,
      },
    });
  }
}
