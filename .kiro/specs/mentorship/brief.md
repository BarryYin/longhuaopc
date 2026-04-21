# Brief: mentorship

## Problem

独立创业者在关键决策时需要指导，但找不到合适的导师。传统孵化器服务重、门槛高，OPC需要轻量级的导师咨询服务。

## Current State

没有导师资源对接渠道。

## Desired Outcome

建立导师库，展示各领域的专家导师信息，提供预约咨询渠道，帮助创业者获得针对性指导。

## Approach

采用导师展示+预约申请的轻量模式。平台展示导师背景、专长领域、可预约时间，创业者提交咨询申请。第一期不做在线支付和实时视频，通过平台撮合后线下对接。

## Scope

- **In**:
  - 导师展示（列表+详情）
  - 导师分类（按领域：AI技术、产品、运营、法务、财税等）
  - 预约申请提交
  - 导师管理后台（导师可管理自己的资料和预约）
  - 咨询记录

- **Out**:
  - 在线支付
  - 实时视频咨询
  - 智能导师匹配
  - 评价系统（放到后续版本）

## Boundary Candidates

- 导师信息管理
- 预约系统
- 导师专属后台

## Out of Boundary

- 在线付费咨询
- 视频通话系统
- 导师培训认证

## Upstream / Downstream

- **Upstream**: user-system
- **Downstream**: admin-dashboard

## Existing Spec Touchpoints

- **Extends**: user-system
- **Adjacent**: training（导师可以是讲师）

## Constraints

- 导师需要资质审核
- 咨询预约需要双方时间协调
- 建议初期以公益或低偿咨询为主
