import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';
import { UsersService } from '../users/users.service';
import { SkillsService } from '../skills/skills.service';
import { CommunityService } from '../community/community.service';
import { PoliciesService } from '../policies/policies.service';
import * as bcrypt from 'bcrypt';
import { AgentTaskType } from './dto';

@Injectable()
export class AgentService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private usersService: UsersService,
    private skillsService: SkillsService,
    private communityService: CommunityService,
    private policiesService: PoliciesService,
  ) {}

  // ========== Agent 认证 ==========
  async validateAgent(agentId: string, agentSecret: string) {
    // 从数据库查找 Agent
    const agent = await this.prisma.agent.findUnique({
      where: { agentId },
      include: { user: true },
    });

    if (!agent || !agent.isActive) {
      throw new UnauthorizedException('Agent 不存在或已被禁用');
    }

    // 验证密钥
    const isValid = await bcrypt.compare(agentSecret, agent.agentSecret);
    if (!isValid) {
      throw new UnauthorizedException('Agent 密钥错误');
    }

    // 更新最后使用时间
    await this.prisma.agent.update({
      where: { id: agent.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      agentId: agent.agentId,
      userId: agent.userId,
      user: this.usersService.sanitizeUser(agent.user),
    };
  }

  // ========== Agent 执行任务 ==========
  async executeTask(
    agentId: string,
    userId: string,
    taskType: AgentTaskType,
    params: Record<string, any>,
    description?: string,
  ) {
    // 记录任务
    const task = await this.prisma.agentTask.create({
      data: {
        agentId,
        userId,
        taskType,
        params: JSON.stringify(params),
        description,
        status: 'PENDING',
      },
    });

    try {
      let result: any;

      switch (taskType) {
        case AgentTaskType.PUBLISH_SERVICE:
          result = await this.handlePublishService(userId, params);
          break;
        case AgentTaskType.PUBLISH_DEMAND:
          result = await this.handlePublishDemand(userId, params);
          break;
        case AgentTaskType.PUBLISH_POST:
          result = await this.handlePublishPost(userId, params);
          break;
        case AgentTaskType.AUTO_MATCH:
          result = await this.handleAutoMatch(userId, params);
          break;
        default:
          throw new BadRequestException('未知的任务类型');
      }

      // 更新任务状态为完成
      await this.prisma.agentTask.update({
        where: { id: task.id },
        data: { status: 'COMPLETED', result: JSON.stringify(result) },
      });

      return { taskId: task.id, status: 'COMPLETED', result };
    } catch (error) {
      // 更新任务状态为失败
      await this.prisma.agentTask.update({
        where: { id: task.id },
        data: { status: 'FAILED', error: error.message },
      });
      throw error;
    }
  }

  // 发布服务
  private async handlePublishService(userId: string, params: any) {
    const { title, description, price, category, deliveryTime } = params;
    return this.skillsService.createService(userId, {
      title,
      description,
      price: parseFloat(price),
      category,
      deliveryTime: deliveryTime || '7天',
    });
  }

  // 发布需求
  private async handlePublishDemand(userId: string, params: any) {
    const { title, description, budget, category } = params;
    return this.skillsService.createDemand(userId, {
      title,
      description,
      budget: parseFloat(budget),
      category,
    });
  }

  // 发布帖子
  private async handlePublishPost(userId: string, params: any) {
    const { title, content, tags, board } = params;
    return this.communityService.createPost(userId, {
      title,
      content,
      board: board || 'EXPERIENCE',
      tags: tags || [],
    });
  }

  // 智能匹配
  private async handleAutoMatch(userId: string, params: any) {
    const { matchType, criteria } = params;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (matchType === 'policy') {
      return this.policiesService.matchPolicies({
        location: criteria?.location || user?.location,
        industry: criteria?.industry || user?.industry,
      });
    }

    if (matchType === 'skill') {
      return this.skillsService.findServices({
        category: criteria?.category,
        page: 1,
        pageSize: 10,
      });
    }

    return { message: '匹配功能开发中' };
  }

  // ========== 智能对话 ==========
  async chatWithAgent(
    id: string,  // Agent UUID
    agentId: string,  // Agent 字符串ID
    userId: string,
    message: string,
    sessionId?: string,
    context?: Array<{ role: string; content: string }>,
  ) {
    const sessId = sessionId || `sess_${Date.now()}`;

    // 保存对话记录 - 使用 id (UUID)
    await this.prisma.agentChat.create({
      data: {
        agentId: id,
        userId,
        sessionId: sessId,
        message,
        role: 'user',
      },
    });

    // TODO: 调用 AI 服务生成回复
    // 这里先用简单逻辑模拟
    let reply = '';
    if (message.includes('发布')) {
      reply = '我可以帮您发布服务或需求。请告诉我：1. 类型（服务/需求）2. 标题 3. 描述 4. 价格/预算';
    } else if (message.includes('匹配')) {
      reply = '我可以帮您匹配政策或技能。请告诉我您想匹配什么类型？';
    } else if (message.includes('帮助') || message.includes('help')) {
      reply = '我是您的 AI 助手，可以帮您：\n1. 发布服务/需求/帖子\n2. 智能匹配政策和资源\n3. 回答平台相关问题\n请直接告诉我您想做什么。';
    } else {
      reply = '收到您的消息。作为您的 AI 助手，我可以帮您发布内容、匹配资源或解答问题。请问有什么具体需求吗？';
    }

    // 保存助手回复
    await this.prisma.agentChat.create({
      data: {
        agentId: id,
        userId,
        sessionId: sessId,
        message: reply,
        role: 'assistant',
      },
    });

    return { reply, sessionId: sessId };
  }

  // ========== 获取任务列表 ==========
  async getAgentTasks(userId: string, status?: string) {
    const where: any = { userId };
    if (status) where.status = status;

    return this.prisma.agentTask.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  // ========== 获取对话历史 ==========
  async getChatHistory(userId: string, sessionId?: string) {
    const where: any = { userId };
    if (sessionId) where.sessionId = sessionId;

    return this.prisma.agentChat.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
  }
}
