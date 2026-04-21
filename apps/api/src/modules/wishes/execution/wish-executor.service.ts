import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { WishesService } from '../wishes.service';

@Injectable()
export class WishExecutorService {
  private readonly logger = new Logger(WishExecutorService.name);
  private readonly MAX_CONCURRENT = 3;
  private readonly DEFAULT_TIMEOUT_MS = 15 * 60 * 1000;

  constructor(
    private wishesService: WishesService,
    @InjectQueue('wish-execution') private wishQueue: Queue,
  ) {}

  @Cron('0 2 * * *')
  async nightlyExecution() {
    this.logger.log('=== Nightly Wish Execution Start ===');

    const wishes = await this.wishesService.getConfirmedForExecution(
      this.MAX_CONCURRENT,
    );
    if (wishes.length === 0) {
      this.logger.log('No confirmed wishes to execute');
      return;
    }

    this.logger.log(`Found ${wishes.length} wishes to execute`);

    for (const wish of wishes) {
      await this.wishQueue.add(
        'execute-wish',
        {
          wishId: wish.id,
          userId: wish.userId,
          title: wish.title,
          category: wish.category,
          executionConfig: wish.executionConfig,
          context: wish.originalContext,
          intent: wish.extractedIntent,
        },
        {
          timeout: this.DEFAULT_TIMEOUT_MS,
          attempts: 2,
          backoff: {
            type: 'exponential',
            delay: 30000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );

      await this.wishesService.markQueued(wish.id);
      this.logger.log(`Queued wish: ${wish.id} - ${wish.title}`);
    }

    this.logger.log('=== Nightly Wish Execution Queued ===');
  }

  async executeNow(wishId: string, userId: string) {
    const wish = await this.wishesService.findById(wishId);
    if (wish.userId !== userId) {
      throw new Error('无权执行此心愿');
    }
    if (wish.status !== 'confirmed') {
      throw new Error(`心愿状态 ${wish.status} 不可执行`);
    }

    await this.wishQueue.add('execute-wish', {
      wishId: wish.id,
      userId: wish.userId,
      title: wish.title,
      category: wish.category,
      executionConfig: wish.executionConfig,
      context: wish.originalContext,
      intent: wish.extractedIntent,
    });

    await this.wishesService.markQueued(wish.id);
    this.logger.log(`Manually queued wish: ${wishId}`);

    return { message: '已加入执行队列', wishId };
  }
}
