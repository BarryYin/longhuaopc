import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Board } from '@prisma/client';

export class QueryPostsDto {
  @ApiPropertyOptional({ description: '板块', enum: Board })
  @IsEnum(Board)
  @IsOptional()
  board?: Board;

  @ApiPropertyOptional({ description: '标签' })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({ description: '排序', enum: ['newest', 'hot', 'top'] })
  @IsString()
  @IsOptional()
  sort?: string = 'newest';

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

export class CreatePostDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  title: string;

  @ApiProperty({ description: '内容' })
  @IsString()
  content: string;

  @ApiProperty({ description: '板块', enum: Board })
  @IsEnum(Board)
  board: Board;

  @ApiPropertyOptional({ description: '标签' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class CreateCommentDto {
  @ApiProperty({ description: '内容' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: '回复哪条评论' })
  @IsString()
  @IsOptional()
  parentId?: string;
}
