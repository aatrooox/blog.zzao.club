# 第8题：Node.js 性能调优 - 标准答案

## 题目

Node.js 性能调优：如何分析和优化 Node.js 应用的性能？

---

## 标准答案

### 1. 性能分析工具

**CPU 分析**：
```bash
# 使用 --cpu-prof 生成 CPU profile
node --cpu-prof app.js

# 使用 Clinic.js
npm install -g clinic
clinic doctor -- node app.js  # 诊断性能问题
clinic flame -- node app.js   # 生成火焰图
```

**内存分析**：
```bash
# 生成 Heap Snapshot
node --inspect app.js
# Chrome DevTools → Memory → Take snapshot

# 使用 heapdump
const heapdump = require('heapdump')
heapdump.writeSnapshot('./heap-' + Date.now() + '.heapsnapshot')
```

---

### 2. 常见性能问题

**问题1：同步代码阻塞**
```javascript
// ❌ 同步读文件阻塞 Event Loop
const data = fs.readFileSync('/large-file.txt')

// ✅ 异步读取
const data = await fs.promises.readFile('/large-file.txt')
```

**问题2：未使用连接池**
```javascript
// ❌ 每次都创建新连接
const mysql = require('mysql')
const conn = mysql.createConnection(config)

// ✅ 使用连接池
const pool = mysql.createPool(config)
```

**问题3：内存泄漏**
```javascript
// ❌ 全局变量累积
const cache = {}
app.get('/data/:id', (req, res) => {
  cache[req.params.id] = fetchData(req.params.id)
  res.json(cache[req.params.id])
})

// ✅ 使用 LRU 缓存
const LRU = require('lru-cache')
const cache = new LRU({ max: 500 })
```

---

### 3. 优化策略

**集群模式**：
```javascript
const cluster = require('cluster')
const os = require('os')

if (cluster.isMaster) {
  const numCPUs = os.cpus().length
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
} else {
  // Worker 进程运行服务器
  require('./app.js')
}
```

**缓存优化**：
- 使用 Redis 缓存热点数据
- 使用 CDN 缓存静态资源
- 使用内存缓存（如 LRU）

**数据库优化**：
- 添加索引
- 使用连接池
- 避免 N+1 查询

---

## 最佳实践

1. **使用 PM2 管理进程**
2. **启用 Cluster 模式**
3. **监控关键指标**（CPU、内存、响应时间）
4. **使用缓存策略**
5. **优化数据库查询**
6. **避免同步代码**

---

## 扩展阅读

- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Clinic.js 性能分析](https://clinicjs.org/)
