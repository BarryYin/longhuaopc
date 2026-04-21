import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({ description: 'Key名称', example: '我的AI助手' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Key类型', enum: ['live', 'test'], example: 'test' })
  @IsEnum(['live', 'test'])
  type: 'live' | 'test';
}