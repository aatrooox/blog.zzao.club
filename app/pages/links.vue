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
  <div class="pixel-layout min-h-screen">
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8">
      <div class="flex flex-col gap-4 md:gap-8">
        <!-- 友链网格 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <template v-for="link of links" :key="link.url">
            <NuxtLink :href="link.url" target="_blank" class="group">
              <div class="pixel-card pixel-card-hover h-full">
                <div class="flex items-start gap-3 md:gap-4">
                  <div class="relative">
                    <AppImg
                      :src="link.logo || `${link.url}/favicon.ico`"
                      :alt="link.name"
                      class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-600"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="pixel-title mb-1 md:mb-2 truncate">
                      {{ link.name }}
                    </h3>
                    <p class="pixel-text text-xs md:text-sm line-clamp-2 md:line-clamp-3">
                      {{ link.desc }}
                    </p>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </template>
        </div>

        <!-- 申请友链卡片 -->
        <div class="pixel-card">
          <h2 class="pixel-title mb-3 md:mb-4 flex items-center gap-2">
            <div class="pixel-indicator pixel-indicator-secondary" />
            申请友链
          </h2>
          <p class="pixel-text mb-3 md:mb-4">
            如果你也想与我交换友链，请按照以下格式填写后提交：
          </p>
          <div class="pixel-card-inner">
            <Textarea
              v-model="newLink"
              class="pixel-textarea"
            />
            <div class="mt-3 md:mt-4">
              <button
                class="pixel-btn pixel-button-primary"
                @click="addLink"
              >
                <span class="text-sm md:text-base">提交申请</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
