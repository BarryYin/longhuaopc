import { IsString, IsNotEmpty, IsOptional, IsObject, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Agent 认证
export class AgentAuthDto {
  @ApiProperty({ description: 'Agent ID' })
  @IsString()
  @IsNotEmpty()
  agentId: string;

  @ApiProperty({ description: 'Agent 密钥' })
  @IsString()
  @IsNotEmpty()
  agentSecret: string;
}

// Agent 任务类型
export enum AgentTaskType {
  PUBLISH_SERVICE = 'publish_service',
  PUBLISH_DEMAND = 'publish_demand',
  PUBLISH_POST = 'publish_post',
  AUTO_MATCH = 'auto_match',
  AUTO_REPLY = 'auto_reply',
  POLICY_APPLY = 'policy_apply',
}

// Agent 执行任务
export class AgentExecuteTaskDto {
  @ApiProperty({ description: '任务类型', enum: AgentTaskType })
  @IsEnum(AgentTaskType)
  taskType: AgentTaskType;

  @ApiProperty({ description: '任务参数', type: 'object' })
  @IsObject()
  @IsOptional()
  params?: Record<string, any>;

  @ApiProperty({ description: '任务说明' })
  @IsString()
  @IsOptional()
  description?: string;
}

// 智能匹配请求
export class AgentSmartMatchDto {
  @ApiProperty({ description: '匹配类型', example: 'skill' })
  @IsString()
  @IsNotEmpty()
  matchType: 'skill' | 'policy' | 'partner';

  @ApiProperty({ description: '匹配条件', type: 'object' })
  @IsObject()
  @IsOptional()
  criteria?: Record<string, any>;

  @ApiProperty({ description: '用户输入' })
  @IsString()
  @IsOptional()
  userInput?: string;
}

// 自动发布内容
export class AgentAutoPublishDto {
  @ApiProperty({ description: '发布类型', enum: ['service', 'demand', 'post'] })
  @IsEnum(['service', 'demand', 'post'])
  publishType: 'service' | 'demand' | 'post';

  @ApiProperty({ description: '内容草稿' })
  @IsString()
  draft: string;

  @ApiProperty({ description: '附加数据', type: 'object' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

// 与 Agent 对话
export class AgentChatDto {
  @ApiProperty({ description: '用户消息' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: '会话ID' })
  @IsString()
  @IsOptional()
  sessionId?: string;

  @ApiProperty({ description: '上下文', type: 'array' })
  @IsArray()
  @IsOptional()
  context?: Array<{ role: string; content: string }>;
}
