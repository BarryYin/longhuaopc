# Brief: policy-engine

## Problem

创业者不了解龙华OPC政策，传统搜索效率低。AI时代，用户希望直接问AI"我能申请什么政策"，但AI缺乏精准、实时的政策数据源。

## Current State

政策信息分散在各政府网站，无结构化数据，AI难以精准匹配。

## Desired Outcome

建设**AI友好的政策引擎**：
1. 结构化政策知识图谱（政策-条件-材料-流程）
2. 自然语言匹配（用户描述情况→推荐政策）
3. 个性化报告生成（一键导出申请指南）
4. AI Agent可直接调用API获取结果

## Approach

采用知识图谱+语义检索：
- 政策拆解为结构化字段（适用对象、条件、额度、材料、流程）
- 向量化存储支持语义搜索
- 规则引擎+轻量LLM实现匹配推理
- 输出标准化JSON供AI Agent消费

## Scope

- **In**:
  - 政策结构化录入（字段化拆解）
  - 政策知识图谱（实体关系：政策-条件-材料-部门）
  - 语义检索（向量相似度+关键词）
  - 智能匹配（输入用户画像→输出匹配政策）
  - 个性化报告生成（Markdown/PDF）
  - AI Agent API（查询接口、匹配接口）
  - 人工客服入口（复杂问题转人工）

- **Out**:
  - 政策自动抓取（先做人工录入）
  - 在线申请代办（只提供指引）
  - 复杂规则推理（先基于明确条件）
  - 全国政策（仅龙华）

## Boundary Candidates

- 政策数据管理（CMS）
- 知识图谱存储
- 匹配引擎（规则+向量）
- API接口层

## Out of Boundary

- 政策申请代办服务
- 政策效果评估
- 其他行政区政策

## Upstream / Downstream

- **Upstream**: ai-gateway, user-system
- **Downstream**: admin-dashboard

## Existing Spec Touchpoints

- **Extends**: 无（原policy-info升级重构）
- **Adjacent**: ai-gateway（API标准化）

## Constraints

- 政策数据需要人工审核录入
- 匹配准确度要求高（避免误导）
- 需要免责声明（最终以官方为准）
- 向量检索需要嵌入模型支持
