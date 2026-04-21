import { IsString, IsEnum, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType, TransactionStatus } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({ description: '交易类型', enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({ description: '服务ID' })
  @IsString()
  @IsOptional()
  serviceId?: string;

  @ApiPropertyOptional({ description: '需求ID' })
  @IsString()
  @IsOptional()
  demandId?: string;

  @ApiPropertyOptional({ description: '价格' })
  @IsNumber()
  @IsOptional()
  price?: number;
}

export class UpdateTransactionStatusDto {
  @ApiProperty({ description: '新状态', enum: TransactionStatus })
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}

export class CreateMessageDto {
  @ApiProperty({ description: '消息内容' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: '附件' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}
