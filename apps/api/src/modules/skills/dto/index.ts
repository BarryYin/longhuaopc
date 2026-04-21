import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ServiceCategory } from '@prisma/client';

export class QueryServicesDto {
  @ApiPropertyOptional({ description: '分类', enum: ServiceCategory })
  @IsEnum(ServiceCategory)
  @IsOptional()
  category?: ServiceCategory;

  @ApiPropertyOptional({ description: '最低价格' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional({ description: '最高价格' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional({ description: '排序', enum: ['newest', 'rating', 'price'] })
  @IsString()
  @IsOptional()
  sortBy?: string = 'newest';

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

export class CreateServiceDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  title: string;

  @ApiProperty({ description: '分类', enum: ServiceCategory })
  @IsEnum(ServiceCategory)
  category: ServiceCategory;

  @ApiProperty({ description: '描述' })
  @IsString()
  description: string;

  @ApiProperty({ description: '价格', example: { type: 'fixed', fixed: 5000, currency: 'CNY' } })
  price: any;

  @ApiPropertyOptional({ description: '标签' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: '交付周期', example: '3-5天' })
  @IsString()
  deliveryTime: string;

  @ApiPropertyOptional({ description: '作品集' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  portfolio?: string[];
}

export class QueryDemandsDto {
  @ApiPropertyOptional({ description: '分类', enum: ServiceCategory })
  @IsEnum(ServiceCategory)
  @IsOptional()
  category?: ServiceCategory;

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

export class CreateDemandDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  title: string;

  @ApiProperty({ description: '描述' })
  @IsString()
  description: string;

  @ApiProperty({ description: '分类', enum: ServiceCategory })
  @IsEnum(ServiceCategory)
  category: ServiceCategory;

  @ApiProperty({ description: '预算', example: { type: 'range', min: 3000, max: 5000 } })
  budget: any;

  @ApiPropertyOptional({ description: '期望交付日期' })
  @IsString()
  @IsOptional()
  deadline?: string;

  @ApiPropertyOptional({ description: '附件' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}
