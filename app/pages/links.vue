<script lang="ts" setup>
const { $api } = useNuxtApp()
const toast = useGlobalToast()

useHead({
  title: '友链｜早早集市',
  meta: [
    {
      name: 'description',
      content: '早早集市友情链接，点击和我互换友链吧',
    },
  ],
})

const { links } = useAppConfig()

const newLink = ref(JSON.stringify({
  name: '网站名称',
  url: 'https://www.example.com',
  desc: '网站描述',
}, null, 2))

async function addLink() {
  console.log(newLink.value)
  let propsObj: any
  try {
    // 先尝试直接解析\
    propsObj = JSON.parse(newLink.value)
  }
  catch {
    try {
      // 如果直接解析失败，尝试处理格式
      const jsonStr = newLink.value
        .replace(/(['"])?(\w+)(['"])?:/g, '"$2":') // 只处理键名部分
        .replace(/'/g, '"') // 将单引号替换为双引号

      propsObj = JSON.parse(jsonStr)
    }
    catch (e) {
      console.error('转换失败', e)
      return
    }
  }

  console.log(propsObj)
  const res = await $api.post('/api/v1/link/add', propsObj)
  await $api.post('/api/v1/fsf/push/mail/send', {
    name: '测试人员',
    text: '你好，我试试邮件\n 可以么？\n 测试一下',
    to: 'gnakzz@qq.com',
  })

  if (res.error) {
    // toast.add({ type: 'warning', message: res.error.message ?? '提交失败，请检查格式'})
  }
  else {
    toast.add({ type: 'success', message: '提交成功' })
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col gap-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          友情链接
        </h1>
        <p class="text-zinc-600 dark:text-zinc-400">
          欢迎与我交换友链，一起分享技术
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-for="link of links" :key="link.url">
          <NuxtLink :href="link.url" target="_blank" class="group">
            <div
              class="h-full p-4 rounded-lg bg-white group dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:shadow-lg hover:shadow-zinc-200 dark:hover:shadow-zinc-900 transition-all duration-200"
            >
              <div class="flex items-start gap-4">
                <div class="relative">
                  <UserAvatar
                    :preview-url="link.logo ?? `${link.url}/favicon.ico`" alt="LOGO" size="large"
                    class="w-16 h-16 rounded-lg group-hover:scale-120 transition-all delay-200"
                  />
                  <div
                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-800"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    class="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                  >
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
        <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          申请友链
        </h2>
        <p class="text-zinc-600 dark:text-zinc-400 mb-4">
          如果你也想与我交换友链，请按照以下格式填写后提交：
        </p>
        <div class="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md">
          <Textarea
            v-model="newLink"
            class="w-full h-40 p-2 rounded-md border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-all duration-200"
          />
          <Button variant="outline" @click="addLink">
            提交
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
