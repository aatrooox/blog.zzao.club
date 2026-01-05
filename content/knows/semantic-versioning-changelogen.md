---
title: 语义版本控制说明 unjs/changelogen
date: 2025-02-25
lastmod: 2025-08-19
---
版本号规则为：`MAJOR.MINOR.PATCH`

1. 当进行不兼容API更改和升级时，升级 `major` 版本
2. 以向后兼容的方式添加功能时，升级 `minor` 版本
3. 修复bug时，升级 `patch` 版本

与之对应的三个命令（包含 `github release pub` ）为：

1.  `npx changelogen@latest --release --patch --push`
2. `npx changelogen@latest --release --minor --push`
3. `npx changelogen@latest --release --major --push`

但是如果你的版本号从 `0.0.1` 开始

那 `patch` 和 `minor` 都只能升级到 `0.0.2`

使用 `--major` 可以升级到 `0.1.0`

注意：再次使用 `--major` 也只会升级到 `0.2.0`

因为 `0.yz` 版本表示不稳定的版本，所以三个语义发生了改变，不适用于常规的 `1.0.0` 这样的版本

如果要发布到 `v1.0.0` , 可以使用 `-r v1.0.0` ，此后就可以用 `MAJOR.MINOR.PATCH` 这个规则就行正常更新版本号了。（目前没发现有直接的命令处理v1.0.0版本的发布）

**changelogen types**

```typescript
types: {
      feat: { title: "🚀 Enhancements", semver: "minor" },
      perf: { title: "🔥 Performance", semver: "patch" },
      fix: { title: "🩹 Fixes", semver: "patch" },
      refactor: { title: "💅 Refactors", semver: "patch" },
      docs: { title: "📖 Documentation", semver: "patch" },
      build: { title: "📦 Build", semver: "patch" },
      types: { title: "🌊 Types", semver: "patch" },
      chore: { title: "🏡 Chore" },
      examples: { title: "🏀 Examples" },
      test: { title: "✅ Tests" },
      style: { title: "🎨 Styles" },
      ci: { title: "🤖 CI" },
    }
```