import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { CreateServiceDto, CreateDemandDto, QueryServicesDto, QueryDemandsDto } from './dto';

@ApiTags('技能市场')
@Controller('skills')
export class SkillsController {
  constructor(private skillsService: SkillsService) {}

  @Get('services')
  @ApiOperation({ summary: '获取服务列表' })
  async findServices(@Query() query: QueryServicesDto) {
    return this.skillsService.findServices(query);
  }

  @Get('services/:id')
  @ApiOperation({ summary: '获取服务详情' })
  async findServiceById(@Param('id') id: string) {
    return this.skillsService.findServiceById(id);
  }

  @Post('services')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发布服务' })
  async createService(@Request() req, @Body() dto: CreateServiceDto) {
    return this.skillsService.createService(req.user.userId, dto);
  }

  @Get('services/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '我的服务列表' })
  async findMyServices(@Request() req) {
    return { data: await this.skillsService.findMyServices(req.user.userId) };
  }

  @Get('demands')
  @ApiOperation({ summary: '获取需求列表' })
  async findDemands(@Query() query: QueryDemandsDto) {
    return this.skillsService.findDemands(query);
  }

  @Get('demands/:id')
  @ApiOperation({ summary: '获取需求详情' })
  async findDemandById(@Param('id') id: string) {
    return this.skillsService.findDemandById(id);
  }

  @Post('demands')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发布需求' })
  async createDemand(@Request() req, @Body() dto: CreateDemandDto) {
    return this.skillsService.createDemand(req.user.userId, dto);
  }

  @Get('demands/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '我的需求列表' })
  async findMyDemands(@Request() req) {
    return { data: await this.skillsService.findMyDemands(req.user.userId) };
  }
}
