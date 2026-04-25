import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CourseStatus } from '@prisma/client';

@Injectable()
export class TrainingService {
  constructor(private prisma: PrismaService) {}

  async findCourses(query: any) {
    const where: any = { status: CourseStatus.PUBLISHED };
    if (query.category) where.category = query.category;

    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.course.count({ where }),
    ]);

    return { data: courses, pagination: { page, pageSize, total } };
  }

  async findMentors(query: any) {
    const where: any = { status: 'APPROVED' };
    if (query.expertise) where.expertise = { has: query.expertise };

    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;

    const [mentors, total] = await Promise.all([
      this.prisma.mentor.findMany({
        where,
        orderBy: { rating: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.mentor.count({ where }),
    ]);

    return { data: mentors, pagination: { page, pageSize, total } };
  }

  async findCourseById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) throw new NotFoundException('课程不存在');
    return course;
  }

  async findMentorById(id: string) {
    const mentor = await this.prisma.mentor.findUnique({
      where: { id },
    });
    if (!mentor) throw new NotFoundException('导师不存在');
    return mentor;
  }
}
