import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PoliciesService } from './policies.service';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { QueryPoliciesDto, MatchPoliciesDto, CreatePolicyDto } from './dto';

@ApiTags('政策')
@Controller('policies')
export class PoliciesController {
  constructor(private policiesService: PoliciesService) {}

  @Get()
  @ApiOperation({ summary: '获取政策列表' })
  async findAll(@Query() query: QueryPoliciesDto) {
    return this.policiesService.findAll(query);
  }

  @Get('match')
  @ApiOperation({ summary: '智能匹配政策' })
  async match(@Query() dto: MatchPoliciesDto) {
    return this.policiesService.matchPolicies(dto);
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取收藏的政策' })
  async getFavorites(@Request() req) {
    return this.policiesService.getFavorites(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取政策详情' })
  async findById(@Param('id') id: string) {
    return this.policiesService.findById(id);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '收藏/取消收藏政策' })
  async favorite(@Request() req, @Param('id') policyId: string) {
    return this.policiesService.favorite(req.user.userId, policyId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建政策（管理员）' })
  async create(@Request() req, @Body() dto: CreatePolicyDto) {
    // TODO: 检查管理员权限
    return this.policiesService.create(dto, req.user.userId);
  }
}
