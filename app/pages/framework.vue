<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col gap-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">技术栈</h1>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-for="link of links" :key="link.url">
          <NuxtLink :href="link.url" target="_blank" class="group">
            <div
              class="h-full p-4 rounded-lg bg-white group dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:shadow-lg hover:shadow-zinc-200 dark:hover:shadow-zinc-900 transition-all duration-200">
              <div class="flex items-start gap-4">
                <div class="relative">
                  <UserAvatar :previewUrl="link.logo ?? link.url + '/favicon.ico'" alt="LOGO" size="large"
                    class="w-16 h-16 rounded-lg group-hover:scale-120 transition-all delay-200"></UserAvatar>
                  <div
                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-800">
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    class="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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

    </div>
  </div>
</template>
<script lang="ts" setup>
const { $api } = useNuxtApp();
const toast = useGlobalToast()

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

const { links } = useAppConfig()

const newLink = ref(JSON.stringify({
  name: '网站名称',
  url: 'https://www.example.com',
  desc: '网站描述'
}, null, 2))

const addLink = async () => {
  console.log(newLink.value)
  let propsObj: any;
  try {
    // 先尝试直接解析\
    propsObj = JSON.parse(newLink.value)
  } catch (e) {
    try {
      // 如果直接解析失败，尝试处理格式
      const jsonStr = newLink.value
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // 只处理键名部分
        .replace(/'/g, '"') // 将单引号替换为双引号

      propsObj = JSON.parse(jsonStr)
    } catch (e) {

      console.error('转换失败', e)
      return
    }
  }

  console.log(propsObj)
  const res = await $api.post('/api/v1/link/add', propsObj)

  if (res.error) {
    // toast.add({ type: 'warning', message: res.error.message ?? '提交失败，请检查格式'})
  } else {
    toast.add({ type: 'success', message: '提交成功' })
  }
}
</script>