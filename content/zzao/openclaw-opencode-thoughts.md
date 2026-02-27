---
title: 最近使用 openclaw 和 opencode 的几条感悟
date: 2026-02-27
lastmod: 2026-02-27
showTitle: openclaw-opencode-thoughts
tags: ["AI", "Agent"]
author: "阿康"

---
最近使用 openclaw 和 opencode 的几条感悟：

1）从🪜到订阅渠道到要稳定，尤其是高频使用时，一会一个 retry 太难受了。

2）再好的模型，上下文长了也会有幻觉，所以记得完成一个闭环的任务，马上 /new 新的 session。

3）用垃圾模型就是浪费自己的时间。

4）大需求/大任务，一定要先 plan 再 build，然后遵循第二条。

5）openclaw 没那么神，但它代表了一个新的思路/方向。

6）App 死不了，还是因为上下文长度问题。数据还是由已有的 App 逻辑掌控最好，但 App 必须开放给 Agent 接口才好用。

7）Agent 就像是员工一样，Agent A 交代给 Agent B 工作时，不应该描述过多 Agent B 分内的详细工作，而是让它用自己的专业能力去完成 "需求"。

8）安装 openclaw 这种 Agent 工具，最好的办法是让另一个 Agent 工具去安装它，比如 opencode。

9）今天惊奇的发现，用自己的脑子写代码不烧 Token！
