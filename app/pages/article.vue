<template>
  <div class="flex flex-col gap-6 max-w-7xl box-border mx-auto sm:px-4">
    <div class="flex flex-wrap gap-2 sticky py-2 px-2 top-10 rounded-md bg-white/90 dark:bg-zinc-800/80">
      <Button v-for="tag in tags" :key="tag.value" :variant="selectedTags?.value === tag.value ? 'secondary' : 'link'"
        :class="[
          'text-sm px-3 py-1.5 rounded-md transition-all duration-200',
        ]" @click="selectTag(tag)">
        {{ tag.name }}
        <span v-if="selectedTags?.value === tag.value && status !== 'pending'" class="ml-1 text-xs">({{ data?.length ||
          0 }})</span>
        <Icon name="svg-spinners:pulse-rings-multiple" v-if="selectedTags?.value === tag.value && status === 'pending'">
        </Icon>
      </Button>
    </div>
    <div class="flex flex-wrap gap-6" v-if="data">
      <transition-group tag="div" class="left-pages w-full md:flex-1 flex flex-col gap-6">
        <template v-for="page of (data as any[]).filter((_, index) => index % 2 === 0)" :key="page.path">
          <div class="group">
            <div class="article-post-item">
              <PagePanel :page="page" :like="articleLikeMap[page.id] || 0" :comment="articleCommentMap[page.id] || 0">
              </PagePanel>
            </div>
          </div>
        </template>
      </transition-group>

      <div class="right-pages w-full md:flex-1 flex flex-col gap-6">
        <template v-for="page of (data as any[]).filter((_, index) => index % 2 === 1)" :key="page.path">
          <div class="group">
            <div class="article-post-item">
              <PagePanel :page="page" :like="articleLikeMap[page.id] || 0" :comment="articleCommentMap[page.id] || 0">
              </PagePanel>
            </div>
          </div>
        </template>
      </div>

    </div>
  </div>
</template>
<script lang="ts" setup>
useHead({
  title: '文章｜早早集市',
  meta: [
    {
      name: 'description',
      content: '早早集市｜博客站｜前端｜全栈｜前端架构｜Node｜Nuxt｜Hono｜Bun|副业',
    },
    {
      name: 'keywords',
      content: '早早集市,博客站,NuxtContent,Content,Obsidian,Vue,Vue3,Vue2,Node,前端,前端工程化,前端架构,Node,Nuxt3,Hono,爬虫,副业,生活感悟',
    },
  ],
})

const { $api } = useNuxtApp();
const { formatDate } = useDayjs();

const appConfig = useAppConfig();
const tags = computed(() => appConfig.tags.map((tag, index) => ({ name: tag, value: index })))
const route = useRoute();
const articleLikeMap = ref<Record<string, number>>({})
const articleCommentMap = ref<Record<string, number>>({})
const queryTag = computed(() => route.query.tag)

const selectedTags = computed(() => {
  if (queryTag.value) {
    const query_tags = queryTag.value as string
    return tags.value.filter(tag => tag.name === query_tags)[0]
  } else {
    return tags.value[0]
  }
})

const filter_tags = computed(() => {
  if (queryTag.value) {
    const query_tags = queryTag.value as string

    return query_tags
  } else {
    return null
  }
})

const changeTags = async (tag: string) => {
  let tags_str = tag
  if (tags_str === '全部') tags_str = ''
  navigateTo({
    path: '/article',
    query: {
      ...route.query || {},
      tag: tags_str || '',
    }
  })
}


const queryArticles = async (filter_tags: any) => {
  let query = queryCollection('content')

  if (filter_tags) {
    query = query.where('tags', 'LIKE', `%${filter_tags}%`)
  }
  // count.value = await query.count();
  return query.order('date', 'DESC').select('id', 'path', 'title', 'showTitle', 'date', 'tags', 'description', 'versions', 'lastmod', 'meta').all()
}

const { data, status, refresh } = await useAsyncData(computed(() => `filter-tags-${filter_tags.value}`), async () => {
  return queryArticles(filter_tags.value)
}, { lazy: true })

const selectTag = async (tag: { name: string, value: number } | undefined) => {
  tag = tag ?? tags.value[0]
  await changeTags(tag!.name);
}

const queryArticleInteractivity = async () => {
  const res = await $api.get<Record<string, number>>('/api/v1/like/list')

  if (res.data) {
    articleLikeMap.value = res.data
  }
}

const queryArticleCommentStat = async () => {
  const res = await $api.get<Record<string, number>>('/api/v1/comment/stat/list')

  if (res.data) {
    articleCommentMap.value = res.data
  }

}
onMounted(() => {
  queryArticleInteractivity();
  queryArticleCommentStat();

  selectTag(selectedTags.value)
})

</script>