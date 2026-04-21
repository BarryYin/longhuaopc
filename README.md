# 龙华OPC社区

为AI时代独立创业者（One Person Company）打造的一站式服务平台。

## 项目简介

**核心理念**：让AI为你的创业加速

**三大核心能力**：
1. **AI政策引擎** - 智能匹配龙华/徐汇区OPC扶持政策
2. **能力市场** - 接单派单，技能交易
3. **成长社区** - 交流分享，学习成长

**AI-First架构**：支持AI Agent通过API接入，代劳查询、匹配、交易

## 技术栈

### 后端
- **框架**: NestJS 10
- **数据库**: PostgreSQL 16 + Prisma ORM
- **缓存**: Redis 7
- **认证**: JWT + 短信验证码

### 前端
- **框架**: Next.js 14 + React 18
- **样式**: TailwindCSS
- **状态**: Zustand + TanStack Query

### 基础设施
- **容器**: Docker + Docker Compose
- **网关**: Nginx

## 快速开始

### 环境要求
- Node.js ≥ 18
- Docker & Docker Compose
- npm ≥ 9

### 1. 克隆并进入项目

```bash
cd opc-platform
```

### 2. 启动基础设施（数据库、缓存）

```bash
npm run docker:up
```

这将启动：
- PostgreSQL (端口: 5432)
- Redis (端口: 6379)

### 3. 安装依赖

```bash
npm install
```

### 4. 初始化数据库

```bash
# 生成Prisma客户端
cd apps/api && npx prisma generate

# 执行数据库迁移
npx prisma migrate dev --name init

# 导入示例数据
npx prisma db seed
```

### 5. 启动开发服务器

**方式一：分别启动**

```bash
# 终端1 - 后端API
cd apps/api && npm run dev

# 终端2 - 前端Web
cd apps/web && npm run dev
```

**方式二：Docker Compose（推荐）**

```bash
docker-compose up -d
```

### 6. 访问服务

- **前端**: http://localhost:3000
- **后端API**: http://localhost:3001
- **API文档**: http://localhost:3001/api/docs

## 项目结构

```
opc-platform/
├── apps/
│   ├── api/                    # NestJS 后端
│   │   ├── src/
│   │   │   ├── modules/       # 业务模块
│   │   │   │   ├── auth/      # 认证
│   │   │   │   ├── users/     # 用户
│   │   │   │   ├── policies/  # 政策引擎
│   │   │   │   ├── skills/    # 技能市场
│   │   │   │   ├── community/ # 社区
│   │   │   │   ├── training/  # 培训
│   │   │   │   └── ai-gateway/# AI网关
│   │   │   ├── common/        # 公共代码
│   │   │   └── app.module.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # 数据库模型
│   │   │   └── seed.ts        # 种子数据
│   │   └── package.json
│   │
│   └── web/                    # Next.js 前端
│       ├── src/
│       │   ├── app/           # 页面路由
│       │   ├── components/    # 组件
│       │   │   ├── ui/       # UI组件
│       │   │   ├── layout/   # 布局组件
│       │   │   └── sections/ # 页面区块
│       │   └── lib/           # 工具函数
│       └── package.json
│
├── .kiro/                      # Kiro项目配置
│   ├── steering/              # 架构文档
│   └── specs/                 # 模块设计
│
├── docker-compose.yml
└── package.json
```

## 核心功能模块

| 模块 | 说明 | API端点 |
|-----|------|---------|
| **认证** | 手机号+验证码登录 | `/auth/*` |
| **用户** | 用户资料管理 | `/users/*` |
| **政策** | 政策查询、智能匹配 | `/policies/*` |
| **技能市场** | 服务发布、需求对接 | `/skills/*` |
| **社区** | 帖子、评论、互动 | `/community/*` |
| **培训** | 课程、导师 | `/training/*` |
| **AI Gateway** | API Key管理 | `/ai-gateway/*` |

## 示例数据

项目初始化后包含以下示例数据：

**政策**:
- 漕河泾开发区算力补贴（最高30万）
- 徐汇区模速空间大模型创新生态社区（3年零租金）
- 徐汇区小微企业税收优惠
- 徐汇区创业担保贷款（最高300万）

**课程**:
- ChatGPT应用开发实战
- 一人公司商业模式设计
- AI时代的个人品牌打造

## API使用示例

### 政策查询
```bash
# 获取政策列表
curl http://localhost:3001/api/v1/policies

# 智能匹配政策
curl "http://localhost:3001/api/v1/policies/match?location=龙华&industry=AI"
```

### 用户认证
```bash
# 发送验证码
curl -X POST http://localhost:3001/api/v1/auth/sms/send \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000"}'

# 登录
curl -X POST http://localhost:3001/api/v1/auth/login/phone \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","code":"123456"}'
```

## 开发命令

```bash
# 安装依赖
npm install

# 启动Docker基础设施
npm run docker:up

# 数据库操作
cd apps/api
npx prisma migrate dev      # 创建迁移
npx prisma db seed          # 导入种子数据
npx prisma studio           # 打开数据库管理界面

# 开发模式
npm run dev                 # 使用Turbo同时启动前后端

# 代码检查
npm run lint
```

## 部署

### 生产环境配置

1. 修改环境变量
   - `JWT_SECRET` - 生产环境密钥
   - `DATABASE_URL` - 生产数据库地址
   - `REDIS_URL` - 生产Redis地址

2. 构建并启动
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 文档

- [商业设计.md](./商业设计.md) - 商业计划书
- [产品设计PRD.md](./产品设计PRD.md) - 产品详细设计
- [roadmap.md](./roadmap.md) - 技术路线图

## 贡献

1. Fork 本仓库
2. 创建功能分支 `git checkout -b feature/xxx`
3. 提交更改 `git commit -m 'Add xxx'`
4. 推送分支 `git push origin feature/xxx`
5. 创建 Pull Request

## 许可证

MIT
