import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// ========== 账号密码注册 ==========
export class RegisterDto {
  @ApiProperty({ description: '手机号', example: '13800138000' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: '密码长度必须在6-20位之间' })
  password: string;

  @ApiProperty({ description: '昵称', example: '张三', required: false })
  @IsString()
  @IsOptional()
  nickname?: string;
}

// ========== 账号密码登录 ==========
export class LoginWithPasswordDto {
  @ApiProperty({ description: '账号（手机号）', example: '13800138000' })
  @IsString()
  @IsNotEmpty()
  account: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

// ========== 短信验证码（保留） ==========
export class SendSmsDto {
  @ApiProperty({ description: '手机号', example: '13800138000' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;
}

export class LoginWithPhoneDto {
  @ApiProperty({ description: '手机号', example: '13800138000' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;

  @ApiProperty({ description: '短信验证码', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: '验证码必须为6位' })
  code: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: '用户ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: '刷新令牌' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
