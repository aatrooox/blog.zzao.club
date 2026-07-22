<script setup lang="ts">
/**
 * 全站统一顶区（对标 geedea：LOGO + 导航始终在）
 *
 * variant 只影响「导航下方」的扩展区，不改变顶栏结构：
 * - home: 简介 + 热门标签（不重复下方「最新文章」列表）
 * - article: 分类标签按钮
 * - links: 友链申请提示
 * - minimal: 无扩展（文章详情）
 */
const props = withDefaults(defineProps<{
  variant?: 'home' | 'article' | 'links' | 'minimal' | 'page'
  /** page 变体备用标题 */
  title?: string
  description?: string
  hotTags?: Array<{ name: string, count: number }>
  /** article 页：可点筛选的标签 */
  categoryTags?: string[]
  /** article 页：当前筛选 */
  activeTags?: string[]
}>(), {
  variant: 'minimal',
  title: '',
  description: '',
  hotTags: () => [],
  categoryTags: () => [],
  activeTags: () => [],
})

const emit = defineEmits<{
  toggleTag: [tag: string]
}>()

const route = useRoute()
const appConfig = useAppConfig()
const { navItems } = useAppNavigation()

const siteName = computed(() => appConfig.author || '早早集市')
const siteNote = computed(() => appConfig.desciption || '人生游戏 DLC')
const socialItems = computed(() => appConfig.social || [])

/** 高频 top5（带篇数） */
const topTagItems = computed(() => {
  if (props.hotTags?.length)
    return props.hotTags.slice(0, 5)
  const fromConfig = (appConfig as any).topTagItems as Array<{ name: string, count: number }> | undefined
  if (fromConfig?.length)
    return fromConfig.slice(0, 5)
  return (appConfig.tags || [])
    .filter((t: string) => t !== '全部')
    .slice(0, 5)
    .map((name: string) => ({ name, count: 0 }))
})

const categoryList = computed(() => {
  if (props.categoryTags?.length)
    return props.categoryTags.slice(0, 5)
  return topTagItems.value.map(t => t.name)
})

const homeTags = computed(() => topTagItems.value)

function isNavActive(path: string) {
  if (path === '/')
    return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

function isTagActive(tag: string) {
  return props.activeTags?.includes(tag)
}

/**
 * 导航滑块
 * SiteHeader 挂在各 page 内，切页会卸载重建；不能靠组件内状态做「从哪滑来」。
 * 用 useState 跨页面记住上一帧几何，挂载时先落到旧位置再滑到新项。
 * 不需要 GSAP——问题是实例生命周期，不是动画能力。
 */
const navRef = ref<HTMLElement | null>(null)
const linkEls = ref<(HTMLElement | null)[]>([])
const sliderReady = ref(false)
const sliderCanAnimate = ref(false)
const sliderStyle = ref({
  width: '0px',
  transform: 'translateX(0px)',
})

/** 跨页面持久的滑块几何（SPA 导航存活） */
const savedSlider = useState('site-nav-slider', () => ({
  width: 0,
  x: 0,
  ready: false,
}))

function setLinkEl(el: any, index: number) {
  // NuxtLink 为组件实例，取 $el；原生元素则直接使用
  linkEls.value[index] = (el?.$el ?? el ?? null) as HTMLElement | null
}

function measureActiveNav() {
  const activeIndex = navItems.findIndex(nav => isNavActive(nav.path))
  const el = linkEls.value[activeIndex]
  if (!el || activeIndex < 0)
    return null
  return {
    width: el.offsetWidth,
    x: el.offsetLeft,
  }
}

function applySlider(pos: { width: number, x: number }, persist = true) {
  sliderStyle.value = {
    width: `${pos.width}px`,
    transform: `translateX(${pos.x}px)`,
  }
  sliderReady.value = true
  if (persist) {
    savedSlider.value = {
      width: pos.width,
      x: pos.x,
      ready: true,
    }
  }
}

/** 直接落到当前项（无动画） */
function snapNavSlider() {
  const pos = measureActiveNav()
  if (!pos) {
    sliderReady.value = false
    return
  }
  sliderCanAnimate.value = false
  applySlider(pos)
}

/**
 * 从 useState 中的旧位置滑到当前项。
 * 双 rAF：先无 transition 写旧值，再开 transition 写新值，避免被合并成一帧。
 */
function slideNavSliderFromSaved() {
  const pos = measureActiveNav()
  if (!pos) {
    sliderReady.value = false
    return
  }

  if (!savedSlider.value.ready) {
    sliderCanAnimate.value = false
    applySlider(pos)
    // 下一帧起允许动画（同实例内路由变化、resize 后）
    requestAnimationFrame(() => {
      sliderCanAnimate.value = true
    })
    return
  }

  const from = {
    width: savedSlider.value.width,
    x: savedSlider.value.x,
  }

  // 已在同一位置：无需动画
  if (from.width === pos.width && from.x === pos.x) {
    sliderCanAnimate.value = true
    applySlider(pos)
    return
  }

  sliderCanAnimate.value = false
  applySlider(from, false)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      sliderCanAnimate.value = true
      applySlider(pos)
    })
  })
}

watch(() => route.path, async () => {
  await nextTick()
  // 同实例内切路由（少见，但保留）：直接过渡
  const pos = measureActiveNav()
  if (!pos) {
    sliderReady.value = false
    return
  }
  sliderCanAnimate.value = true
  applySlider(pos)
})

onMounted(() => {
  nextTick(() => {
    slideNavSliderFromSaved()
  })
  window.addEventListener('resize', snapNavSlider)
})

onUnmounted(() => {
  window.removeEventListener('resize', snapNavSlider)
})
</script>

<template>
  <header class="site-content mb-8 md:mb-10">
    <!-- ========== 固定层：LOGO + 社交 + 导航（全站一致） ========== -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <NuxtLink
        to="/"
        class="group inline-flex items-center gap-3.5 shrink-0"
      >
        <AppLogo :size="50" class="transition-opacity group-hover:opacity-80" />
        <span class="text-2xl font-black tracking-tight text-[var(--article-text)] group-hover:text-primary transition-colors">
          {{ siteName }}
        </span>
      </NuxtLink>

      <div class="font-sans flex items-center gap-0.5 sm:gap-1 self-start sm:self-auto">
        <template v-for="item in socialItems" :key="item.name">
          <div v-if="item.popover" class="relative group">
            <button
              type="button"
              class="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
              :title="item.name"
            >
              <Icon :name="item.icon" class="w-5 h-5" />
            </button>
            <div class="absolute right-0 top-full mt-2 hidden group-hover:block z-50 w-44">
              <div class="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 p-2">
                <div class="text-xs text-zinc-500 text-center mb-1.5">
                  {{ item.name }}
                </div>
                <NuxtImg
                  :src="item.popover"
                  :alt="item.name"
                  width="160"
                  height="160"
                  class="w-40 h-40 rounded object-cover"
                />
              </div>
            </div>
          </div>
          <NuxtLink
            v-else-if="item.url"
            :to="item.url"
            external
            target="_blank"
            class="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/5 transition-colors"
            :title="item.name"
          >
            <Icon :name="item.icon" class="w-5 h-5" />
          </NuxtLink>
        </template>
      </div>
    </div>

    <!-- 导航条：无边框无圆角，方形滑块跟随选中项 -->
    <nav
      ref="navRef"
      class="font-sans mt-5 relative inline-flex items-stretch"
      aria-label="主导航"
    >
      <span
        v-show="sliderReady"
        class="absolute inset-y-0 left-0 bg-zinc-200/90 dark:bg-zinc-800 pointer-events-none"
        :class="sliderCanAnimate ? 'transition-[transform,width] duration-300 ease-out' : ''"
        :style="sliderStyle"
        aria-hidden="true"
      />
      <NuxtLink
        v-for="(nav, index) in navItems"
        :key="nav.path"
        :ref="(el) => setLinkEl(el, index)"
        :to="nav.path"
        class="relative z-10 px-4 py-1.5 text-sm whitespace-nowrap transition-colors"
        :class="isNavActive(nav.path)
          ? 'text-primary font-medium'
          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'"
      >
        {{ nav.name }}
      </NuxtLink>
    </nav>

    <!-- ========== 扩展层：按页面变化 ========== -->

    <!-- 首页：简介 + 热门标签 -->
    <div v-if="variant === 'home'" class="mt-6 space-y-4">
      <p class="text-sm text-[var(--article-muted)] leading-relaxed max-w-lg">
        {{ siteNote }}
      </p>

      <div v-if="homeTags.length" class="font-sans flex flex-wrap items-center gap-2">
        <NuxtLink
          v-for="tag in homeTags"
          :key="tag.name"
          :to="`/article?tag=${encodeURIComponent(tag.name)}`"
          class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <span>#{{ tag.name }}</span>
          <span v-if="tag.count > 0" class="tabular-nums text-[10px] text-zinc-400">{{ tag.count }}</span>
        </NuxtLink>
        <NuxtLink
          to="/tags"
          class="inline-flex items-center gap-0.5 text-xs px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-primary/30 hover:text-primary transition-colors"
        >
          更多
          <Icon name="lucide:arrow-right" class="w-3 h-3" />
        </NuxtLink>
      </div>
    </div>

    <!-- 文章列表：分类按钮（高频 top5 + 更多） -->
    <div v-else-if="variant === 'article'" class="mt-6">
      <div class="font-sans flex flex-wrap gap-2">
        <NuxtLink
          to="/article"
          class="text-xs px-3 py-1.5 rounded-full border transition-colors"
          :class="!activeTags?.length && !$route.query.untagged
            ? 'border-primary/30 bg-primary/10 text-primary font-medium'
            : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-primary/30 hover:text-primary'"
        >
          全部
        </NuxtLink>
        <button
          v-for="tag in categoryList"
          :key="tag"
          type="button"
          class="text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer"
          :class="isTagActive(tag)
            ? 'border-primary/30 bg-primary/10 text-primary font-medium'
            : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-primary/30 hover:text-primary'"
          @click="emit('toggleTag', tag)"
        >
          #{{ tag }}
        </button>
        <NuxtLink
          to="/tags"
          class="text-xs px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-primary/30 hover:text-primary transition-colors inline-flex items-center gap-0.5"
        >
          更多
          <Icon name="lucide:arrow-right" class="w-3 h-3" />
        </NuxtLink>
      </div>
    </div>

    <!-- 友链：申请提示 -->
    <div
      v-else-if="variant === 'links'"
      class="mt-6 font-sans rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 px-4 py-3 text-sm text-[var(--article-muted)] leading-relaxed"
    >
      <p>
        想交换友链？通过社交方式联系我即可。
        建议提供：站点名称、链接、一句话简介、头像/favicon。
      </p>
    </div>

    <!-- 通用 page：轻标题 -->
    <div v-else-if="variant === 'page' && (title || description)" class="mt-6">
      <h1 v-if="title" class="text-2xl font-bold tracking-tight text-[var(--article-text)]">
        {{ title }}
      </h1>
      <p v-if="description" class="mt-1.5 text-sm text-[var(--article-muted)]">
        {{ description }}
      </p>
    </div>

    <!-- minimal：仅固定层，无扩展 -->
  </header>
</template>
