# Brief: community

## Problem

OPC创业者工作孤独，缺乏同频交流。成功经验难以沉淀，失败教训无法分享。需要一个垂直于AI创业的交流空间。

## Current State

无社区平台。

## Desired Outcome

建设**AI创业者社区**：
1. 问答交流（技术、商业、政策问题）
2. 经验分享（成功案例、踩坑记录）
3. 资源对接（工具推荐、合作邀请）
4. 内容可被AI Agent检索和引用

## Approach

问答+内容社区混合模式：
- 板块：政策解读、AI工具、项目展示、资源交换、求助问答
- 内容结构化（标签、分类）便于AI检索
- 精华内容沉淀为知识库

## Scope

- **In**:
  - 帖子发布（富文本、代码块）
  - 板块分类
  - 标签系统
  - 评论与回复
  - 点赞、收藏、分享
  - 精华/置顶
  - 搜索（全文检索）
  - AI Agent API（查询帖子、发布内容）

- **Out**:
  - 即时聊天
  - 线下活动组织
  - 付费问答
  - 积分等级（放到后续）

## Boundary Candidates

- 内容管理
- 互动系统
- 搜索索引
- 内容审核

## Out of Boundary

- 私信系统（放到后续）
- 社群运营工具
- 直播功能

## Upstream / Downstream

- **Upstream**: user-system, ai-gateway
- **Downstream**: admin-dashboard

## Existing Spec Touchpoints

- **Extends**: user-system
- **Adjacent**: policy-engine（政策讨论）、skill-market（成功案例）

## Constraints

- 内容需要审核（先审后发或先发后审）
- 需要反垃圾机制
- UGC版权需要明确
- 冷启动需要种子内容
