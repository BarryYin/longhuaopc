import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
    private usersService: UsersService,
  ) {}

  // ========== 账号密码注册 ==========
  async register(dto: RegisterDto) {
    const { phone, password, nickname } = dto;

    // 检查手机号是否已注册
    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      throw new BadRequestException('该手机号已被注册');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        phoneVerified: true,
        nickname: nickname || `用户${phone.slice(-4)}`,
      },
    });

    const tokens = await this.generateTokens(user.id);
    return {
      user: this.usersService.sanitizeUser(user),
      ...tokens,
    };
  }

  // ========== 账号密码登录 ==========
  async loginWithPassword(account: string, password: string) {
    // 查找用户（支持手机号登录）
    const user = await this.prisma.user.findUnique({
      where: { phone: account },
    });

    if (!user) {
      throw new UnauthorizedException('账号或密码错误');
    }

    // 验证密码
    if (!user.password) {
      throw new UnauthorizedException('该账号未设置密码，请使用短信验证码登录');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('账号或密码错误');
    }

    // 检查用户状态
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('用户已被禁用');
    }

    const tokens = await this.generateTokens(user.id);
    return {
      user: this.usersService.sanitizeUser(user),
      ...tokens,
    };
  }

  // ========== 短信验证码（保留） ==========
  // 发送短信验证码
  async sendSmsCode(phone: string): Promise<void> {
    // 检查是否频繁发送
    const key = `sms:limit:${phone}`;
    const count = await this.redisService.get(key);
    if (count && parseInt(count) >= 5) {
      throw new BadRequestException('发送过于频繁，请1小时后再试');
    }

    // 开发环境使用固定验证码
    const isDev = this.configService.get('NODE_ENV') !== 'production';
    const code = isDev ? '123456' : Math.random().toString().slice(2, 8);

    // 保存到Redis，5分钟有效
    await this.redisService.set(`sms:code:${phone}`, code, 300);

    // 增加发送次数
    await this.redisService.increment(key);
    await this.redisService.expire(key, 3600);

    // TODO: 调用短信服务商发送
    if (isDev) {
      console.log(`📱 [DEV] SMS Code for ${phone}: ${code} (固定验证码，生产环境将随机生成)`);
    } else {
      console.log(`📱 SMS Code for ${phone}: ${code}`);
    }
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

  // ========== Token 管理 ==========
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
