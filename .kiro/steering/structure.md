# 项目结构

## Monorepo组织

使用npm workspaces管理多包项目。

## 目录约定

### apps/web (前端)
```
src/
├── app/                 # Next.js App Router
│   ├── (main)/         # 主站路由组
│   │   ├── page.tsx    # 首页
│   │   ├── policies/   # 政策中心
│   │   ├── market/     # 能力市场
│   │   ├── community/  # 社区
│   │   └── academy/    # 成长学院
│   ├── (auth)/         # 认证路由组
│   ├── api/            # API Routes
│   └── layout.tsx      # 根布局
├── components/         # React组件
│   ├── ui/            # 基础UI组件
│   ├── layout/        # 布局组件
│   └── features/      # 业务组件
├── lib/               # 工具函数
├── hooks/             # 自定义Hooks
├── stores/            # Zustand状态
└── types/             # 类型定义
```

### apps/api (后端)
```
src/
├── modules/           # 业务模块
│   ├── auth/         # 认证
│   ├── users/        # 用户
│   ├── policies/     # 政策
│   ├── skills/       # 技能市场
│   ├── community/    # 社区
│   ├── training/     # 培训
│   └── ai-gateway/   # AI网关
├── common/           # 公共代码
│   ├── decorators/   # 装饰器
│   ├── filters/      # 异常过滤器
│   ├── guards/       # 守卫
│   └── interceptors/ # 拦截器
├── config/           # 配置文件
├── prisma/           # 数据库schema
└── main.ts           # 入口
```

## 文件命名

- 组件: PascalCase (PolicyCard.tsx)
- 页面: page.tsx, layout.tsx (Next.js约定)
- 工具: camelCase (formatDate.ts)
- 样式: kebab-case (globals.css)
- 常量: UPPER_SNAKE_CASE

## 导入规范

1. 外部库
2. 内部模块 (@/components, @/lib)
3. 相对路径 (./, ../)

## 模块划分原则

- 高内聚: 相关功能放在同一模块
- 低耦合: 模块间通过接口通信
- 可测试: 每个模块独立可测
