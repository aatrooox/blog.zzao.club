<script lang="ts" setup>
// const { $api } = useNuxtApp()
// const toast = useGlobalToast()

useHead({
  title: '友链｜早早集市',
  meta: [
    {
      name: 'description',
      content: '早早集市友情链接，点击和我互换友链吧',
    },
  ],
  link: [
    { rel: 'canonical', href: 'https://zzao.club/links' },
  ],
})

const { links } = useAppConfig()

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
//   catch {
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
//   await $api.post('/api/v1/fsf/push/mail/send', {
//     name: '测试人员',
//     text: '你好，我试试邮件\n 可以么？\n 测试一下',
//     to: 'gnakzz@qq.com',
//   })

//   if (res.error) {
//     // toast.add({ type: 'warning', message: res.error.message ?? '提交失败，请检查格式'})
//   }
//   else {
//     toast.add({ type: 'success', message: '提交成功' })
//   }
// }
</script>

<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <!-- 页面标题区 -->
      <div class="mb-8 md:mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-zinc-800 dark:text-zinc-100 mb-3">
          友情链接
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
          点击卡片访问友链，发现更多精彩内容
        </p>
      </div>

      <!-- 友链列表 -->
      <div class="max-w-3xl mx-auto space-y-3">
        <template v-for="link of links" :key="link.url">
          <NuxtLink
            :href="link.url"
            target="_blank"
            class="group block"
          >
            <div class="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 transition-all duration-300 hover:border-primary/30 dark:hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md">
              <div class="flex items-center gap-4">
                <!-- 头像 -->
                <div class="shrink-0">
                  <AppImg
                    :src="link.logo || `${link.url}/favicon.ico`"
                    :alt="link.name"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                </div>

                <!-- 内容 -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-base md:text-lg font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-primary transition-colors duration-300">
                    {{ link.name }}
                  </h3>
                  <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                    {{ link.desc }}
                  </p>
                </div>

                <!-- 箭头 -->
                <div class="shrink-0">
                  <Icon name="pixelarticons:arrow-right" class="w-5 h-5 text-zinc-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          </NuxtLink>
        </template>
      </div>

      <!-- 申请友链提示 -->
      <!-- <div class="mt-8 md:mt-12 text-center">
        <div class="inline-block bg-zinc-50 dark:bg-zinc-900 rounded-lg px-6 py-4 border border-zinc-200 dark:border-zinc-800">
          <p class="text-sm md:text-base text-zinc-600 dark:text-zinc-400">
            想要交换友链？欢迎通过
            <NuxtLink to="/about" class="text-primary hover:underline">
              关于页面
            </NuxtLink>
            联系我
          </p>
        </div>
      </div> -->
    </div>
  </div>
</template>
