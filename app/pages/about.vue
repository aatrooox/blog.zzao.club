<script lang="ts" setup>
// const { $api } = useNuxtApp()
// const toast = useGlobalToast()

useHead({
  title: '关于｜早早集市',
  meta: [
    {
      name: 'description',
      content: '点击了解什么是早早集市，包含本站全栈开发过程以及作者的开发愿景',
    },
  ],
})

// const { frameworks } = useAppConfig()

// const newLink = ref(JSON.stringify({
//   name: '网站名称',
//   url: 'https://www.example.com',
//   desc: '网站描述',
// }, null, 2))

// async function addLink() {
//   console.log(newLink.value)
//   let propsObj: any
//   try {
//     // 先尝试直接解析\
//     propsObj = JSON.parse(newLink.value)
//   }
//   catch (e) {
//     try {
//       // 如果直接解析失败，尝试处理格式
//       const jsonStr = newLink.value
//         .replace(/(['"])?(\w+)(['"])?:/g, '"$2":') // 只处理键名部分
//         .replace(/'/g, '"') // 将单引号替换为双引号

//       propsObj = JSON.parse(jsonStr)
//     }
//     catch (e) {
//       console.error('转换失败', e)
//       return
//     }
//   }

//   console.log(propsObj)
//   const res = await $api.post('/api/v1/link/add', propsObj)

//   if (res.error) {
//     // toast.add({ type: 'warning', message: res.error.message ?? '提交失败，请检查格式'})
//   }
//   else {
//     toast.add({ type: 'success', message: '提交成功' })
//   }
// }
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col gap-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          关于本站
        </h1>
      </div>

      <div class="w-full flex flex-col gap-4 leading-7">
        <h2 class="text-lg font-bold">
          # 为什么需要登录
        </h2>
        <p> <strong>仅仅作为限流的手段，就算被人拿到也没有什么用处，我不会存储任何敏感信息。</strong></p>
        <p> 用户名和密码完全是自定义的，头像我都不想存。</p>
        <p> 邮箱仅用来通知，这应该不是啥敏感信息 </p>
        <p> 网站地址也属于公开信息</p>
        <p> 没有支付/付费、没有手机号</p>
        <p> 没有用户信息，会限制后面很多功能的实现。万一网站壮大了！还是希望能产生更多简易的交互的🤪</p>
        <h2 class="text-lg font-bold">
          # 内容
        </h2>
        <p>本站内容为鄙人生活经验的一部分<strong>映射</strong>，体现在文字内容上，也体现在网站本身。</p>
        <p>文章多为全栈(前端)技术实战教程、日常所思所想，没什么深度，只是为了体现出站点的属性。</p>
        <p>技术文章几乎都携带对应的技术栈版本，这也是建站的初衷之一，同一个框架的两个版本甚至有可能就是两个框架，我实在不想你等看完文章之后才能发现和自己想要的不是一个东西</p>
        <p>由于是自建博客，在标签、分类、筛选等功能上还有待开发，因为并没觉得现有的其他博客框架上对于这些功能的实现有多好用，但我也暂时没有更好的方式。</p>
        <p>所以，先空着</p>
        <h2 class="text-lg font-bold">
          # 早早集市
        </h2>
        <p>生活就像是一场游戏，我主观的归结为六个大方向： <strong>记录、分享、连接、通知、获取、成就</strong>。</p>
        <p>早早集市就像是游戏的一个 <strong>DLC</strong>，把生活中的事物和关系用<strong>技术和数据</strong>表达出来，也算是增加了一种新的玩法，也许本身也是成就的体现</p>
        <p>网站建设的方向/功能未来也会围绕这几大方向展开</p>
        <p>......</p>
        <h2 class="text-lg font-bold">
          # 技术
        </h2>
        <p>技术层面: 完全基于 Nuxt、Nitro、NuxtContent 自建，古法手工敲制。</p>
        <p>部署 在<strong>海外[新加坡]轻量服务器[2C 8G Debian12]</strong>上</p>
        <p>图片 目前用的是腾讯云对象存储+CDN</p>
        <p>文章 源于 Obsidian 的 Github 仓库，自动同步文章</p>
        <p>自动更新 基于 Gitea 的 workflow，定时更新文章</p>
        <p><strong>为什么不选 NextJS xxx ...?</strong></p>
        <p>目前大部分工作量其实都是在写后端逻辑，前端框架的选择实在不值得考量，因为不是受雇于人，所以我选择了上手最快的全栈框架</p>
        <p>实际使用下来，Nuxt为中小型项目服务，够用且好用</p>
      </div>
    </div>
  </div>
</template>
