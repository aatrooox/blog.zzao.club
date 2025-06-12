<template>
  <div class="flex flex-col gap-4 max-w-7xl mx-auto px-4 py-4">
    <!-- 个人介绍区域 -->
    <div class="relative">
      <div
        class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-700/10 dark:from-primary-900/20 dark:to-primary-700/20 rounded-xl">
      </div>
      <div class="relative p-5 rounded-xl">
        <div class="flex flex-col md:flex-row gap-5 items-center md:items-start">
          <div class="relative">
            <div class="w-28 h-28 rounded-full overflow-hidden ring-2 ring-white dark:ring-zinc-800 shadow-lg">
              <img :src="config.avatar" alt="avatar" class="w-full h-full object-cover" />
            </div>
            <div
              class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-800">
            </div>
          </div>
          <div class="flex-1 text-center md:text-left">
            <div class="flex flex-col md:flex-row items-center md:items-baseline gap-2">
              <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{{ config.author }}</h1>
              <Button v-if="config.organization" class="text-sm text-zinc-500 dark:text-zinc-400 font-normal" as="a"
                target="_blank" :href="config.organizationUrl" variant="link">
                {{ `@${config.organization}` }}
              </Button>
              <span class="text-sm text-zinc-500 dark:text-zinc-400 font-normal">V{{ runtimeConfig.Z_BLOG_VERSION
                }}</span>
            </div>
            <p class="mt-2 text-base text-zinc-600 dark:text-zinc-400">{{ config.desciption }}</p>
            <div class="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
              <div v-for="item in config.social" :key="item.name" class="group">
                <HoverCard v-if="item.popover">
                  <HoverCardTrigger>
                    <Button variant="secondary" class="transition-all duration-200 hover:scale-105">
                      <Icon :name="item.icon" class="text-base"></Icon>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent class="w-[260px]">
                    <div class="flex flex-col gap-2 p-2">
                      <div>
                        <span class="font-medium block mb-1 text-sm">{{ item?.name }}</span>
                      </div>
                      <div>
                        <AppImg :src="item?.popover" />
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <Button v-else type="button" variant="secondary" @click="(event) => toggle(event, item)"
                  class="transition-all duration-200 hover:scale-105">
                  <Icon :name="item.icon" class="text-base"></Icon>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近文章区域 -->
    <div class="flex-1 space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          <span class="relative">
            最近文章
            <span class="absolute -bottom-0.5 left-0 w-full h-0.5 bg-primary-500"></span>
          </span>
        </h2>
        <Button as="a" variant="link" href="/article" @click="turnToPages"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
          <span>更多文章</span>
          <Icon name="icon-park-outline:right" class="ml-1"></Icon>
        </Button>
      </div>

      <div class="grid gap-2">
        <transition-group name="page-transition" appear @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
          <template v-for="page of articles" :key="page.path">
            <div class="group home-post-item">
              <div
                class="p-3 rounded-lg bg-white/50 dark:bg-zinc-800/40 group-hover:border-zinc-100 dark:border-zinc-700 hover:shadow-md hover:shadow-zinc-200 dark:hover:shadow-zinc-600 transition-all duration-200"
                @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
                <div class="flex flex-col md:flex-row md:items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <Icon name="icon-park-outline:right"
                      class="text-zinc-400 group-hover:text-primary-500 transition-all group-hover:translate-x-2 group-hover:translate-y-[-10px] page-arrow-icon">
                    </Icon>
                    <NuxtLink :to="page.path" class="flex-1 min-w-0">
                      <div
                        class="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                        {{ page.title }}
                      </div>
                      <div class="text-sm text-zinc-500 dark:text-zinc-400">
                        {{ formatDate(page.date, '/') }}
                      </div>
                    </NuxtLink>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <template v-if="page.versions">
                      <Badge v-for="v of page.versions.filter((v: any, i: number) => i < 2)" :key="v">{{ v }}</Badge>
                    </template>
                    <template v-else>
                      <Badge v-for="tag of page.tags" :key="tag">{{ tag }}</Badge>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </transition-group>
      </div>
    </div>
  </div>
</template>
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
      href: 'https://zzao.club/'
    }
  ]
})

const router = useRouter()
const route = useRoute()
const { loggedIn, user, clear } = useUserSession()
const userStore = useUserStore()
const config = useAppConfig();
const { public: runtimeConfig } = useRuntimeConfig()
const { $api } = useNuxtApp()
const curSocial = ref();
const { formatDate } = useDayjs();

console.log(`loggedIn`, loggedIn.value)
// 登录成功后，同步github信息
onMounted(async () => {
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
interface Page {
  title?: string | undefined;
  path: string;
  description: string;
  date: string;
  lastmod: string;
  tags?: string[];
  versions?: string[];
  showTitle: string;
}

// const { animateEnter, animateLeave, animateBeforeEnter } = useTransition()
// console.log(`count`, count, maxPage)
const { data: articles } = await useAsyncData('articles', () => {
  return queryCollection('content').order('date', 'DESC').limit(5).select('path', 'title', 'showTitle', 'date', 'tags', 'versions', 'lastmod').all()
})

const onEnter = (el) => {
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
          { to: 0, ease: 'outBounce', duration: 200, delay: 150 }
        ],
        opacity: '1',
        duration: 400,
        delay: (_, i) => i * 50,
        ease: 'inOutCirc',
        onComplete: () => {

        }
      })
    }
  })
}
const onBeforeEnter = (el) => {
  el.style.opacity = '0'
}

const onLeave = (el, done) => {
  animate(el, {
    scale: [1, 1.1, 1],
    opacity: '0',
    duration: 200,
    delay: 300,
    ease: 'inOut',
    onComplete: () => {
      done && done()
    }
  })
}


const onMouseEnter = (event) => {
  const el = event.target.querySelector('.page-arrow-icon')
  animate(el, {
    translateX: [
      { to: '4px', duration: 100 },
      { to: '-4px', duration: 20, ease: 'inCirc', delay: 100 },
      { to: '4px', duration: 20, ease: 'outCirc', delay: 120 },
    ],
    translateY: [
      { to: '0px', duration: 100 }
    ],
    color: 'cyan'
  })
}

const onMouseLeave = (event) => {
  const el = event.target.querySelector('.page-arrow-icon')
  animate(el, {
    translateX: [
      { to: '0px', duration: 100 },
    ],
    translateY: [
      { to: '0px', duration: 100 }
    ],
  })
}
const toggle = (event, socail: any) => {
  curSocial.value = socail;
  if (socail.url) {
    navigateTo(socail.url, { external: true, open: { target: '_blank' } })
  }
}

const turnToPages = () => {
  navigateTo('/article')
}

</script>
<style lang="less" scoped></style>