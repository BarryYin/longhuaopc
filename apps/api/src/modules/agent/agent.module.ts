import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { UsersModule } from '../users/users.module';
import { SkillsModule } from '../skills/skills.module';
import { CommunityModule } from '../community/community.module';
import { PoliciesModule } from '../policies/policies.module';

@Module({
  imports: [UsersModule, SkillsModule, CommunityModule, PoliciesModule],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
