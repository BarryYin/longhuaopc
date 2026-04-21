import { Controller, Post, Get, Delete, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiGatewayService } from './ai-gateway.service';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { CreateApiKeyDto } from './dto';

@ApiTags('AI Gateway')
@Controller('ai-gateway')
export class AiGatewayController {
  constructor(private aiGatewayService: AiGatewayService) {}

  @Post('keys')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建API Key' })
  async createApiKey(@Request() req, @Body() dto: CreateApiKeyDto) {
    return this.aiGatewayService.generateApiKey(req.user.userId, dto.name, dto.type);
  }

  @Get('keys')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取API Keys列表' })
  async getApiKeys(@Request() req) {
    return this.aiGatewayService.getUserApiKeys(req.user.userId);
  }

  @Delete('keys/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '撤销API Key' })
  async revokeApiKey(@Request() req, @Body('id') keyId: string) {
    return this.aiGatewayService.revokeApiKey(req.user.userId, keyId);
  }
}