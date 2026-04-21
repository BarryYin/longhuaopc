import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export enum WishCategory {
  RESEARCH = 'research',
  CONTENT = 'content',
  ANALYSIS = 'analysis',
  AUTOMATION = 'automation',
  OTHER = 'other',
}

export enum WishPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum WishSource {
  CONVERSATION = 'conversation',
  MANUAL = 'manual',
}

export class CreateWishDto {
  @ApiProperty({ description: '心愿标题', example: '帮我调研Kubernetes入门资料' })
  @IsString()
  title: string;

  @ApiProperty({ description: '分类', enum: WishCategory })
  @IsEnum(WishCategory)
  category: WishCategory;

  @ApiPropertyOptional({ description: '来源', enum: WishSource, default: 'manual' })
  @IsOptional()
  @IsEnum(WishSource)
  source?: WishSource;

  @ApiPropertyOptional({ description: '来源session ID' })
  @IsOptional()
  @IsString()
  sourceSessionId?: string;

  @ApiPropertyOptional({ description: '原始对话上下文' })
  @IsOptional()
  @IsObject()
  originalContext?: Record<string, any>;

  @ApiPropertyOptional({ description: '结构化意图' })
  @IsOptional()
  @IsObject()
  extractedIntent?: Record<string, any>;

  @ApiPropertyOptional({ description: '置信度', minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @ApiPropertyOptional({ description: '优先级', enum: WishPriority, default: 'medium' })
  @IsOptional()
  @IsEnum(WishPriority)
  priority?: WishPriority;

  @ApiPropertyOptional({ description: '执行配置' })
  @IsOptional()
  @IsObject()
  executionConfig?: Record<string, any>;
}

export class ConfirmWishDto {
  @ApiPropertyOptional({ description: '修改标题' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '修改分类', enum: WishCategory })
  @IsOptional()
  @IsEnum(WishCategory)
  category?: WishCategory;

  @ApiPropertyOptional({ description: '修改优先级', enum: WishPriority })
  @IsOptional()
  @IsEnum(WishPriority)
  priority?: WishPriority;

  @ApiPropertyOptional({ description: '修改执行配置' })
  @IsOptional()
  @IsObject()
  executionConfig?: Record<string, any>;
}

export class WishResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  source: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  confidence: number;

  @ApiPropertyOptional()
  resultSummary?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  confirmedAt?: Date;

  @ApiPropertyOptional()
  executedAt?: Date;
}
