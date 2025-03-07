<template>
  <div class="flex flex-wrap gap-2 w-full h-full justify-center items-center">
    <template v-for="link of links">
      <NuxtLink :href="link.url" target="_blank" >
        <div class="link-item flex gap-2 bg-zinc-100 w-[300px] h-[100px] p-4 rounded-lg">
          <UserAvatar :previewUrl="link.url + '/favicon.ico'" size="large" class="w-[60px] h-[60px]"></UserAvatar>
          <div class="flex flex-col gap-1 flex-1">
            <div class="font-bold text-xl"> {{ link.name}} </div>
            <div class="text-sm text-zinc-800 overflow-hidden">{{ link.desc }}</div>
          </div>
        </div>
      </NuxtLink>
    </template>
  </div>
</template>
<script lang="ts" setup>
useHead({
  title: '友链',
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
    desc:  '一个全栈开发者的博客站',
  },
  {
    name: 'IMGX',
    url: 'https://imgx.zzao.club',
    desc: '便捷地生成精美卡片',
  },
  // {
  //   name: 'MEMOZ',
  //   url: 'https://memo.zzao.club',
  //   desc:  'Nuxt 版 Flomo',
  // }
]
</script>