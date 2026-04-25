# Roadmap: 龙华OPC社区（AI Agent驱动版）

## Overview

这是一个为AI时代设计的**双向服务平台**：

1. **面向人类创业者**：提供政策信息、社区交流、培训指导、接单赚钱的一站式服务
2. **面向AI Agent**：提供结构化API，让用户的AI助手可以代劳查询政策、寻找商机、对接资源

核心创新点：平台数据以**结构化、语义化**方式组织，AI Agent可以通过API精准获取信息，打包返回给用户。用户只需告诉AI"帮我看看有哪些政策可以申请"，AI就能自动查询并整理成个性化报告。

三大核心业务：
- **政策引擎**：AI可读的OPC政策知识图谱
- **能力市场**：OPC接单派单的服务交易平台
- **成长社区**：交流、培训、导师指导

## Approach Decision

- **Chosen**: AI-First架构，API与前端同步建设
- **Why**:
  - AI时代用户使用习惯正在改变，从"搜索"转向"问AI"
  - 结构化数据一次建设，同时服务人和AI
  - 接单派单是OPC刚需，与政策信息形成闭环（知道政策→提升能力→接到订单）
- **Rejected alternatives**:
  - 只做传统网站：错过AI Agent趋势
  - 先做AI后做前端：没有用户界面，冷启动困难
  - 把接单派单做成简单信息发布：需要完整的交易流程保障

## Scope

- **In**:
  - AI友好的政策API（结构化政策数据）
  - 智能政策匹配（自然语言描述→政策推荐）
  - OPC能力市场（服务发布、需求发布、撮合匹配）
  - 基础交易流程（报价、确认、交付、评价）
  - 社区交流与知识沉淀
  - 培训与导师对接
  - 用户AI Agent接入（API Key管理）

- **Out**:
  - 在线支付托管（第一期走线下/第三方支付）
  - 实时合同签署（先用电子协议简化）
  - 争议仲裁系统（第一期人工介入）
  - 多城市政策（先做透龙华）
  - 移动端App（先做响应式Web+PWA）

## Constraints

- AI Agent接口需要标准化输出（JSON/MCP协议）
- 政策数据需要保持实时更新
- 接单派单需要身份和资质审核
- 需要防欺诈机制

## Boundary Strategy

- **Why this split**:
  - 政策引擎是数据核心，可独立对外提供API服务
  - 能力市场是交易核心，涉及复杂的业务逻辑和风控
  - 社区和培训是生态运营，增长飞轮
  - AI Agent网关是横向能力，统一管控

- **Shared seams to watch**:
  - 用户身份打通（政策查询、接单、社区使用统一身份）
  - 信誉体系（接单评价 ↔ 社区信誉 ↔ 导师资质）
  - AI Agent权限管控（不同级别访问不同数据）

## Specs (dependency order)

### Phase 0: 数据层（一次性填充）
- [ ] data-ingestion -- 外部数据采集服务（劳务市场+公开课程+政策）。Dependencies: none

### Phase 1: 基础设施
- [ ] ai-gateway -- AI Agent接入网关与API管理。Dependencies: none
- [ ] user-system -- 用户认证与基础管理（支持人+AI身份）。Dependencies: none

### Phase 2: 核心引擎
- [ ] policy-engine -- 政策知识图谱与AI匹配引擎。Dependencies: ai-gateway, user-system, data-ingestion
- [ ] skill-market -- OPC能力市场（接单派单）。Dependencies: user-system, data-ingestion

### Phase 3: 生态运营
- [ ] community -- 创业者社区。Dependencies: user-system
- [ ] training -- 培训与导师。Dependencies: user-system, data-ingestion
- [ ] admin-dashboard -- 运营后台。Dependencies: user-system, policy-engine, skill-market
