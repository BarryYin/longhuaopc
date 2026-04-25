import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendSmsDto, LoginWithPhoneDto, RefreshTokenDto, RegisterDto, LoginWithPasswordDto } from './dto';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ========== 账号密码认证 ==========
  @Post('register')
  @ApiOperation({ summary: '账号密码注册' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '账号密码登录' })
  async loginWithPassword(@Body() dto: LoginWithPasswordDto) {
    return this.authService.loginWithPassword(dto.account, dto.password);
  }

  // ========== 手机验证码认证（保留） ==========
  @Post('sms/send')
  @ApiOperation({ summary: '发送短信验证码' })
  @HttpCode(HttpStatus.OK)
  async sendSms(@Body() dto: SendSmsDto) {
    await this.authService.sendSmsCode(dto.phone);
    return { message: '验证码已发送' };
  }

  @Post('login/phone')
  @ApiOperation({ summary: '手机号登录/注册' })
  async loginWithPhone(@Body() dto: LoginWithPhoneDto) {
    return this.authService.loginWithPhone(dto.phone, dto.code);
  }

  @Post('refresh')
  @ApiOperation({ summary: '刷新Token' })
  async refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.userId, dto.refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: '登出' })
  @HttpCode(HttpStatus.OK)
  async logout(@Body('userId') userId: string) {
    await this.authService.logout(userId);
    return { message: '登出成功' };
  }
}
