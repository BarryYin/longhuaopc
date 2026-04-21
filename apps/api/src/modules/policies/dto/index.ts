import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PolicyCategory } from '@prisma/client';

export class QueryPoliciesDto {
  @ApiPropertyOptional({ description: '分类', enum: PolicyCategory })
  @IsEnum(PolicyCategory)
  @IsOptional()
  category?: PolicyCategory;

  @ApiPropertyOptional({ description: '关键词搜索' })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  pageSize: number = 10;
}

export class MatchPoliciesDto {
  @ApiPropertyOptional({ description: '所在地' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: '行业领域' })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiPropertyOptional({ description: '创业阶段' })
  @IsString()
  @IsOptional()
  stage?: string;

  @ApiPropertyOptional({ description: '团队规模' })
  @IsInt()
  @IsOptional()
  teamSize?: number;

  @ApiPropertyOptional({ description: '详细描述' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreatePolicyDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: '摘要' })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({ description: '内容' })
  @IsString()
  content: string;

  @ApiProperty({ description: '分类', enum: PolicyCategory })
  @IsEnum(PolicyCategory)
  category: PolicyCategory;

  @ApiPropertyOptional({ description: '标签' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: '适用对象' })
  @IsString()
  @IsOptional()
  targetAudience?: string;

  @ApiPropertyOptional({ description: '申请条件' })
  @IsString()
  @IsOptional()
  eligibility?: string;

  @ApiPropertyOptional({ description: '来源部门' })
  @IsString()
  source: string;

  @ApiPropertyOptional({ description: '官方链接' })
  @IsString()
  @IsOptional()
  officialUrl?: string;

  @ApiProperty({ description: '生效日期' })
  @IsString()
  validFrom: string;

  @ApiPropertyOptional({ description: '截止日期' })
  @IsString()
  @IsOptional()
  validTo?: string;
}
