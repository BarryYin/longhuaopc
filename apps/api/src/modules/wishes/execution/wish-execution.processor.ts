import { Process, Processor, OnQueueFailed, OnQueueCompleted } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { WishesService } from '../wishes.service';

interface ExecutionData {
  wishId: string;
  userId: string;
  title: string;
  category: string;
  executionConfig?: any;
  context?: any;
  intent?: any;
}

@Processor('wish-execution')
@Injectable()
export class WishExecutionProcessor {
  private readonly logger = new Logger(WishExecutionProcessor.name);

  constructor(private wishesService: WishesService) {}

  @Process('execute-wish')
  async handleExecution(job: Job<ExecutionData>) {
    const { wishId, title, category, executionConfig, context, intent } = job.data;

    this.logger.log(`Executing wish: ${wishId} - ${title}`);

    const execution = await this.wishesService.createExecution(wishId);
    const startTime = Date.now();

    try {
      await this.wishesService.markExecuting(wishId);

      const result = await this.executeByCategory(
        category,
        { title, intent, context, executionConfig },
        job,
      );

      const durationMs = Date.now() - startTime;
      const summary = result.summary || '执行完成';

      await this.wishesService.completeExecution(execution.id, {
        output: result,
        status: 'completed',
        durationMs,
      });

      await this.wishesService.markDone(wishId, result, summary);

      this.logger.log(`Wish ${wishId} completed in ${durationMs}ms`);
      return result;
    } catch (error) {
      const durationMs = Date.now() - startTime;

      await this.wishesService.completeExecution(execution.id, {
        status: 'failed',
        durationMs,
      });

      await this.wishesService.markFailed(wishId, error.message);
      this.logger.error(`Wish ${wishId} failed: ${error.message}`);
      throw error;
    }
  }

  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} failed for wish ${job.data.wishId}: ${error.message}`,
    );
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, result: any) {
    this.logger.log(`Job ${job.id} completed for wish ${job.data.wishId}`);
  }

  private async executeByCategory(
    category: string,
    data: any,
    job: Job,
  ): Promise<any> {
    switch (category) {
      case 'research':
        return this.executeResearch(data, job);
      case 'content':
        return this.executeContent(data, job);
      case 'analysis':
        return this.executeAnalysis(data, job);
      case 'automation':
        return this.executeAutomation(data, job);
      default:
        return this.executeGeneric(data, job);
    }
  }

  private async executeResearch(data: any, job: Job) {
    this.logger.log(`Research execution: ${data.title}`);
    await job.progress(30);

    const result = {
      summary: `已完成 "${data.title}" 的调研`,
      sources: [],
      findings: '待接入实际搜索API后填充',
      recommendations: [],
    };

    await job.progress(100);
    return result;
  }

  private async executeContent(data: any, job: Job) {
    this.logger.log(`Content execution: ${data.title}`);
    await job.progress(50);

    const result = {
      summary: `已生成 "${data.title}" 的内容初稿`,
      content: '待接入实际LLM后填充',
      wordCount: 0,
      suggestions: ['建议用户审阅后修改'],
    };

    await job.progress(100);
    return result;
  }

  private async executeAnalysis(data: any, job: Job) {
    this.logger.log(`Analysis execution: ${data.title}`);
    await job.progress(50);

    const result = {
      summary: `已完成 "${data.title}" 的分析`,
      data: {},
      insights: [],
    };

    await job.progress(100);
    return result;
  }

  private async executeAutomation(data: any, job: Job) {
    this.logger.log(`Automation execution: ${data.title}`);

    if (!data.executionConfig?.approved) {
      return {
        summary: '此自动化任务需要额外授权',
        status: 'needs_authorization',
        action: '请用户确认执行权限',
      };
    }

    await job.progress(100);
    return {
      summary: `自动化任务 "${data.title}" 已配置`,
      status: 'configured',
    };
  }

  private async executeGeneric(data: any, job: Job) {
    this.logger.log(`Generic execution: ${data.title}`);
    await job.progress(100);

    return {
      summary: `任务 "${data.title}" 已完成`,
      note: '通用执行策略，结果较简单',
    };
  }
}
