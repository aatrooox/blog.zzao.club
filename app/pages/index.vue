<script lang="ts" setup>
useHead({
  title: '早早集市｜博客站',
  meta: [
    {
      name: 'description',
      content: '最新最全的Nuxt4全栈开发实战内容，提供免费的Nuxt4权威课程，高质量Nuxt中文交流群',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://zzao.club/',
    },
  ],
})

const router = useRouter()
const route = useRoute()
const { loggedIn, user } = useUserSession()
const userStore = useUser()
// const appConfig = useAppConfig()
const { $api } = useNuxtApp()

// 获取动态数据（仅在客户端加载，避免 SSR 首屏水合问题）
const { getMemos, memos, status } = useMemos()
onMounted(() => {
  getMemos()
})

// 登录成功后，同步github信息
watchEffect(async () => {
  if (loggedIn.value && route.query.login === 'github' && route.query.status === 'success') {
    const { data, error } = await $api.post('/api/v1/auth/connect/github', {
      id: user.value?.id,
      avatar_url: user.value?.avatar_url,
      email: user.value?.email,
      login: user.value?.login,
    })

    if (!error) {
      userStore.setUser(data.user)
      userStore.setToken(data.token)
    }

    router.replace('/')
  }
})

const { data: articles } = await usePages({ limit: 10 })

// 混合列表逻辑
const mixedList = computed(() => {
  const items: any[] = []

  // 1. Articles
  if (articles.value) {
    articles.value.forEach((article: any) => {
      items.push({
        type: 'article',
        id: `article-${article.path}`,
        date: article.date ? new Date(article.date).getTime() : 0,
        data: article,
      })
    })
  }

  // 2. Memos
  if (memos.value) {
    memos.value.forEach((memo: any) => {
      items.push({
        type: 'memo',
        id: `memo-${memo.id}`,
        date: new Date(memo.createTs).getTime(),
        data: memo,
      })
    })
  }

  // 按时间倒序排序
  items.sort((a, b) => b.date - a.date)

  return items
})

// 动画相关
function onEnter(el: any) {
  // 简单的淡入动画，如果 animate 全局可用
  if (typeof animate !== 'undefined') {
    animate(el, {
      opacity: ['0', '1'],
      translateY: ['20px', '0'],
      duration: 400,
      easing: 'easeOutQuad',
    })
  }
  else {
    // Fallback
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  }
}
</script>

<template>
  <div class="font-sans max-w-3xl mx-auto">
    <div class="space-y-4">
      <transition-group name="list" tag="div" class="space-y-4" @enter="onEnter">
        <template v-for="item in mixedList" :key="item.id">
          <!-- Article Item -->
          <NuxtLink
            v-if="item.type === 'article'"
            :to="item.data.path"
            class="block group"
          >
            <div class="bg-gray-50 dark:bg-zinc-900 p-2 transition-all duration-300 border border-transparent">
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-3 min-w-0">
                  <Icon name="pixelarticons:article" class="text-zinc-400 shrink-0" />
                  <h3 class="text-base font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-primary transition-colors truncate">
                    {{ item.data.title }}
                  </h3>
                </div>
                <div class="flex gap-2 shrink-0">
                  <template v-if="item.data.tags">
                    <span v-for="tag in item.data.tags.slice(0, 2)" :key="tag" class="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-md">
                      #{{ tag }}
                    </span>
                  </template>
                </div>
              </div>
            </div>
          </NuxtLink>

          <!-- Memo Item -->
          <div
            v-else-if="item.type === 'memo'"
            class="bg-primary/5 dark:bg-zinc-900 p-5 transition-all duration-300 border border-transparent cursor-pointer group"
            @click="navigateTo(`/m/${item.data.id}`)"
          >
            <div class="flex gap-4 justify-between">
              <!-- 左侧：信息 + 内容 -->
              <div class="flex-1 min-w-0 flex flex-col">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="pixelarticons:radio-signal" class="text-primary text-xs" />
                  <span class="text-xs text-zinc-400">动态</span>
                  <NuxtTime :datetime="item.data.createTs" class="text-xs text-zinc-400" />
                  <AppFromTag :from="item.data.from || 'blog'" />
                </div>
                <div class="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                  {{ item.data.content }}
                </div>
              </div>

              <!-- 右侧：图片 (最多3张) -->
              <div v-if="item.data.photos && item.data.photos.length > 0" class="shrink-0 flex gap-2">
                <template v-for="res in item.data.photos.slice(0, 3)" :key="res.id">
                  <NuxtImg
                    :src="res"
                    class="w-20 h-20 object-cover rounded-lg bg-zinc-200 dark:bg-zinc-800"
                    loading="lazy"
                  />
                </template>
              </div>
            </div>
          </div>
        </template>
      </transition-group>

      <!-- 加载更多/底部提示 -->
      <div class="text-center py-8 text-zinc-400 text-sm">
        <span v-if="status === 'pending'">加载中...</span>
        <span v-else>不是写不出来，是待发布！</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 列表过渡动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
