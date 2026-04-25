import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '@/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

interface AgentRequest extends Request {
  agent?: {
    id: string;
    agentId: string;
    userId: string;
  };
}

@Injectable()
export class AgentAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AgentRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('缺少 Agent 认证信息');
    }

    const token = authHeader.substring(7);

    // 解析 token: agentId:agentSecret
    const [agentId, agentSecret] = Buffer.from(token, 'base64').toString().split(':');

    if (!agentId || !agentSecret) {
      throw new UnauthorizedException('Agent Token 格式错误');
    }

    // 验证 Agent
    const agent = await this.prisma.agent.findUnique({
      where: { agentId },
    });

    if (!agent || !agent.isActive) {
      throw new UnauthorizedException('Agent 不存在或已被禁用');
    }

    const isValid = await bcrypt.compare(agentSecret, agent.agentSecret);
    if (!isValid) {
      throw new UnauthorizedException('Agent 密钥错误');
    }

    // 更新最后使用时间
    await this.prisma.agent.update({
      where: { id: agent.id },
      data: { lastUsedAt: new Date() },
    });

    // 将 agent 信息附加到请求 - 传递 id (UUID) 和 agentId
    request.agent = {
      id: agent.id,
      agentId: agent.agentId,
      userId: agent.userId,
    };

    return true;
  }
}
