# 部署说明（Docker Compose）

本文档说明如何使用 Docker Compose 在本地与生产环境部署本项目。

## 结构
- docker-compose.local.yml：本地开发只启动 mysql + redis（app 本地用 `pnpm dev` 独立起）
- docker-compose.prod.yml：生产部署（使用发布镜像）
- .env.prod.example：生产环境变量示例

## 前置要求
- 已安装 Docker 和 Docker Compose v2
- 生产环境建议准备反向代理（如 Nginx/Caddy）负责 TLS 与 80/443 到 app:3000 的转发

## 本地启动
"""
# 启动依赖（仅 mysql + redis）
"""
# 可选：创建/编辑 .env 覆盖变量
# 然后启动
# docker compose -f docker-compose.local.yml up -d

在另一个终端以本地方式启动应用：
"""
pnpm dev
"""

## 生产部署
1. 复制 .env.prod 示例并填写实际值：
"""
cp .env.prod.example .env.prod
vi .env.prod
"""
2. 使用生产 compose 启动（使用 env_file：/root/envs/blog/.env）：
"""
docker compose -f docker-compose.prod.yml up -d
"""
3. 验证健康检查：
- mysql/redis 会在健康后再启动 app
- app 健康检查：HTTP 200 at http://localhost:3000

## 环境变量说明（关键）
- DATABASE_URL：MySQL 连接串（示例：mysql://root:pass@mysql:3306/blog）
- REDIS_HOST/REDIS_PORT：Redis 连接（默认为 redis:6379）
- NUXT_JWT_SECRET：JWT 签名密钥（请设置强随机值）
- NUXT_PUBLIC_IMG_HOST：前端公共图片域名
- APP_IMAGE：生产镜像引用（默认 ghcr.io/your-org/blog.zzao.club:latest）

生产环境请在服务器维护统一 env 文件路径：`/root/envs/blog/.env`，compose 会自动读取。

## 镜像构建与推送（可选）
如需自建镜像仓库：
"""
# 构建
docker build -t your-registry/blog:z-latest .
# 推送
docker push your-registry/blog:z-latest
# 部署时覆盖 APP_IMAGE
# APP_IMAGE=your-registry/blog:z-latest docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
"""

## 数据持久化
- MySQL：挂载到 volume mysql_data
- Redis：挂载到 volume redis_data（AOF 已开启）

## 备份与恢复（简要）
- MySQL：使用 mysqldump 备份/恢复
- Redis：备份 /data 下 AOF/RDB 文件

## 常见问题
- 应用无法连接 Redis：确认 .env.prod 中 REDIS_HOST/REDIS_PORT 与 compose 网络一致
- Prisma/Drizzle 连接失败：检查 DATABASE_URL；生产库需放在 mysql 服务名而非 localhost
- 端口占用：变更 compose 中 app 的 ports 映射，例如 8080:3000
