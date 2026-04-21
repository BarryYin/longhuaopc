# Brief: ai-gateway

## Problem

AI Agent需要访问平台数据为用户服务，但没有标准化接入方式。平台需要为AI提供结构化API，同时管控访问权限和用量。

## Current State

无AI Agent接入能力。

## Desired Outcome

建设AI Agent统一网关，支持：
1. AI Agent注册与认证（API Key）
2. 标准化API输出（MCP协议/JSON）
3. 访问权限管控（数据范围、调用频次）
4. 调用日志与用量统计
5. 自然语言→结构化查询转换

## Approach

采用API Gateway模式，暴露RESTful API和MCP（Model Context Protocol）接口。AI Agent通过API Key认证，平台将内部数据标准化后返回。支持自然语言意图识别，自动映射到对应API。

## Scope

- **In**:
  - API Key生成与管理
  - RESTful API（标准化JSON输出）
  - MCP协议支持（Claude等AI原生协议）
  - 自然语言意图解析（简单版本：关键词映射）
  - 访问权限控制（只读/写入范围）
  - 调用日志与用量统计
  - 开发者文档

- **Out**:
  - 复杂NLU/NLP引擎（先做关键词+规则）
  - 实时流式输出（SSE/WebSocket放到后续）
  - API计费系统（第一期免费限额）
  - 多版本API兼容

## Boundary Candidates

- 认证与授权层
- 协议转换层（内部API→标准化API）
- 意图解析引擎
- 日志与监控系统

## Out of Boundary

- AI Agent市场（推荐第三方Agent）
- 模型训练服务
- 自动化工作流编排

## Upstream / Downstream

- **Upstream**: 无
- **Downstream**: policy-engine, skill-market, community, training

## Existing Spec Touchpoints

- **Extends**: 无
- **Adjacent**: 所有业务模块

## Constraints

- API响应需要<2秒（AI Agent体验敏感）
- 需要防滥用机制（频次限制）
- 数据安全分级（公开/个人/敏感）
- MCP协议需要跟进最新标准
