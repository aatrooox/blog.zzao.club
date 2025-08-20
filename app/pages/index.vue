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
// const config = useAppConfig()
// const { public: runtimeConfig } = useRuntimeConfig()
const { $api } = useNuxtApp()
// const curSocial = ref()
// const { formatDate } = useDayjs()

// 获取动态数据
const { getMemos, memos } = useMemos()
await getMemos()

// 获取最近7条动态
const recentMemos = computed(() => memos.value.slice(0, 7))

console.log(`loggedIn`, loggedIn.value)
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

const { data: articles } = await usePages({ limit: 5 })

function onEnter(el) {
  animate(el, {
    opacity: '1',
    duration: 100,
    delay: 200,
    ease: 'inOut',
    onComplete: () => {
      animate('.home-post-item', {
        // scale: [0.5, 1, 1.5, 1],
        x: [
          { to: '20px', ease: 'outExpo', duration: 200 },
          { to: 0, ease: 'outBounce', duration: 200, delay: 150 },
        ],
        opacity: '1',
        duration: 400,
        delay: (_, i) => i * 50,
        ease: 'inOutCirc',
        onComplete: () => {

        },
      })
    },
  })
}
function onBeforeEnter(el) {
  el.style.opacity = '0'
}

function onLeave(el, done) {
  animate(el, {
    scale: [1, 1.1, 1],
    opacity: '0',
    duration: 200,
    delay: 300,
    ease: 'inOut',
    onComplete: () => {
      done && done()
    },
  })
}

function onMouseEnter(event) {
  const el = event.target.querySelector('.page-arrow-icon')
  animate(el, {
    translateX: [
      { to: '4px', duration: 100 },
      { to: '-4px', duration: 20, ease: 'inCirc', delay: 100 },
      { to: '4px', duration: 20, ease: 'outCirc', delay: 120 },
    ],
    // translateY: [
    //   { to: '0px', duration: 100 },
    // ],
    color: 'cyan',
  })
}

function onMouseLeave(event) {
  const el = event.target.querySelector('.page-arrow-icon')
  animate(el, {
    translateX: [
      { to: '0px', duration: 100 },
    ],
    // translateY: [
    //   { to: '0px', duration: 100 },
    // ],
  })
}
// function toggle(event, socail: any) {
//   curSocial.value = socail
//   if (socail.url) {
//     navigateTo(socail.url, { external: true, open: { target: '_blank' } })
//   }
// }

// function turnToPages() {
//   navigateTo('/article')
// }
</script>

<template>
  <div class="space-y-8 pixel-font">
    <!-- 最近动态区域 -->
    <div v-if="recentMemos.length > 0" class="space-y-6">
      <div class="flex items-center justify-between pr-2">
        <h2 class="text-xl md:text-3xl pixel-title flex items-center gap-3">
          <Icon class="ss" name="pixelarticons:radio-signal" size="1em" />
          最近动态
        </h2>
        <NuxtLink
          to="/memo"
          class="pixel-btn cursor-pointer flex items-center gap-2"
        >
          <span class="text-sm md:text-base">更多动态</span>
          <Icon name="icon-park-outline:right" class="text-sm md:text-base" />
        </NuxtLink>
      </div>

      <!-- 横向滚动动态卡片 -->
      <div class="overflow-x-auto pb-4">
        <div class="flex gap-6 p-4 w-max">
          <div
            v-for="memo in recentMemos"
            :key="memo.id"
            class="pixel-card cursor-pointer flex-shrink-0 relative"
            style="width: 300px; height: 400px"
          >
            <div class="absolute right-2 top-2 z-10 cursor-pointer" @click="navigateTo(`/m/${memo.id}`)">
              <Icon class="hover:text-highlight-pixel-cyan" name="pixelarticons:open" size="1em" />
            </div>
            <div class="flex flex-col h-full">
              <!-- 标签 -->
              <div v-if="memo.tags && memo.tags.length > 0" class="mb-3">
                <div class="flex gap-2 flex-wrap">
                  <span
                    v-for="tagRelation in memo.tags.slice(0, 2)"
                    :key="tagRelation.id"
                    class="text-highlight-pixel-cyan text-xs"
                  >
                    #{{ tagRelation.tagName }}
                  </span>
                </div>
              </div>

              <!-- 动态内容 -->
              <div class="flex-1 overflow-hidden">
                <div class="text-sm pixel-text leading-relaxed" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                  <MemoPanel :memo="memo" layout="xiaohongshu" display-mode="photos-only" />
                </div>
              </div>

              <!-- 底部时间 -->
              <div class="flex justify-end mt-2">
                <NuxtTime :datetime="memo.createTs" class="text-xs pixel-text-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近文章区域 -->
    <div class="flex-1 space-y-6">
      <div class="flex items-center justify-between pr-2">
        <h2 class="text-xl md:text-3xl pixel-title flex items-center gap-3">
          <Icon class="ss" name="pixelarticons:radio-signal" size="1em" />
          最近文章
        </h2>
        <NuxtLink
          to="/article"
          class="pixel-btn cursor-pointer flex items-center gap-2"
        >
          <span class="text-sm md:text-base">更多文章</span>
          <Icon name="icon-park-outline:right" class="text-sm md:text-base" />
        </NuxtLink>
      </div>

      <div class="space-y-4">
        <transition-group name="page-transition" appear @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
          <template v-for="page of articles" :key="page.path">
            <div class="group home-post-item">
              <NuxtLink :to="page.path" class="block">
                <div
                  class="pixel-card-elevated"
                  @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"
                >
                  <div class="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <div class="flex items-center gap-3 md:gap-4 flex-1">
                      <Icon class="ss" name="pixelarticons:open" size="1em" />
                      <div class="text-base pixel-title group-hover:text-cyan-400 transition-colors leading-tight">
                        {{ page.title }}
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <template v-if="page.versions">
                        <div v-for="v of page.versions.filter((v: any, i: number) => i < 2)" :key="v" class="text-xs pixel-btn">
                          {{ v }}
                        </div>
                      </template>
                      <template v-else>
                        <div v-for="tag of page.tags" :key="tag" class="text-xs pixel-tag">
                          {{ tag }}
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </template>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
