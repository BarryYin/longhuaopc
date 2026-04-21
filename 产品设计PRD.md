# 产品设计PRD：龙华OPC社区

**版本**: v1.0  
**日期**: 2026年4月16日  
**状态**: 初稿  

---

## 1. 产品概述

### 1.1 产品定位

为AI时代独立创业者（OPC）打造的双服务平台：
- **C端（人类）**：政策查询、技能交易、社区交流、培训学习
- **B端（AI Agent）**：标准化API，支持AI代劳查询、匹配、交易

### 1.2 目标用户

| 用户类型 | 描述 | 核心需求 |
|---------|------|---------|
| 创业者 | AI时代独立创业者 | 政策、接单、学习 |
| AI Agent | 代表用户的智能助手 | 结构化API、快速响应 |
| 需求方 | 需要服务的企业/个人 | 找服务商、发需求 |
| 导师 | 提供咨询培训的专家 | 展示、获客 |
| 运营 | 平台管理员 | 内容审核、数据监控 |

### 1.3 核心场景

**场景1：政策咨询**
```
用户问AI助手："我在龙华做AI应用，有什么政策？"
AI Agent → 调用 /api/policies/match
        → 返回：漕河泾30万算力补贴、龙华街道3年免租...
        → AI整理成个性化报告
```

**场景2：技能交易**
```
OPC：发布服务"ChatGPT应用开发，5000元/项目"
需求方：搜索"AI客服开发"
平台：匹配推荐 → 双方沟通 → 确认订单 → 交付评价
```

**场景3：社区求助**
```
创业者发帖："请教如何申请龙华街道的算力补贴？"
社区：有经验者回复 → 精华沉淀 → 被AI检索引用
```

---

## 2. 信息架构

### 2.1 站点地图

```
├── 首页 (Landing)
│   ├── 核心功能入口
│   ├── 热门政策
│   └── 最新需求
│
├── 政策中心 (/policies)
│   ├── 政策列表
│   ├── 政策详情
│   ├── 智能匹配
│   └── 我的收藏
│
├── 能力市场 (/market)
│   ├── 服务列表 (找服务)
│   ├── 需求列表 (找活干)
│   ├── 服务详情
│   ├── 需求详情
│   ├── 发布服务
│   ├── 发布需求
│   └── 交易管理
│
├── 社区 (/community)
│   ├── 首页/推荐
│   ├── 板块列表
│   ├── 帖子详情
│   ├── 发帖
│   └── 搜索
│
├── 成长学院 (/academy)
│   ├── 课程列表
│   ├── 课程详情
│   ├── 导师列表
│   ├── 导师详情
│   └── 我的学习
│
├── 用户中心 (/user)
│   ├── 个人资料
│   ├── 我的发布 (服务/需求/帖子)
│   ├── 我的交易
│   ├── 我的收藏
│   ├── 消息通知
│   └── 设置
│
├── AI接入 (/developers)
│   ├── 开发者文档
│   ├── API Key管理
│   └── 调用日志
│
└── 管理后台 (/admin)
    ├── 数据看板
    ├── 内容管理
    ├── 用户管理
    ├── 审核中心
    └── 系统设置
```

---

## 3. 功能模块设计

### 3.1 首页 (Landing Page)

#### 3.1.1 页面布局

```
┌─────────────────────────────────────────────────┐
│  Logo    政策中心  能力市场  社区  学院    [登录] │  ← 导航栏
├─────────────────────────────────────────────────┤
│                                                 │
│     ┌─────────────────────────────────────┐    │
│     │  让AI为你的创业加速                  │    │  ← 主标题
│     │  政策查询 · 技能交易 · 社区成长     │    │  ← 副标题
│     │                                     │    │
│     │  [开始探索]  [开发者接入]           │    │  ← CTA按钮
│     └─────────────────────────────────────┘    │
│                                                 │
├─────────────────────────────────────────────────┤
│  💡 试试对AI说：                                │
│  "帮我查一下漕河泾的政策"                   │  ← AI示例区
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 热门政策                💼 最新需求         │
│  ┌──────────┐ ┌──────────┐  ┌──────────┐      │
│  │ 算力补贴 │ │ 办公空间 │  │ AI客服   │      │  ← 卡片区
│  │ 30万元   │ │ 免费3年  │  │ 5000元   │      │
│  └──────────┘ └──────────┘  └──────────┘      │
│                                                 │
├─────────────────────────────────────────────────┤
│  🚀 三大核心能力                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ AI政策  │  │ 技能交易│  │ 成长社区│       │  ← 功能介绍
│  │ 引擎    │  │ 市场    │  │         │       │
│  └─────────┘  └─────────┘  └─────────┘       │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.1.2 前端组件

| 组件 | 类型 | 说明 |
|-----|------|-----|
| NavBar | 全局组件 | 顶部导航，响应式（移动端汉堡菜单）|
| HeroSection | 页面组件 | 主视觉区，包含标题、副标题、CTA |
| AIExample | 页面组件 | AI使用示例轮播展示 |
| PolicyCard | 卡片组件 | 政策缩略卡片（标题、摘要、标签）|
| DemandCard | 卡片组件 | 需求缩略卡片（标题、预算、标签）|
| FeatureGrid | 页面组件 | 三列功能介绍网格 |
| Footer | 全局组件 | 页脚（关于、联系、备案）|

#### 3.1.3 后端接口

```yaml
GET /api/landing/policies
描述: 获取热门政策
参数:
  limit: number (默认6)
返回:
  policies: [
    { id, title, summary, tag, viewCount }
  ]

GET /api/landing/demands
描述: 获取最新需求
参数:
  limit: number (默认6)
返回:
  demands: [
    { id, title, budget, tag, createdAt }
  ]
```

---

### 3.2 政策中心

#### 3.2.1 政策列表页

```
┌─────────────────────────────────────────────────┐
│  政策中心                              [搜索]  │
├─────────────────────────────────────────────────┤
│  🔍 搜索政策...                                 │
├─────────────────────────────────────────────────┤
│  全部 | 税收优惠 | 场地支持 | 算力补贴 | 资金   │  ← 筛选标签
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 📋 漕河泾开发区算力补贴政策            │   │
│  │    面向AI创业企业，提供最高30万元...     │   │
│  │    #算力补贴 #AI #漕河泾    [查看详情]   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 📋 徐汇区模速空间大模型创新生态社区                  │   │
│  │    3年零租金办公空间，首年免租...        │   │
│  │    #场地支持 #龙华街道        [查看详情]     │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│              [加载更多]                         │
└─────────────────────────────────────────────────┘
```

#### 3.2.2 政策详情页

```
┌─────────────────────────────────────────────────┐
│  ← 返回列表                            [❤️收藏]│
├─────────────────────────────────────────────────┤
│                                                 │
│  漕河泾开发区算力补贴政策                      │
│  📌 算力补贴  🤖 AI创业  📍 徐汇区           │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 📊 政策概览                             │   │
│  │ • 支持额度：最高30万元                  │   │
│  │ • 适用对象：AI领域初创企业              │   │
│  │ • 有效期：2025-2027                     │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ## 申请条件                                    │
│  1. 注册地在徐汇区...                         │
│  2. 从事AI相关研发...                           │
│                                                 │
│  ## 申请材料                                    │
│  - 营业执照副本                                 │
│  - 项目计划书                                   │
│                                                 │
│  ## 申请流程                                    │
│  1. 登录"徐汇区政务服务中心"平台...                      │
│                                                 │
│  [查看官方原文]  [咨询客服]                     │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 💡 相关推荐                             │   │
│  │ • 徐汇区模速空间大模型创新生态社区                   │   │
│  │ • 徐汇区税收优惠...                   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.2.3 智能匹配页

```
┌─────────────────────────────────────────────────┐
│  🤖 AI政策助手                                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  告诉AI你的情况，为你推荐合适政策：              │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 我在龙华做AI应用创业，公司刚注册，       │   │
│  │ 需要算力资源和办公场地...                │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│         [获取推荐]                              │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                 │
│  根据您的情况，推荐以下政策：                    │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ ⭐ 匹配度 95%                           │   │
│  │ 漕河泾开发区算力补贴                  │   │
│  │ 最高30万元免费算力                      │   │
│  │ [查看详情]  [生成申请指南]              │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.2.4 前端组件

| 组件 | 说明 |
|-----|------|
| PolicyList | 政策列表，支持筛选、排序 |
| PolicyCard | 政策卡片 |
| PolicyFilter | 分类筛选器 |
| PolicyDetail | 政策详情展示 |
| PolicyMatcher | AI政策匹配输入框 |
| MatchResult | 匹配结果展示 |

#### 3.2.5 后端接口

```yaml
GET /api/policies
描述: 获取政策列表
参数:
  category: string (可选)
  keyword: string (可选)
  page: number
  pageSize: number
返回:
  total: number
  policies: [
    { id, title, summary, category, tags, viewCount, matchScore }
  ]

GET /api/policies/:id
描述: 获取政策详情
返回:
  id, title, content, category, tags, amount, eligibility,
  materials, process, officialUrl, validFrom, validTo

POST /api/policies/match
描述: AI政策匹配
请求体:
  userProfile: {
    location: string,
    industry: string,
    stage: string,
    teamSize: number,
    description: string
  }
返回:
  matches: [
    { policyId, title, matchScore, reason, recommended }
  ]

POST /api/policies/:id/favorite
描述: 收藏政策
```

#### 3.2.6 数据模型

```typescript
// 政策 (Policy)
interface Policy {
  id: string;                    // 唯一ID
  title: string;                 // 标题
  summary: string;               // 摘要
  content: string;               // 详细内容 (Markdown)
  category: PolicyCategory;      // 分类
  tags: string[];                // 标签
  
  // 结构化字段
  targetAudience: string;        // 适用对象
  eligibility: string[];         // 申请条件
  amount?: {                     // 额度信息
    type: 'fixed' | 'range' | 'unlimited';
    min?: number;
    max?: number;
    currency: string;
    description: string;
  };
  materials: string[];           // 申请材料
  process: ProcessStep[];        // 申请流程
  
  // 来源信息
  source: string;                // 来源部门
  officialUrl: string;           // 官方链接
  documentUrl?: string;          // 文件链接
  
  // 时间信息
  validFrom: Date;
  validTo?: Date;
  publishDate: Date;
  
  // 统计
  viewCount: number;
  favoriteCount: number;
  
  // 状态
  status: 'draft' | 'published' | 'expired';
  
  // 元数据
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

enum PolicyCategory {
  TAX = 'tax',                   // 税收优惠
  SPACE = 'space',               // 场地支持
  COMPUTING = 'computing',       // 算力补贴
  FUND = 'fund',                 // 创业资金
  TALENT = 'talent',             // 人才政策
  OTHER = 'other'
}

interface ProcessStep {
  order: number;
  title: string;
  description: string;
  requiredMaterials?: string[];
  estimatedTime?: string;
}
```

---

### 3.3 能力市场 (Skill Market)

#### 3.3.1 服务列表页

```
┌─────────────────────────────────────────────────┐
│  能力市场                                       │
├─────────────────────────────────────────────────┤
│  [找服务] [发需求] [我的交易]                   │
├─────────────────────────────────────────────────┤
│  🔍 搜索服务...                                 │
├─────────────────────────────────────────────────┤
│  分类：全部 | AI开发 | 设计 | 文案 | 咨询...   │
│  筛选：价格 | 评价 | 交付时间                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 👤 张师傅                    ⭐4.9(128) │   │
│  │ AI应用开发专家                           │   │
│  │                                         │   │
│  │ 💼 ChatGPT应用开发        ¥5000起       │   │
│  │ 💼 AI客服系统集成         ¥8000起       │   │
│  │                                         │   │
│  │ #Python #OpenAI #LangChain  [查看详情]  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.3.2 服务详情页

```
┌─────────────────────────────────────────────────┐
│  ← 返回                          [分享] [举报] │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌────┐  张师傅                      ⭐4.9    │
│  │ 👤 │  AI应用开发者               128单    │
│  └────┘                                       │
│                                                 │
│  📍 上海徐汇龙华 | 在线                           │
│                                                 │
│  ## 关于我                                      │
│  10年开发经验，专注AI应用落地...                │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 💼 服务项目                             │   │
│  │                                         │   │
│  │ ChatGPT应用开发                ¥5000起  │   │
│  │ ├── 接入OpenAI API                      │   │
│  │ ├── 自定义知识库                        │   │
│  │ └── 部署上线                            │   │
│  │ [立即咨询]                              │   │
│  │                                         │   │
│  │ AI客服系统集成                 ¥8000起  │   │
│  │ └── ...                                 │   │
│  │ [立即咨询]                              │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ ⭐ 客户评价 (128)                       │   │
│  │                                         │   │
│  │ ⭐⭐⭐⭐⭐ 非常专业，交付准时...          │   │
│  │ ⭐⭐⭐⭐⭐ 沟通顺畅，推荐！...            │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.3.3 需求列表页

```
┌─────────────────────────────────────────────────┐
│  能力市场  >  找活干                            │
├─────────────────────────────────────────────────┤
│  🔍 搜索需求...                                 │
├─────────────────────────────────────────────────┤
│  💼 最新需求                                    │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 需要一个AI客服机器人                    │   │
│  │ 📅 3天交付  💰 ¥5000-8000              │   │
│  │ 我们需要一个能处理常见咨询的AI客服...    │   │
│  │ #AI客服 #ChatGPT            [查看详情]   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 公众号AI写作助手                        │   │
│  │ 📅 7天交付  💰 ¥3000-5000              │   │
│  │ 需要一个能根据关键词生成公众号文章...    │   │
│  │ #写作 #AI内容               [查看详情]   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.3.4 发布服务页

```
┌─────────────────────────────────────────────────┐
│  发布服务                                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  服务标题 *                                     │
│  ┌─────────────────────────────────────────┐   │
│  │ ChatGPT应用开发                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  服务分类 *                                     │
│  [请选择] ▼                                     │
│                                                 │
│  价格 *                                         │
│  [起步价] 元                                    │
│                                                 │
│  服务描述 *                                     │
│  ┌─────────────────────────────────────────┐   │
│  │ 提供ChatGPT应用定制开发服务：           │   │
│  │ - 接入OpenAI API                        │   │
│  │ - 自定义知识库                          │   │
│  │ - 部署上线                              │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  技能标签                                       │
│  [Python] [OpenAI] [LangChain] [+]            │
│                                                 │
│  交付周期                                       │
│  [3-5天]                                        │
│                                                 │
│        [保存草稿]      [发布]                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.3.5 交易流程页

```
┌─────────────────────────────────────────────────┐
│  交易管理                                       │
├─────────────────────────────────────────────────┤
│  [进行中] [待评价] [全部]                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ #ORD20240416001                         │   │
│  │ AI客服机器人开发                          │   │
│  │ 买家：李经理                              │   │
│  │ 金额：¥6000                               │   │
│  │                                         │   │
│  │ 当前状态：🟡 进行中 - 需求确认           │   │
│  │                                         │   │
│  │ [查看详情] [联系买家] [更新进度]          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.3.6 前端组件

| 组件 | 说明 |
|-----|------|
| ServiceCard | 服务卡片 |
| DemandCard | 需求卡片 |
| ServiceFilter | 服务筛选器 |
| ServiceForm | 服务发布表单 |
| DemandForm | 需求发布表单 |
| TransactionList | 交易列表 |
| TransactionDetail | 交易详情 |
| ChatWidget | 站内沟通组件 |
| ReviewCard | 评价卡片 |

#### 3.3.7 后端接口

```yaml
# 服务相关
GET /api/services
参数:
  category: string
  minPrice: number
  maxPrice: number
  sortBy: 'price' | 'rating' | 'newest'
  page: number
返回:
  services: [
    { id, provider, title, price, rating, tags, coverImage }
  ]

GET /api/services/:id
返回:
  完整服务详情

POST /api/services
描述: 发布服务
请求体:
  title, category, price, description, tags, deliveryTime

# 需求相关
GET /api/demands
参数:
  category: string
  budgetMin: number
  budgetMax: number
返回:
  demands: [...]

POST /api/demands
描述: 发布需求

# 交易相关
POST /api/transactions
描述: 创建交易
请求体:
  type: 'service' | 'demand'
  targetId: string
  price: number
  message: string

GET /api/transactions/:id
返回:
  交易详情

POST /api/transactions/:id/status
描述: 更新交易状态
请求体:
  status: 'confirmed' | 'in_progress' | 'delivered' | 'completed'
  message?: string

# 消息相关
GET /api/messages
参数:
  transactionId: string
返回:
  messages: [...]

POST /api/messages
请求体:
  transactionId, content, attachments?
```

#### 3.3.8 数据模型

```typescript
// 服务 (Service)
interface Service {
  id: string;
  providerId: string;            // 服务商用户ID
  title: string;
  category: ServiceCategory;
  description: string;
  price: {
    type: 'fixed' | 'range' | 'negotiable';
    min?: number;
    max?: number;
    fixed?: number;
    currency: string;
  };
  tags: string[];
  deliveryTime: string;          // 交付周期
  portfolio?: string[];          // 作品集
  
  // 统计
  viewCount: number;
  orderCount: number;
  rating: number;
  reviewCount: number;
  
  status: 'draft' | 'published' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

// 需求 (Demand)
interface Demand {
  id: string;
  requesterId: string;           // 需求方用户ID
  title: string;
  description: string;
  category: ServiceCategory;
  budget: {
    type: 'fixed' | 'range';
    min?: number;
    max?: number;
    fixed?: number;
  };
  deadline?: Date;               // 期望交付时间
  attachments?: string[];        // 附件
  
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// 交易 (Transaction)
interface Transaction {
  id: string;
  orderNo: string;               // 订单号
  
  // 参与方
  buyerId: string;
  sellerId: string;
  
  // 交易标的
  type: 'service' | 'demand';
  serviceId?: string;
  demandId?: string;
  
  // 交易信息
  title: string;
  price: number;
  currency: string;
  
  // 状态流转
  status: TransactionStatus;
  statusHistory: StatusChange[];
  
  // 交付
  deliverables?: string[];       // 交付物
  deliveryNote?: string;
  
  // 评价
  buyerReview?: Review;
  sellerReview?: Review;
  
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

enum TransactionStatus {
  PENDING = 'pending',           // 待确认
  CONFIRMED = 'confirmed',       // 已确认
  IN_PROGRESS = 'in_progress',   // 进行中
  DELIVERED = 'delivered',       // 已交付
  COMPLETED = 'completed',       // 已完成
  CANCELLED = 'cancelled',       // 已取消
  DISPUTED = 'disputed'          // 争议中
}

interface Review {
  rating: number;                // 1-5星
  content: string;
  tags?: string[];
  createdAt: Date;
}
```

---

### 3.4 社区 (Community)

#### 3.4.1 社区首页

```
┌─────────────────────────────────────────────────┐
│  社区                                           │
├─────────────────────────────────────────────────┤
│  [🔥 热门] [🆕 最新] [📌 精华]                  │
├─────────────────────────────────────────────────┤
│  板块：全部 | 政策解读 | AI工具 | 经验分享...  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 👤 小明                    2小时前      │   │
│  │                                         │   │
│  │ 请教：龙华街道算力补贴怎么申请？             │   │
│  │ 最近在看龙华街道的政策，但是申请流程不太...  │   │
│  │                                         │   │
│  │ #政策解读 #龙华街道           💬12  👍24    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 👤 大牛                    5小时前      │   │
│  │                                         │   │
│  │ 分享：我是如何用AI月入5万的             │   │
│  │ 从去年开始做AI应用外包，到现在每个月...  │   │
│  │                                         │   │
│  │ #经验分享 #接单           💬56  👍189   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│              [+ 发布帖子]                       │
└─────────────────────────────────────────────────┘
```

#### 3.4.2 帖子详情页

```
┌─────────────────────────────────────────────────┐
│  ← 返回列表                          [分享]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  请教：龙华街道算力补贴怎么申请？                    │
│                                                 │
│  👤 小明     Lv.3    📅 2024-04-16 14:30      │
│                                                 │
│  最近在看龙华街道的政策，但是申请流程不太清楚...     │
│                                                 │
│  有没有申请过的朋友分享一下经验？               │
│                                                 │
│  #政策解读 #龙华街道                                │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  💬 12条回复                                    │
│                                                 │
│  👤 老鸟     Lv.8                              │
│  我上个月刚申请完，流程是这样的：               │
│  1. 先在龙华街道官网上注册账号...                   │
│  2. 填写申请表...                               │
│                                                 │
│  [👍5] [回复]                                   │
│  ─────────────────────────────────────────     │
│                                                 │
│  👤 运营小妹   官方                             │
│  您好，我可以帮您解答：                         │
│  龙华街道算力补贴的申请条件是...                    │
│                                                 │
│  [👍12] [回复]                                  │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  ┌─────────────────────────────────────────┐   │
│  │ 写下你的回复...                         │   │
│  └─────────────────────────────────────────┘   │
│              [发布回复]                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.4.3 前端组件

| 组件 | 说明 |
|-----|------|
| PostCard | 帖子卡片 |
| PostDetail | 帖子详情 |
| CommentList | 评论列表 |
| CommentForm | 评论输入框 |
| PostEditor | 帖子编辑器（富文本）|
| TopicFilter | 板块筛选 |

#### 3.4.4 后端接口

```yaml
GET /api/posts
参数:
  board: string
  sort: 'hot' | 'new' | 'top'
  page: number
返回:
  posts: [
    { id, title, summary, author, board, tags, 
      viewCount, commentCount, likeCount, createdAt }
  ]

GET /api/posts/:id
返回:
  完整帖子详情 + 评论列表

POST /api/posts
请求体:
  title, content, board, tags

POST /api/posts/:id/comments
请求体:
  content, parentId?

POST /api/posts/:id/like
```

#### 3.4.5 数据模型

```typescript
// 帖子 (Post)
interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;               // Markdown/HTML
  board: Board;
  tags: string[];
  
  // 统计
  viewCount: number;
  commentCount: number;
  likeCount: number;
  
  // 状态
  isPinned: boolean;
  isEssence: boolean;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  
  createdAt: Date;
  updatedAt: Date;
}

// 评论 (Comment)
interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentId?: string;             // 回复哪条评论
  
  likeCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

enum Board {
  POLICY = 'policy',             // 政策解读
  TOOLS = 'tools',               // AI工具
  EXPERIENCE = 'experience',     // 经验分享
  SHOWCASE = 'showcase',         // 项目展示
  HELP = 'help',                 // 求助问答
  RESOURCES = 'resources'        // 资源交换
}
```

---

### 3.5 用户系统

#### 3.5.1 登录/注册页

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              龙华OPC社区              │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │                                         │   │
│  │         欢迎回来                        │   │
│  │                                         │   │
│  │  手机号                                 │   │
│  │  ┌─────────────────────────────────┐   │   │
│  │  │ 138 **** ****                   │   │   │
│  │  └─────────────────────────────────┘   │   │
│  │                                         │   │
│  │  验证码                                 │   │
│  │  ┌────────────────────┐ ┌────────┐   │   │
│  │  │ 123456             │ │ 获取验证码 │   │
│  │  └────────────────────┘ └────────┘   │   │
│  │                                         │   │
│  │  [登录/注册]                            │   │
│  │                                         │   │
│  │  ─────────── 其他方式 ───────────       │   │
│  │                                         │   │
│  │         [微信一键登录]                  │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.5.2 个人资料页

```
┌─────────────────────────────────────────────────┐
│  个人资料                                       │
├─────────────────────────────────────────────────┤
│                                                 │
│       ┌────┐                                    │
│       │ 👤 │    小明                          │
│       └────┘    Lv.3 创业者                    │
│                                                 │
│       [更换头像]                                │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                 │
│  基本信息                            [编辑]     │
│                                                 │
│  昵称：小明                                     │
│  简介：AI应用开发者，专注ChatGPT落地...        │
│  所在地：上海徐汇龙华                               │
│  创业领域：AI应用                               │
│  公司状态：已注册                               │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                 │
│  我的标签                                       │
│  [AI开发] [Python] [ChatGPT] [+]               │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                 │
│  身份认证                                       │
│  [✓] 手机认证  [ ] 实名认证  [ ] 企业认证      │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.5.3 前端组件

| 组件 | 说明 |
|-----|------|
| LoginForm | 登录表单 |
| RegisterForm | 注册表单 |
| ProfileCard | 个人信息卡片 |
| ProfileEdit | 资料编辑表单 |
| AvatarUpload | 头像上传 |
| AuthGuard | 权限守卫组件 |

#### 3.5.4 后端接口

```yaml
POST /api/auth/send-sms
描述: 发送短信验证码
请求体:
  phone: string

POST /api/auth/login
描述: 手机号登录
请求体:
  phone: string
  code: string
返回:
  token, user

POST /api/auth/wechat
描述: 微信登录
请求体:
  code: string (微信授权码)

GET /api/users/profile
描述: 获取个人资料
返回:
  user详情

PUT /api/users/profile
描述: 更新个人资料
请求体:
  nickname, avatar, bio, location, tags, etc.

POST /api/users/avatar
描述: 上传头像
请求体:
  file: FormData
```

#### 3.5.5 数据模型

```typescript
// 用户 (User)
interface User {
  id: string;
  phone?: string;
  email?: string;
  wechatOpenId?: string;
  
  // 基本信息
  nickname: string;
  avatar?: string;
  bio?: string;
  
  // 创业信息
  location?: string;
  industry?: string;
  companyStatus?: 'none' | 'preparing' | 'registered';
  companyName?: string;
  
  // 标签
  tags: string[];
  
  // 等级
  level: number;
  exp: number;
  
  // 认证状态
  authStatus: {
    phone: boolean;
    realName: boolean;
    company: boolean;
  };
  
  // 角色
  roles: UserRole[];
  
  // 统计
  postCount: number;
  serviceCount: number;
  transactionCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

enum UserRole {
  USER = 'user',
  PROVIDER = 'provider',         // 服务商
  MENTOR = 'mentor',             // 导师
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}
```

---

### 3.6 AI Gateway (开发者接入)

#### 3.6.1 开发者文档页

```
┌─────────────────────────────────────────────────┐
│  开发者接入                                     │
├─────────────────────────────────────────────────┤
│  [概览] [API文档] [SDK] [示例]                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  # AI Agent 接入指南                            │
│                                                 │
│  让你的AI助手为创业者提供精准服务。             │
│                                                 │
│  ## 快速开始                                    │
│                                                 │
│  1. 注册账号并创建 API Key                      │
│  2. 阅读 API 文档                               │
│  3. 接入并测试                                  │
│                                                 │
│  [创建 API Key]                                 │
│                                                 │
│  ## 核心能力                                    │
│                                                 │
│  ### 政策查询                                   │
│  ```                                            │
│  POST /api/v1/policies/match                    │
│  {                                              │
│    "userProfile": {                             │
│      "industry": "AI",                          │
│      "location": "龙华"                         │
│    }                                            │
│  }                                              │
│  ```                                            │
│                                                 │
│  ### 服务搜索                                   │
│  ```                                            │
│  GET /api/v1/services?keyword=AI开发            │
│  ```                                            │
│                                                 │
│  ## MCP 协议支持                                │
│  我们还支持 Model Context Protocol，让Claude... │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.6.2 API Key管理页

```
┌─────────────────────────────────────────────────┐
│  API Key 管理                                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  [+ 创建新Key]                                  │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 生产环境Key                             │   │
│  │                                         │   │
│  │ sk_live_xxxxxxxx...xxxx                 │   │
│  │ 创建于：2024-04-16                      │   │
│  │ 调用次数：1,234 次                      │   │
│  │                                         │   │
│  │ [查看调用日志]  [重置]  [删除]          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 测试环境Key                             │   │
│  │                                         │   │
│  │ sk_test_xxxxxxxx...xxxx                 │   │
│  │ 创建于：2024-04-16                      │   │
│  │ 调用次数：56 次                         │   │
│  │                                         │   │
│  │ [查看调用日志]  [重置]  [删除]          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.6.3 前端组件

| 组件 | 说明 |
|-----|------|
| ApiDoc | API文档展示（Markdown渲染）|
| CodeBlock | 代码示例块（支持复制）|
| ApiKeyList | API Key列表 |
| ApiKeyCreate | 创建Key弹窗 |
| UsageStats | 调用统计图表 |

#### 3.6.4 后端接口

```yaml
POST /api/developer/keys
描述: 创建API Key
请求体:
  name: string
  type: 'live' | 'test'
返回:
  key: string  (只显示一次)

GET /api/developer/keys
返回:
  keys: [
    { id, name, type, prefix, createdAt, lastUsedAt, callCount }
  ]

GET /api/developer/logs
参数:
  keyId?: string
  startDate?: string
  endDate?: string
  page: number
返回:
  logs: [
    { id, timestamp, endpoint, method, statusCode, latency }
  ]

GET /api/developer/stats
返回:
  { totalCalls, callsToday, avgLatency, errorRate }
```

#### 3.6.5 数据模型

```typescript
// API Key
interface ApiKey {
  id: string;
  userId: string;
  name: string;
  type: 'live' | 'test';
  keyHash: string;               // 存储哈希值
  keyPrefix: string;             // 前缀用于展示
  
  // 统计
  callCount: number;
  lastUsedAt?: Date;
  
  // 限制
  rateLimit: number;             // 每分钟请求数
  dailyQuota: number;
  
  status: 'active' | 'revoked';
  createdAt: Date;
  expiresAt?: Date;
}

// API调用日志
interface ApiLog {
  id: string;
  keyId: string;
  userId: string;
  
  // 请求信息
  timestamp: Date;
  method: string;
  endpoint: string;
  path: string;
  query?: object;
  body?: object;
  
  // 响应信息
  statusCode: number;
  responseSize: number;
  latency: number;               // 毫秒
  
  // 客户端信息
  ip: string;
  userAgent?: string;
  
  // 错误信息
  error?: string;
}
```

---

### 3.7 管理后台

#### 3.7.1 数据看板

```
┌─────────────────────────────────────────────────┐
│  管理后台                              [退出]  │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│  📊 看板 │   今日数据                           │
│  📋 政策 │   ┌────────┐ ┌────────┐ ┌────────┐ │
│  💼 交易 │   │ 新用户 │ │ 新政策 │ │ 新订单 │ │
│  👥 用户 │   │   23   │ │   2    │ │   5    │ │
│  📝 内容 │   └────────┘ └────────┘ └────────┘ │
│  ⚙️ 设置 │                                      │
│          │   趋势图表                           │
│          │   ┌──────────────────────────────┐ │
│          │   │    📈 用户增长趋势            │ │
│          │   │                              │ │
│          │   │   ╱╲                         │ │
│          │   │  ╱  ╲      ╱╲               │ │
│          │   │ ╱    ╲____╱  ╲___           │ │
│          │   │                              │ │
│          │   └──────────────────────────────┘ │
│          │                                      │
│          │   待处理事项                         │
│          │   • 3条政策待审核                   │
│          │   • 2笔交易争议待处理               │
│          │   • 5条帖子被举报                   │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

#### 3.7.2 审核中心

```
┌─────────────────────────────────────────────────┐
│  审核中心                                       │
├─────────────────────────────────────────────────┤
│  [政策] [服务] [帖子] [评论]                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 📋 政策审核                             │   │
│  │                                         │   │
│  │ 漕河泾算力补贴政策（修订版）         │   │
│  │ 提交人：运营小李                         │   │
│  │ 提交时间：2024-04-16 10:30              │   │
│  │                                         │   │
│  │ [查看详情]                              │   │
│  │                                         │   │
│  │        [拒绝]        [通过]             │   │
│  │                                         │   │
│  │ 拒绝理由：                              │   │
│  │ ┌─────────────────────────────────┐    │   │
│  │ │                                 │    │   │
│  │ └─────────────────────────────────┘    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.7.3 前端组件

| 组件 | 说明 |
|-----|------|
| AdminLayout | 后台布局（侧边栏+内容区）|
| StatCard | 统计卡片 |
| ChartWidget | 图表组件 |
| TodoList | 待办事项 |
| AuditQueue | 审核队列 |
| DataTable | 数据表格 |

---

## 4. 技术架构

### 4.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Web     │  │  Mobile  │  │  AI Agent│  │  Admin   │    │
│  │  (Next)  │  │  (H5)    │  │  (API)   │  │  (Web)   │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                      API 网关层                             │
│                   (Kong / Nginx)                            │
│  • 限流 • 认证 • 路由 • 日志 • 监控                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                      应用服务层                             │
│                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │ Policy     │ │ Skill      │ │ Community  │              │
│  │ Service    │ │ Service    │ │ Service    │              │
│  └────────────┘ └────────────┘ └────────────┘              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │ User       │ │ Training   │ │ AI Gateway │              │
│  │ Service    │ │ Service    │ │ Service    │              │
│  └────────────┘ └────────────┘ └────────────┘              │
│                                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                      数据存储层                             │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ PostgreSQL│ │  Redis   │ │Elasticsearch│ │  OSS     │       │
│  │ (主数据)  │ │ (缓存)   │ │  (搜索)  │ │ (文件)   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 技术栈推荐

| 层次 | 技术选型 | 说明 |
|-----|---------|------|
| **前端** | Next.js 14 + TailwindCSS + shadcn/ui | React生态，SSR支持 |
| **后端** | Node.js + NestJS / Python + FastAPI | 可选，推荐NestJS |
| **数据库** | PostgreSQL 15+ | 主数据库 |
| **缓存** | Redis 7+ | 会话、缓存、限流 |
| **搜索** | Elasticsearch 8+ | 全文搜索 |
| **文件存储** | 阿里云OSS / AWS S3 | 图片、文件 |
| **消息队列** | RabbitMQ / Apache Kafka | 异步处理 |
| **网关** | Kong / Nginx | API网关 |
| **容器** | Docker + Kubernetes | 容器编排 |
| **监控** | Prometheus + Grafana | 监控告警 |

### 4.3 项目结构

```
opc-platform/
├── apps/
│   ├── web/                    # Next.js 前端
│   │   ├── src/
│   │   │   ├── app/           # App Router
│   │   │   ├── components/    # 组件
│   │   │   ├── lib/           # 工具函数
│   │   │   └── styles/        # 样式
│   │   └── package.json
│   │
│   ├── admin/                  # 管理后台
│   │   └── ...
│   │
│   └── api/                    # 后端API
│       ├── src/
│       │   ├── modules/       # 业务模块
│       │   │   ├── policy/
│       │   │   ├── skill/
│       │   │   ├── community/
│       │   │   ├── user/
│       │   │   ├── training/
│       │   │   └── ai-gateway/
│       │   ├── common/        # 公共代码
│       │   └── main.ts        # 入口
│       └── package.json
│
├── packages/
│   ├── shared/                 # 共享类型和工具
│   └── ui/                     # 共享UI组件
│
├── docker-compose.yml
└── turbo.json                  # Monorepo配置
```

---

## 5. 安全设计

### 5.1 认证授权

- **JWT Token**: 访问令牌（短期）+ 刷新令牌（长期）
- **API Key**: AI Agent接入使用，支持权限分级
- **OAuth 2.0**: 微信登录集成
- **RBAC**: 基于角色的权限控制

### 5.2 数据安全

- **传输加密**: HTTPS/TLS 1.3
- **密码加密**: bcrypt算法
- **敏感数据**: 手机号等加密存储
- **SQL注入**: ORM参数化查询
- **XSS防护**: 输入过滤、输出转义

### 5.3 业务安全

- **防刷**: 短信验证码限流（1分钟1次，1小时5次）
- **API限流**: 按Key限流，防止滥用
- **内容审核**: 敏感词过滤 + 人工审核
- **交易安全**: 防欺诈检测

---

## 6. 性能设计

### 6.1 前端性能

- **代码分割**: 按路由懒加载
- **图片优化**: WebP格式、响应式图片
- **缓存策略**: SSG页面静态缓存、API数据SWR
- **骨架屏**: 加载状态优化

### 6.2 后端性能

- **数据库优化**: 索引、查询优化、读写分离
- **缓存策略**: Redis多级缓存（热点数据TTL）
- **异步处理**: 非核心流程异步化（消息队列）
- **连接池**: 数据库连接池管理

### 6.3 性能指标

| 指标 | 目标 |
|-----|------|
| 首屏加载 | < 2s |
| API响应 | < 200ms (P95) |
| 搜索响应 | < 500ms |
| 并发用户 | 1万+ |
| 可用性 | 99.9% |

---

## 7. 部署架构

### 7.1 开发环境

```
开发者本地
├── Next.js dev server (http://localhost:3000)
├── NestJS dev server (http://localhost:3001)
├── PostgreSQL (Docker)
├── Redis (Docker)
└── Elasticsearch (Docker)
```

### 7.2 生产环境

```
阿里云/腾讯云
├── CDN (静态资源加速)
├── SLB (负载均衡)
├── ECS集群
│   ├── Web服务器 (Next.js SSR)
│   ├── API服务器 (NestJS)
│   └── 定时任务服务器
├── RDS (PostgreSQL主从)
├── Redis (集群)
├── Elasticsearch
└── OSS (文件存储)
```

---

## 8. 附录

### 8.1 API版本策略

- URL版本: `/api/v1/...`
- 向后兼容保证
- 弃用提前通知

### 8.2 错误码规范

```
200 - 成功
400 - 请求参数错误
401 - 未认证
403 - 无权限
404 - 资源不存在
429 - 请求过于频繁
500 - 服务器内部错误
```

### 8.3 命名规范

- **接口**: RESTful风格，小写，短横线分隔
- **数据库**: snake_case
- **代码**: camelCase (JS/TS)
- **组件**: PascalCase

---

**文档结束**
