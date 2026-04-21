import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { PostStatus, Board } from '@prisma/client';
import { CreatePostDto, CreateCommentDto, QueryPostsDto } from './dto';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async findPosts(query: QueryPostsDto) {
    const where: any = { status: PostStatus.PUBLISHED };
    if (query.board) where.board = query.board as Board;
    if (query.tag) where.tags = { has: query.tag };

    const orderBy: any = {};
    if (query.sort === 'hot') {
      orderBy.viewCount = 'desc';
    } else if (query.sort === 'top') {
      orderBy.likeCount = 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          author: { select: { nickname: true, avatar: true, level: true } },
        },
        orderBy,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.post.count({ where }),
    ]);

    return { data: posts, pagination: { page: query.page, pageSize: query.pageSize, total } };
  }

  async findPostById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { nickname: true, avatar: true, bio: true, level: true } },
        comments: {
          include: {
            author: { select: { nickname: true, avatar: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) throw new NotFoundException('帖子不存在');

    await this.prisma.post.update({ where: { id }, data: { viewCount: { increment: 1 } } });
    return post;
  }

  async createPost(authorId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...dto,
        authorId,
        status: PostStatus.PENDING, // 先发后审或先审后发
      },
    });
  }

  async createComment(postId: string, authorId: string, dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        ...dto,
        postId,
        authorId,
      },
    });

    await this.prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    });

    return comment;
  }

  async likePost(postId: string) {
    await this.prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    });
    return { liked: true };
  }
}
