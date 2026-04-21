# 技术架构

## 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5
- **样式**: TailwindCSS + shadcn/ui
- **状态管理**: Zustand
- **数据获取**: TanStack Query (React Query)
- **表单**: React Hook Form + Zod

### 后端
- **框架**: NestJS 10
- **语言**: TypeScript 5
- **数据库**: PostgreSQL 16
- **ORM**: Prisma
- **缓存**: Redis 7
- **搜索**: Elasticsearch 8 (可选，先用PostgreSQL全文搜索)
- **消息队列**: Bull (Redis-based)
- **文件存储**: 本地开发 / 阿里云OSS生产

### 部署
- **容器**: Docker + Docker Compose
- **反向代理**: Nginx
- **监控**: 基础日志 (后续接入更完善的监控)

## 项目结构

```
opc-platform/
├── apps/
│   ├── web/                    # Next.js 前端
│   ├── api/                    # NestJS 后端
│   └── admin/                  # 管理后台 (Next.js)
├── packages/
│   └── shared/                 # 共享类型定义
├── docker-compose.yml
└── package.json (workspace root)
```

## 开发规范

### 代码风格
- ESLint + Prettier 统一格式化
- 命名: camelCase (变量/函数), PascalCase (类/组件), snake_case (数据库)
- 接口: RESTful, /api/v1/ 前缀

### Git工作流
- main: 生产分支
- develop: 开发分支
- feature/*: 功能分支

### 数据库规范
- 表名: 复数形式，snake_case
- 字段: snake_case
- 时间戳: created_at, updated_at
- 软删除: deleted_at (可选)

## API设计原则

1. **版本控制**: URL路径版本 /api/v1/
2. **认证**: JWT Access Token (短期) + Refresh Token (长期)
3. **AI Gateway**: API Key认证，单独限流
4. **响应格式**: { code, message, data }

## 安全要点

- 密码: bcrypt加密
- JWT: RS256非对称加密
- API限流: 100次/分钟 (普通), 1000次/分钟 (付费)
- CORS: 白名单控制
- SQL注入: Prisma ORM防护
