import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CourseStatus } from '@prisma/client';

@Injectable()
export class TrainingService {
  constructor(private prisma: PrismaService) {}

  async findCourses(query: any) {
    const where: any = { status: CourseStatus.PUBLISHED };
    if (query.category) where.category = query.category;

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.course.count({ where }),
    ]);

    return { data: courses, pagination: { page: query.page, pageSize: query.pageSize, total } };
  }

  async findMentors(query: any) {
    const where: any = { status: 'APPROVED' };
    if (query.expertise) where.expertise = { has: query.expertise };

    const [mentors, total] = await Promise.all([
      this.prisma.mentor.findMany({
        where,
        orderBy: { rating: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.mentor.count({ where }),
    ]);

    return { data: mentors, pagination: { page: query.page, pageSize: query.pageSize, total } };
  }
}
