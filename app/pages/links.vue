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
  <div class="flex flex-col gap-4 md:gap-8 max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8 bg-bg-paper font-cartoon">
    <div class="flex flex-col gap-4 md:gap-8">
      <!-- 友链网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <template v-for="link of links" :key="link.url">
          <NuxtLink :href="link.url" target="_blank" class="group">
            <div
              class="h-full p-4 md:p-6 rounded-lg md:rounded-xl bg-white border-2 md:border-4 border-bg-base shadow-pixel hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 hover:scale-[1.02]"
            >
              <div class="flex items-start gap-3 md:gap-4">
                <div class="relative">
                  <UserAvatar
                    :preview-url="link.logo ?? `${link.url}/favicon.ico`" alt="LOGO" size="large"
                    class="w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 border-bg-base group-hover:scale-110 transition-all duration-200"
                  />
                  <div
                    class="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-accent-400 rounded-full border-2 border-white"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    class="font-cartoon font-bold text-sm md:text-lg text-bg-base group-hover:text-primary-600 transition-colors"
                  >
                    {{ link.name }}
                  </div>
                  <div class="text-xs md:text-sm font-cartoon text-gray-600 mt-1 line-clamp-2">
                    {{ link.desc }}
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </template>
      </div>

      <!-- 申请友链卡片 -->
      <div class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-4 md:p-6">
        <h2 class="text-base md:text-lg font-pixel text-bg-base mb-3 md:mb-4 flex items-center gap-2">
          <div class="w-2 h-2 bg-secondary-500 rounded-sm" />
          申请友链
        </h2>
        <p class="text-sm md:text-base font-cartoon text-gray-600 mb-3 md:mb-4">
          如果你也想与我交换友链，请按照以下格式填写后提交：
        </p>
        <div class="bg-bg-paper p-3 md:p-4 rounded-lg border-2 border-gray-200">
          <Textarea
            v-model="newLink"
            class="w-full h-32 md:h-40 p-3 rounded-lg border-2 border-bg-base font-cartoon text-sm md:text-base focus:outline-none focus:border-primary-600 transition-all duration-200 bg-white"
          />
          <div class="mt-3 md:mt-4">
            <button
              class="bg-primary-600 hover:bg-secondary-500 text-white font-cartoon font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 md:border-4 border-bg-base shadow-pixel hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 hover:scale-105"
              @click="addLink"
            >
              <span class="text-sm md:text-base">提交申请</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
