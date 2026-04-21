import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateProfileDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 清理敏感信息
  sanitizeUser(user: User) {
    const { password, ...sanitized } = user as any;
    return sanitized;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        nickname: dto.nickname,
        avatar: dto.avatar,
        bio: dto.bio,
        location: dto.location,
        industry: dto.industry,
        companyStatus: dto.companyStatus,
        companyName: dto.companyName,
        ...(dto.tags && { tags: dto.tags }),
      },
    });
    return this.sanitizeUser(user);
  }

  async getProfile(userId: string) {
    return this.findById(userId);
  }
}
