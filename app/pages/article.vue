<script lang="ts" setup>
import type { ApiResponse } from '~~/types/fetch'

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
// const { formatDate } = useDayjs()

const appConfig = useAppConfig()
const tags = computed(() => appConfig.tags.map((tag, index) => ({ name: tag, value: index })))
const route = useRoute()
const articleLikeMap = ref<Record<string, number>>({})
const articleCommentMap = ref<Record<string, number>>({})
const postViewsMap = ref<Record<string, number>>({})
const queryTag = computed(() => route.query.tag)

const selectedTags = computed(() => {
  if (queryTag.value) {
    const query_tags = queryTag.value as string
    return tags.value.filter(tag => tag.name === query_tags)[0]
  }
  else {
    return tags.value[0]
  }
})

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

async function changeTags(tag: string) {
  let tags_str = tag
  if (tags_str === '全部')
    tags_str = ''
  navigateTo({
    path: '/article',
    query: {
      ...route.query || {},
      tag: tags_str || '',
    },
  })
}

async function queryArticles(filter_tags: any) {
  let query = queryCollection('content')

  if (filter_tags) {
    query = query.where('tags', 'LIKE', `%${filter_tags}%`)
  }
  // count.value = await query.count();
  return query.order('date', 'DESC').select('id', 'path', 'title', 'showTitle', 'date', 'tags', 'description', 'versions', 'lastmod', 'meta').all()
}

const { data, status } = await useAsyncData(computed(() => `filter-tags-${filter_tags.value}`), async () => {
  return queryArticles(filter_tags.value)
}, { lazy: true })

async function selectTag(tag: { name: string, value: number } | undefined) {
  tag = tag ?? tags.value[0]
  await changeTags(tag!.name)
}

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
  selectTag(selectedTags.value)
})
</script>

<template>
  <div class="flex flex-col gap-6 max-w-7xl box-border mx-auto sm:px-4">
    <div class="flex flex-wrap gap-2 sticky py-2 px-2 top-10 z-[50] rounded-md bg-white/90 dark:bg-zinc-800/80">
      <Button
        v-for="tag in tags" :key="tag.value" :variant="selectedTags?.value === tag.value ? 'secondary' : 'link'"
        class="text-sm px-3 py-1.5 rounded-md transition-all duration-200" @click="selectTag(tag)"
      >
        {{ tag.name }}
        <span v-if="selectedTags?.value === tag.value && status !== 'pending'" class="ml-1 text-xs">({{ data?.length
          || 0 }})</span>
        <Icon v-if="selectedTags?.value === tag.value && status === 'pending'" name="svg-spinners:pulse-rings-multiple" />
      </Button>
    </div>
    <div v-if="data" class="flex flex-wrap gap-6">
      <transition-group
        tag="div" class="left-pages w-full md:flex-1 flex flex-col gap-6" appear @enter="onEnter"
        @leave="onLeave" @before-enter="onBeforeEnter"
      >
        <template v-for="page of (data as any[]).filter((_, index) => index % 2 === 0)" :key="page.path">
          <div class="group article-post-item">
            <div class="">
              <PagePanel
                :page="page" :like="articleLikeMap[page.id] || 0" :comment="articleCommentMap[page.id] || 0"
                :view="postViewsMap[page.path] || 0"
              />
            </div>
          </div>
        </template>
      </transition-group>

      <div class="right-pages w-full md:flex-1 flex flex-col gap-6">
        <transition-group appear @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
          <template v-for="page of (data as any[]).filter((_, index) => index % 2 === 1)" :key="page.path">
            <div class="group article-post-item">
              <div class="">
                <PagePanel
                  :page="page" :like="articleLikeMap[page.id] || 0" :comment="articleCommentMap[page.id] || 0"
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
