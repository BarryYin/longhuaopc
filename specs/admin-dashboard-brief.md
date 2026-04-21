# Brief: admin-dashboard

## Problem

平台运营需要管理：政策内容、交易撮合、社区审核、用户服务。没有统一后台无法进行日常运营。

## Current State

无后台系统。

## Desired Outcome

建设**综合运营管理后台**：
1. 内容管理（政策、课程、社区帖子）
2. 交易管理（技能审核、需求审核、争议处理）
3. 用户管理（账号、角色、认证）
4. AI Agent管理（API Key、调用日志）
5. 数据统计（业务数据、系统监控）

## Approach

Admin Dashboard，模块化设计：
- 每个业务模块独立管理界面
- 审核工作流（待审核、已通过、已拒绝）
- 数据可视化

## Scope

- **In**:
  - 登录认证
  - 政策内容管理
  - 技能/需求审核
  - 社区内容审核
  - 用户管理
  - AI Agent管理（查看Key、调用日志）
  - 数据统计面板
  - 系统配置

- **Out**:
  - 复杂BI分析
  - 自动化运营
  - 客服工单系统
  - 财务对账

## Boundary Candidates

- 各业务模块管理界面
- 审核工作流
- 数据统计

## Out of Boundary

- 高级数据分析
- 营销自动化
- 客服CRM

## Upstream / Downstream

- **Upstream**: user-system, policy-engine, skill-market, community, training, ai-gateway
- **Downstream**: 无

## Existing Spec Touchpoints

- **Extends**: user-system
- **Adjacent**: 所有业务模块

## Constraints

- 需要操作日志审计
- 敏感操作需要二次确认
- 支持多人协作
