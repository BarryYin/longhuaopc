import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
    private usersService: UsersService,
  ) {}

  // 发送短信验证码
  async sendSmsCode(phone: string): Promise<void> {
    // 检查是否频繁发送
    const key = `sms:limit:${phone}`;
    const count = await this.redisService.get(key);
    if (count && parseInt(count) >= 5) {
      throw new BadRequestException('发送过于频繁，请1小时后再试');
    }

    // 生成6位验证码
    const code = Math.random().toString().slice(2, 8);

    // 保存到Redis，5分钟有效
    await this.redisService.set(`sms:code:${phone}`, code, 300);

    // 增加发送次数
    await this.redisService.increment(key);
    await this.redisService.expire(key, 3600);

    // TODO: 调用短信服务商发送
    console.log(`📱 SMS Code for ${phone}: ${code}`);
  }

  // 验证短信码
  private async verifySmsCode(phone: string, code: string): Promise<boolean> {
    const key = `sms:code:${phone}`;
    const savedCode = await this.redisService.get(key);
    if (!savedCode || savedCode !== code) {
      return false;
    }
    // 验证成功后删除
    await this.redisService.del(key);
    return true;
  }

  // 手机号登录/注册
  async loginWithPhone(phone: string, code: string) {
    const isValid = await this.verifySmsCode(phone, code);
    if (!isValid) {
      throw new BadRequestException('验证码错误或已过期');
    }

    // 查找或创建用户
    let user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      // 新用户注册
      user = await this.prisma.user.create({
        data: {
          phone,
          phoneVerified: true,
          nickname: `用户${phone.slice(-4)}`,
        },
      });
    }

    const tokens = await this.generateTokens(user.id);
    return {
      user: this.usersService.sanitizeUser(user),
      ...tokens,
    };
  }

  // 生成Token
  private async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId }, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION') || '15m',
      }),
      this.jwtService.signAsync({ sub: userId }, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
      }),
    ]);

    // 保存refresh token到Redis
    await this.redisService.set(
      `refresh:${userId}`,
      refreshToken,
      7 * 24 * 60 * 60, // 7天
    );

    return { accessToken, refreshToken };
  }

  // 刷新Token
  async refreshTokens(userId: string, refreshToken: string) {
    const savedToken = await this.redisService.get(`refresh:${userId}`);
    if (!savedToken || savedToken !== refreshToken) {
      throw new UnauthorizedException('无效的刷新令牌');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    return this.generateTokens(user.id);
  }

  // 登出
  async logout(userId: string): Promise<void> {
    await this.redisService.del(`refresh:${userId}`);
  }
}