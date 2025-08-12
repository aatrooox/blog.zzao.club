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
                      class="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover border-2 border-gray-600"
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
                class="pixel-button pixel-button-primary"
                @click="addLink"
              >
                <span class="text-sm md:text-base">📝 提交申请</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';

.pixel-layout {
  @apply font-mono;
  background: oklch(25% 0.05 250);
  color: oklch(90% 0.02 250);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.pixel-card {
  background: oklch(30% 0.05 250);
  border: 2px solid oklch(40% 0.05 250);
  border-radius: 8px;
  box-shadow:
    2px 2px 0 oklch(40% 0.05 250),
    4px 4px 0 oklch(35% 0.05 250);
  padding: 24px;
  margin: 8px 0;
}

.pixel-card-hover {
  transition: all 0.2s ease;
}

.pixel-card-hover:hover {
  transform: translateY(-2px);
  box-shadow:
    4px 4px 0 oklch(40% 0.05 250),
    6px 6px 0 oklch(35% 0.05 250);
}

.pixel-title {
  @apply text-base md:text-lg font-bold;
  color: oklch(90% 0.02 250);
  font-family: ui-monospace, monospace;
}

.pixel-text {
  @apply text-sm md:text-base;
  color: oklch(75% 0.03 250);
  font-family: ui-monospace, monospace;
  line-height: 1.6;
}

.pixel-button {
  @apply inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg;
  border: 2px solid;
  font-family: ui-monospace, monospace;
  font-weight: bold;
  transition: all 0.2s ease;
  text-decoration: none;
}

.pixel-button-primary {
  background: oklch(70% 0.15 195);
  border-color: oklch(60% 0.15 195);
  color: oklch(20% 0.05 195);
}

.pixel-button-primary:hover {
  background: oklch(75% 0.15 195);
  transform: translateY(-1px);
  box-shadow: 2px 2px 0 oklch(60% 0.15 195);
}

.pixel-button-secondary {
  background: oklch(50% 0.05 250);
  border-color: oklch(40% 0.05 250);
  color: oklch(90% 0.02 250);
}

.pixel-button-secondary:hover {
  background: oklch(55% 0.05 250);
  transform: translateY(-1px);
  box-shadow: 2px 2px 0 oklch(40% 0.05 250);
}

.pixel-card-inner {
  background: oklch(28% 0.05 250);
  border: 2px solid oklch(35% 0.05 250);
  border-radius: 6px;
  padding: 16px;
  margin: 8px 0;
}

.pixel-textarea {
  @apply w-full h-32 md:h-40 p-3 rounded-lg;
  background: oklch(25% 0.05 250);
  border: 2px solid oklch(40% 0.05 250);
  color: oklch(90% 0.02 250);
  font-family: ui-monospace, monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.2s ease;
}

.pixel-textarea:focus {
  outline: none;
  border-color: oklch(70% 0.15 195);
  box-shadow: 0 0 0 2px oklch(70% 0.15 195 / 0.3);
}
</style>
