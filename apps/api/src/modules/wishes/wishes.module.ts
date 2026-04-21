import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';
import { IntentDetectorService } from './intent-detector.service';
import { WishExecutorService } from './execution/wish-executor.service';
import { WishExecutionProcessor } from './execution/wish-execution.processor';
import { WishReportService } from './execution/wish-report.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'wish-execution',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 100,
      },
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [WishesController],
  providers: [
    WishesService,
    IntentDetectorService,
    WishExecutorService,
    WishExecutionProcessor,
    WishReportService,
  ],
  exports: [
    WishesService,
    IntentDetectorService,
    WishExecutorService,
  ],
})
export class WishesModule {}
