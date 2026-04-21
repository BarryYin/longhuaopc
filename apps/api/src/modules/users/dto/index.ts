import { IsString, IsOptional, IsArray, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: '昵称' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nickname?: string;

  @ApiPropertyOptional({ description: '头像URL' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ description: '个人简介' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ description: '所在地' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: '创业领域' })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiPropertyOptional({ description: '公司状态', enum: ['none', 'preparing', 'registered'] })
  @IsString()
  @IsOptional()
  companyStatus?: string;

  @ApiPropertyOptional({ description: '公司名称' })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional({ description: '技能标签' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
