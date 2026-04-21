# Brief: training

## Problem

OPC创业者需要学习AI时代新技能，但市面上的课程要么太贵、要么不实用。缺乏针对一人公司的轻量培训。

## Current State

无培训系统。

## Desired Outcome

建设**OPC成长学院**：
1. 课程目录（AI工具、商业模式、个人品牌、法务财税）
2. 导师对接
3. 学习路径推荐
4. AI Agent可查询课程、预约导师

## Approach

轻量课程平台：
- 课程信息展示（可跳转第三方学习）
- 导师预约（轻量撮合）
- 学习记录跟踪

## Scope

- **In**:
  - 课程展示（分类、标签、详情）
  - 讲师/导师展示
  - 课程报名
  - 导师预约申请
  - 我的学习（报名记录、预约记录）
  - 课程评价
  - AI Agent API（查询课程、预约导师）

- **Out**:
  - 自有视频播放平台
  - 在线支付
  - 证书系统
  - 作业提交与批改

## Boundary Candidates

- 课程内容管理
- 导师管理
- 报名/预约系统

## Out of Boundary

- 视频点播平台
- 直播授课
- 学习管理系统（LMS）

## Upstream / Downstream

- **Upstream**: user-system, ai-gateway
- **Downstream**: admin-dashboard

## Existing Spec Touchpoints

- **Extends**: user-system
- **Adjacent**: skill-market（课程学成后去接单）

## Constraints

- 课程质量需要把控
- 导师需要资质审核
- 初期建议免费/低价为主
