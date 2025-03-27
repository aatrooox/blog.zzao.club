<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col gap-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">友情链接</h1>
        <p class="text-zinc-600 dark:text-zinc-400">欢迎与我交换友链，一起分享技术</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-for="link of links" :key="link.url">
          <NuxtLink :href="link.url" target="_blank" class="group">
            <div class="h-full p-4 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:shadow-lg hover:shadow-zinc-200 dark:hover:shadow-zinc-900 transition-all duration-200">
              <div class="flex items-start gap-4">
                <div class="relative">
                  <UserAvatar :previewUrl="link.url + '/favicon.ico'" size="large" class="w-16 h-16 rounded-lg"></UserAvatar>
                  <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-800"></div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {{ link.name }}
                  </div>
                  <div class="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                    {{ link.desc }}
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </template>
      </div>

      <div class="mt-8 p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">申请友链</h2>
        <p class="text-zinc-600 dark:text-zinc-400 mb-4">
          如果你也想与我交换友链，请按照以下格式在评论区留言：
        </p>
        <div class="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md">
          <pre class="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
{
  "name": "你的网站名称",
  "url": "你的网站地址",
  "desc": "你的网站描述"
}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
useHead({
  title: '友链｜早早集市',
  meta: [
    {
      name: 'description',
      content: '早早集市｜博客站｜前端｜全栈｜前端架构｜Node｜Nuxt｜Hono｜Bun|副业',
    },
    {
      name: 'keywords',
      content: '早早集市,博客站,前端,前端工程化,前端架构,Node,Nuxt,Hono,副业',
    },
  ],
})

const links = [
  {
    name: '早早集市',
    url: 'https://blog.zzao.club',
    desc: '一个全栈开发者的博客站',
  },
  {
    name: 'IMGX',
    url: 'https://imgx.zzao.club',
    desc: '便捷地生成精美卡片',
  },
  // {
  //   name: 'MEMOZ',
  //   url: 'https://memo.zzao.club',
  //   desc: 'Nuxt 版 Flomo',
  // }
]
</script>