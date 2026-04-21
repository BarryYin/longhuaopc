# Brief: user-system

## Problem

平台需要识别用户身份，区分"人"和"AI Agent"。创业者需要管理自己的多维度身份：政策申请者、服务提供者、学习者、社区参与者。

## Current State

无用户系统。

## Desired Outcome

建设**双轨身份系统**：
1. **人类用户**：手机号/微信登录，管理个人资料、多角色身份
2. **AI Agent**：API Key认证，代表用户执行操作

支持一个用户关联多个AI Agent，一个AI Agent可服务多个用户（需授权）。

## Approach

统一身份层，区分身份类型：
- 人类用户：OAuth（手机/微信）
- AI Agent：API Key + 用户授权
- 角色系统：普通用户、服务商、导师、管理员

## Scope

- **In**:
  - 手机号注册/登录（验证码）
  - 微信OAuth登录
  - AI Agent注册（生成API Key）
  - 用户授权AI Agent（OAuth式授权流程）
  - 多角色身份（一个用户可有多角色）
  - 用户资料管理（基础信息+OPC身份）
  - 实名认证（对接第三方）
  - 密码/密钥管理

- **Out**:
  - 企业资质认证（放到后续）
  - 多因素认证（MFA）
  - 社交账号绑定（除微信外）

## Boundary Candidates

- 人类用户认证
- AI Agent认证
- 授权管理（OAuth流程）
- 角色权限系统

## Out of Boundary

- 企业工商信息认证
- 财务账户体系
- 跨平台账号打通

## Upstream / Downstream

- **Upstream**: 无
- **Downstream**: policy-engine, skill-market, community, training, mentorship, ai-gateway

## Existing Spec Touchpoints

- **Extends**: 无
- **Adjacent**: ai-gateway（AI Agent身份管理）

## Constraints

- 必须遵守国内手机号实名要求
- API Key需要安全存储（只展示一次）
- 授权流程需要用户明确同意
- 需要支持撤销授权
