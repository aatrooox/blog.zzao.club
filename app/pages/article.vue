<script lang="ts" setup>
import type { ApiResponse } from '~~/types/fetch'
import type { Page } from '~/components/common/PagePanel.vue'

useHead({
  title: '文章｜早早集市',
  meta: [
    {
      name: 'description',
      content: '全部文章入口，包含Nuxt/NuxtContent最新教程,HonoJS实战教程，Vue3教程',
    },
  ],
})

const { $api } = useNuxtApp()
const route = useRoute()
const articleLikeMap = ref<Record<string, number>>({})
const articleCommentMap = ref<Record<string, number>>({})
const postViewsMap = ref<Record<string, number>>({})
const queryTag = computed(() => route.query.tag)

function onEnter(el) {
  animate(el, {
    opacity: [
      { to: '1', delay: 100, duration: 100 },
    ],
    filter: [
      { to: 'blur(0px)', delay: 200, duration: 100 },
    ],
    duration: 200,
    // delay: 200,
    ease: 'inOut',
  })
}
function onBeforeEnter(el) {
  el.style.opacity = '0'
  animate(el, {
    filter: 'blur(5px)',
    duration: 100,
    ease: 'inOutCirc',
  })
}

function onLeave(el, done: () => void) {
  animate(el, {
    scale: [1, 1.1, 1],
    opacity: '0',
    duration: 200,
    delay: 300,
    ease: 'inOut',
    onComplete: () => {
      if (done) {
        done()
      }
    },
  })
}
const filter_tags = computed(() => {
  if (queryTag.value) {
    const query_tags = queryTag.value as string

    return query_tags
  }
  else {
    return null
  }
})

const { data, pending: _pending, refresh: _refresh, error: _error } = await usePages({ filter_tags: filter_tags.value })

async function queryArticleInteractivity() {
  const res = await $api.get<ApiResponse<Record<string, number>>>('/api/v1/like/list')

  if (res.data) {
    articleLikeMap.value = res.data
  }
}

async function queryArticleCommentStat() {
  const res = await $api.get<ApiResponse<Record<string, number>>>('/api/v1/comment/stat/list')

  if (res.data) {
    articleCommentMap.value = res.data
  }
}

async function queryPageviews() {
  const res = await $api.get<ApiResponse<Record<string, number>>>('/api/v1/fsf/pull/umami/stats/ede2b0ce-e029-41f7-9d56-be35fc07ba6c')

  if (res.data) {
    postViewsMap.value = res.data
  }
}

onMounted(() => {
  queryArticleInteractivity()
  queryArticleCommentStat()
  queryPageviews()
  // selectTag(selectedTags.value)
})
</script>

<template>
  <div class="pixel-layout min-h-screen">
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8">
      <div v-if="data" class="flex flex-col gap-4 md:gap-6">
        <transition-group
          tag="div" class="w-full flex flex-col gap-3 md:gap-4" appear @enter="onEnter"
          @leave="onLeave" @before-enter="onBeforeEnter"
        >
          <template v-for="page of data" :key="page.path">
            <div class="group article-post-item">
              <div>
                <PagePanel
                  :page="page as Page" :like="articleLikeMap[page.id] || 0" :comment="articleCommentMap[page.id] || 0"
                  :view="postViewsMap[page.path] || 0"
                />
              </div>
            </div>
          </template>
        </transition-group>
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
  padding: 16px;
  margin: 8px 0;
  transition: all 0.2s ease;
}

.pixel-card-hover:hover {
  background: oklch(35% 0.05 250);
  transform: translateY(-2px);
  box-shadow:
    3px 3px 0 oklch(40% 0.05 250),
    6px 6px 0 oklch(35% 0.05 250),
    9px 9px 0 oklch(30% 0.05 250);
}

.article-post-item {
  transition: all 0.2s ease;
}
</style>
