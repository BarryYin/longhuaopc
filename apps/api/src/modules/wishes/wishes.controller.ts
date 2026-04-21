import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WishesService } from './wishes.service';
import { WishExecutorService } from './execution/wish-executor.service';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { CreateWishDto, ConfirmWishDto } from './dto';

@ApiTags('心愿')
@Controller('wishes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishesController {
  constructor(
    private wishesService: WishesService,
    private wishExecutor: WishExecutorService,
  ) {}

  @Post()
  @ApiOperation({ summary: '创建心愿' })
  async create(@Request() req, @Body() dto: CreateWishDto) {
    return this.wishesService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取我的心愿列表' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Request() req,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.wishesService.findByUser(req.user.userId, {
      status,
      category,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('pending')
  @ApiOperation({ summary: '获取待确认心愿' })
  async getPending(@Request() req) {
    return this.wishesService.findByUser(req.user.userId, {
      status: 'needs_confirm',
      limit: 50,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: '获取心愿统计' })
  async getStats(@Request() req) {
    return this.wishesService.getStats(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取心愿详情' })
  async findOne(@Param('id') id: string) {
    return this.wishesService.findById(id);
  }

  @Put(':id/confirm')
  @ApiOperation({ summary: '确认心愿' })
  async confirm(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: ConfirmWishDto,
  ) {
    return this.wishesService.confirm(id, req.user.userId, dto);
  }

  @Post('confirm-batch')
  @ApiOperation({ summary: '批量确认心愿' })
  async confirmBatch(@Request() req, @Body('ids') ids: string[]) {
    return this.wishesService.confirmAll(req.user.userId, ids);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: '取消心愿' })
  async cancel(@Param('id') id: string, @Request() req) {
    return this.wishesService.cancel(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除心愿' })
  async delete(@Param('id') id: string, @Request() req) {
    return this.wishesService.delete(id, req.user.userId);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: '立即执行心愿' })
  async executeNow(@Param('id') id: string, @Request() req) {
    return this.wishExecutor.executeNow(id, req.user.userId);
  }
}
