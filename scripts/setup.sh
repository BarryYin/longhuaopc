#!/bin/bash
set -e

echo "🚀 OPC Platform 开发环境初始化"

# 1. 启动基础设施
echo "📦 启动 PostgreSQL & Redis..."
cd "$(dirname "$0")/.."
docker-compose up -d

# 2. 等待数据库就绪
echo "⏳ 等待数据库就绪..."
sleep 3

# 3. 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
  echo "📥 安装依赖..."
  npm install
fi

# 4. 生成 Prisma Client
echo "🔄 生成 Prisma Client..."
cd apps/api
npx prisma generate

# 5. 运行数据库迁移
echo "🗄️  运行数据库迁移..."
npx prisma migrate deploy

# 6. 填充种子数据
echo "🌱 填充种子数据..."
npx ts-node prisma/seed.ts

echo ""
echo "✅ 环境初始化完成！"
echo ""
echo "接下来请运行："
echo "  npm run dev:api    # 启动后端 API (http://localhost:3009)"
echo "  npm run dev:web    # 启动前端 Web (http://localhost:3008)"
