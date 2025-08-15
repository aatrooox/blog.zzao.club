# ---- Stage 1: Build ----
# 使用一个包含完整构建工具链的 Node.js 镜像作为构建环境
FROM node:20-alpine AS builder

# 在容器内安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 pnpm 相关配置文件和 package.json
# 这样做可以利用 Docker 的层缓存机制。只有当这些文件发生变化时，才会重新执行 pnpm install。
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./

# 安装项目依赖
# --frozen-lockfile 确保使用锁文件中的确切版本
RUN pnpm install --frozen-lockfile

# 复制项目中的所有文件到工作目录
# .dockerignore 文件会排除不需要复制的文件（如 node_modules, .nuxt, .output 等）
COPY . .

# 执行构建命令
# 这会编译 Nuxt 应用，并自动运行 prisma generate
RUN pnpm build

# ---- Stage 2: Production ----
# 使用一个轻量的 Node.js 镜像作为最终的生产环境
FROM node:20-alpine AS runner

# 设置工作目录
WORKDIR /app

# 从构建阶段（builder）复制编译后的产物到当前阶段
# Nuxt 3 的构建产物位于 .output 目录，它包含了运行所需的一切
COPY --from=builder /app/.output .

# 设置环境变量
# HOST=0.0.0.0 使得容器内的服务可以从外部访问
# PORT=3000 是 Nuxt 默认的端口
ENV HOST=0.0.0.0
ENV PORT=3000
# 您的应用使用了 Prisma，请确保在运行容器时提供 DATABASE_URL 环境变量
# 例如: docker run -e DATABASE_URL="postgresql://..." my-nuxt-app
ENV DATABASE_URL=""

# 暴露容器的 3000 端口
EXPOSE 3000

# 容器启动时执行的命令
# 启动 Nuxt 的生产服务器
CMD ["node", "server/index.mjs"]
