import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PoliciesModule } from './modules/policies/policies.module';
import { SkillsModule } from './modules/skills/skills.module';
import { CommunityModule } from './modules/community/community.module';
import { TrainingModule } from './modules/training/training.module';
import { AiGatewayModule } from './modules/ai-gateway/ai-gateway.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { WishesModule } from './modules/wishes/wishes.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    PoliciesModule,
    SkillsModule,
    CommunityModule,
    TrainingModule,
    TransactionsModule,
    AiGatewayModule,
    WishesModule,
  ],
})
export class AppModule {}
