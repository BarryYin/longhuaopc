import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { CreateTransactionDto, UpdateTransactionStatusDto, CreateMessageDto } from './dto';

@ApiTags('交易')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: '创建订单' })
  async create(@Request() req, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取我的订单' })
  async findByUser(@Request() req, @Query('role') role?: 'buyer' | 'seller') {
    return this.transactionsService.findByUser(req.user.userId, role);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取订单详情' })
  async findById(@Request() req, @Param('id') id: string) {
    return this.transactionsService.findById(id, req.user.userId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: '更新订单状态' })
  async updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionStatusDto,
  ) {
    return this.transactionsService.updateStatus(id, req.user.userId, dto);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: '发送消息' })
  async addMessage(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.transactionsService.addMessage(
      id,
      req.user.userId,
      dto.content,
      dto.attachments,
    );
  }
}
