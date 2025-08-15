<script lang="ts" setup>
useHead({
  title: '关于｜早早集市',
  meta: [
    {
      name: 'description',
      content: '点击了解什么是早早集市，包含本站全栈开发过程以及作者的开发愿景',
    },
  ],
})
</script>

<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8">
      <div class="flex flex-col gap-4 md:gap-8">
        <!-- 内容卡片 -->
        <div class="">
          <div class="w-full flex flex-col gap-4 md:gap-6 leading-7">
            <div class="space-y-3 md:space-y-4">
              <h2 class="pixel-title flex items-center">
                <div class="pixel-indicator pixel-indicator-primary" />
                为什么需要登录
              </h2>
              <div class="space-y-2 md:space-y-3 pixel-text">
                <p><strong>仅仅作为限流的手段，就算被人拿到也没有什么用处，我不会存储任何敏感信息。</strong></p>
                <p>用户名和密码完全是自定义的，头像我都不想存。</p>
                <p>邮箱仅用来通知，这应该不是啥敏感信息</p>
                <p>网站地址也属于公开信息</p>
                <p>没有支付/付费、没有手机号</p>
                <p>没有用户信息，会限制后面很多功能的实现。万一网站壮大了！还是希望能产生更多简易的交互的🤪</p>
              </div>
            </div>

            <div class="space-y-3 md:space-y-4">
              <h2 class="pixel-title flex items-center">
                <div class="pixel-indicator pixel-indicator-secondary" />
                内容
              </h2>
              <div class="space-y-2 md:space-y-3 pixel-text">
                <p>本站内容为鄙人生活经验的一部分<strong>映射</strong>，体现在文字内容上，也体现在网站本身。</p>
                <p>文章多为全栈(前端)技术实战教程、日常所思所想，没什么深度，只是为了体现出站点的属性。</p>
                <p>技术文章几乎都携带对应的技术栈版本，这也是建站的初衷之一，同一个框架的两个版本甚至有可能就是两个框架，我实在不想你等看完文章之后才能发现和自己想要的不是一个东西</p>
                <p>由于是自建博客，在标签、分类、筛选等功能上还有待开发，因为并没觉得现有的其他博客框架上对于这些功能的实现有多好用，但我也暂时没有更好的方式。</p>
                <p>所以，先空着</p>
              </div>
            </div>

            <div class="space-y-3 md:space-y-4">
              <h2 class="pixel-title flex items-center">
                <div class="pixel-indicator pixel-indicator-accent" />
                早早集市
              </h2>
              <div class="space-y-2 md:space-y-3 pixel-text">
                <p>生活就像是一场游戏，我主观的归结为六个大方向： <strong>记录、分享、连接、通知、获取、成就</strong>。</p>
                <p>早早集市就像是游戏的一个 <strong>DLC</strong>，把生活中的事物和关系用<strong>技术和数据</strong>表达出来，也算是增加了一种新的玩法，也许本身也是成就的体现</p>
                <p>网站建设的方向/功能未来也会围绕这几大方向展开</p>
                <p>......</p>
              </div>
            </div>

            <div class="space-y-3 md:space-y-4">
              <h2 class="pixel-title flex items-center">
                <div class="pixel-indicator pixel-indicator-primary" />
                技术
              </h2>
              <div class="space-y-2 md:space-y-3 pixel-text">
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
        </div>
      </div>
    </div>
  </div>
</template>
