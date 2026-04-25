import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgentService } from './agent.service';
import { AgentAuthGuard } from '@/common/guards/agent.guard';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import {
  AgentAuthDto,
  AgentExecuteTaskDto,
  AgentSmartMatchDto,
  AgentAutoPublishDto,
  AgentChatDto,
} from './dto';

@ApiTags('Agent')
@Controller('agent')
export class AgentController {
  constructor(private agentService: AgentService) {}

  // ========== Agent 认证 ==========
  @Post('auth')
  @ApiOperation({ summary: 'Agent 认证' })
  async auth(@Body() dto: AgentAuthDto) {
    return this.agentService.validateAgent(dto.agentId, dto.agentSecret);
  }

  // ========== Agent 执行任务 ==========
  @Post('execute')
  @UseGuards(AgentAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agent 执行任务' })
  async executeTask(@Request() req, @Body() dto: AgentExecuteTaskDto) {
    return this.agentService.executeTask(
      req.agent.id,
      req.agent.userId,
      dto.taskType,
      dto.params || {},
      dto.description,
    );
  }

  // ========== Agent 智能对话 ==========
  @Post('chat')
  @UseGuards(AgentAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '与 Agent 对话' })
  async chat(@Request() req, @Body() dto: AgentChatDto) {
    return this.agentService.chatWithAgent(
      req.agent.id,
      req.agent.agentId,
      req.agent.userId,
      dto.message,
      dto.sessionId,
      dto.context,
    );
  }

  // ========== Agent 智能匹配 ==========
  @Post('match')
  @UseGuards(AgentAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agent 智能匹配' })
  async smartMatch(@Request() req, @Body() dto: AgentSmartMatchDto) {
    return this.agentService.executeTask(
      req.agent.id,
      req.agent.userId,
      'auto_match' as any,
      {
        matchType: dto.matchType,
        criteria: dto.criteria,
        userInput: dto.userInput,
      },
      '智能匹配任务',
    );
  }

  // ========== Agent 自动发布 ==========
  @Post('publish')
  @UseGuards(AgentAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agent 自动发布内容' })
  async autoPublish(@Request() req, @Body() dto: AgentAutoPublishDto) {
    const taskType =
      dto.publishType === 'service'
        ? 'publish_service'
        : dto.publishType === 'demand'
        ? 'publish_demand'
        : 'publish_post';

    return this.agentService.executeTask(
      req.agent.id,
      req.agent.userId,
      taskType as any,
      {
        ...dto.metadata,
        title: dto.draft.slice(0, 50),
        description: dto.draft,
        content: dto.draft,
      },
      `自动发布${dto.publishType}`,
    );
  }

  // ========== 获取 Agent 任务列表 ==========
  @Get('tasks')
  @UseGuards(AgentAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取 Agent 任务列表' })
  async getTasks(@Request() req, @Query('status') status?: string) {
    return this.agentService.getAgentTasks(req.agent.userId, status);
  }

  // ========== 获取对话历史 ==========
  @Get('chat/history')
  @UseGuards(AgentAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取 Agent 对话历史' })
  async getChatHistory(@Request() req, @Query('sessionId') sessionId?: string) {
    return this.agentService.getChatHistory(req.agent.userId, sessionId);
  }

  // ========== 用户管理自己的 Agent ==========
  @Get('my-agents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的 Agent 列表' })
  async getMyAgents(@Request() req) {
    // TODO: 实现用户管理 Agent
    return { message: '功能开发中' };
  }
}
