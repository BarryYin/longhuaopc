import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { CreatePostDto, CreateCommentDto, QueryPostsDto } from './dto';

@ApiTags('社区')
@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('posts')
  @ApiOperation({ summary: '获取帖子列表' })
  async findPosts(@Query() query: QueryPostsDto) {
    return this.communityService.findPosts(query);
  }

  @Get('posts/:id')
  @ApiOperation({ summary: '获取帖子详情' })
  async findPostById(@Param('id') id: string) {
    return this.communityService.findPostById(id);
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发布帖子' })
  async createPost(@Request() req, @Body() dto: CreatePostDto) {
    return this.communityService.createPost(req.user.userId, dto);
  }

  @Post('posts/:id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '点赞帖子' })
  async likePost(@Param('id') id: string) {
    return this.communityService.likePost(id);
  }

  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发表评论' })
  async createComment(
    @Request() req,
    @Param('id') postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.communityService.createComment(postId, req.user.userId, dto);
  }
}
