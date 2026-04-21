import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface DetectedIntent {
  hasWish: boolean;
  category: string;
  title: string;
  confidence: number;
  contextHint: string;
}

@Injectable()
export class IntentDetectorService {
  private readonly logger = new Logger(IntentDetectorService.name);

  constructor(private config: ConfigService) {}

  async detectIntent(
    conversationMessages: ConversationMessage[],
  ): Promise<DetectedIntent | null> {
    if (!this.hasPotentialWish(conversationMessages)) {
      return null;
    }

    try {
      const intent = await this.extractWithLLM(conversationMessages);
      if (intent && intent.hasWish && intent.confidence >= 0.5) {
        this.logger.log(
          `Intent detected: "${intent.title}" (confidence: ${intent.confidence})`,
        );
        return intent;
      }
      return null;
    } catch (error) {
      this.logger.error(`Intent detection failed: ${error.message}`);
      return null;
    }
  }

  private hasPotentialWish(messages: ConversationMessage[]): boolean {
    const wishPatterns = [
      /帮我(.{2,30})/,
      /想要(.{2,30})/,
      /打算(.{2,30})/,
      /希望能(.{2,30})/,
      /有空.*(查一下|看一下|研究一下|学一下)/,
      /下次.*帮我/,
      /改天.*试试/,
      /记得.*提醒我/,
      /想.*了解一下/,
    ];

    const last3 = messages.slice(-3);
    const combined = last3.map((m) => m.content).join('\n');
    return wishPatterns.some((pattern) => pattern.test(combined));
  }

  private async extractWithLLM(
    messages: ConversationMessage[],
  ): Promise<DetectedIntent | null> {
    const conversationText = messages
      .map((m) => `${m.role === 'user' ? '用户' : '助手'}: ${m.content}`)
      .join('\n');

    // NOTE: LLM extraction prompt — currently falls through to rule-based
    const _systemPrompt = `你是一个意图提取器。分析以下对话，判断用户是否表达了想要做某件事但还没做的意图。

规则：
1. 只提取明确的"想要/希望/打算/帮我/记得/改天"类意图
2. 不要脑补，不要过度解读，用户随口说的话不算心愿
3. 只关注用户最后3轮对话中表达的意图
4. 如果用户说的是已完成的事、感谢、闲聊，不要提取

分类说明：
- research: 调研、搜索、了解某个领域
- content: 写文章、做PPT、写文档
- analysis: 分析数据、对比、评估
- automation: 自动化任务、定时执行、监控
- other: 其他

请严格按以下JSON格式返回，不要返回其他内容：
{
  "has_wish": true/false,
  "category": "research|content|analysis|automation|other",
  "title": "一句话描述用户的意图",
  "confidence": 0.0到1.0的数字,
  "context_hint": "用户原话中的关键句子"
}`;

    return this.ruleBasedExtraction(conversationText);
  }

  private ruleBasedExtraction(conversationText: string): DetectedIntent | null {
    const lines = conversationText.split('\n');
    const lastUserLines = lines
      .filter((l) => l.startsWith('用户:'))
      .slice(-3)
      .join(' ');

    if (/调研|研究|了解一下|查一下|看看.*资料|学习/.test(lastUserLines)) {
      const match = lastUserLines.match(
        /(?:帮我)?(?:调研|研究|了解一下|查一下|看看|学习)(.{2,40})/,
      );
      return {
        hasWish: true,
        category: 'research',
        title: match ? `调研: ${match[1].trim()}` : '调研某个话题',
        confidence: 0.75,
        contextHint: lastUserLines.slice(0, 100),
      };
    }

    if (/写|文章|公众号|PPT|文档|大纲/.test(lastUserLines)) {
      const match = lastUserLines.match(/(?:帮我)?(写.{2,40})/);
      return {
        hasWish: true,
        category: 'content',
        title: match ? match[1].trim() : '内容创作',
        confidence: 0.7,
        contextHint: lastUserLines.slice(0, 100),
      };
    }

    if (/分析|对比|评估|总结|整理/.test(lastUserLines)) {
      const match = lastUserLines.match(/(?:帮我)?(分析.{2,40})/);
      return {
        hasWish: true,
        category: 'analysis',
        title: match ? match[1].trim() : '数据分析',
        confidence: 0.7,
        contextHint: lastUserLines.slice(0, 100),
      };
    }

    if (/自动|定时|每天|监控|提醒/.test(lastUserLines)) {
      return {
        hasWish: true,
        category: 'automation',
        title: '自动化任务',
        confidence: 0.65,
        contextHint: lastUserLines.slice(0, 100),
      };
    }

    return null;
  }
}
