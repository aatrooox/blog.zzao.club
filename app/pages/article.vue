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
      <div class="left-pages w-full md:flex-1 flex flex-col gap-6">
        <template v-for="page of (data as any[]).filter((_, index) => index % 2 === 0)" :key="page.path">
          <div class="group">
            <div
              class="box-border transition-all duration-200 rounded-lg bg-white dark:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-200 dark:hover:shadow-zinc-600 border border-zinc-100 dark:border-zinc-700">
              <PagePanel :page="page"></PagePanel>
            </div>
          </div>
        </template>
      </div>

      <div class="right-pages w-full md:flex-1 flex flex-col gap-6">
        <template v-for="page of (data as any[]).filter((_, index) => index % 2 === 1)" :key="page.path">
          <div class="group">
            <div
              class="box-border transition-all duration-200 rounded-lg bg-white dark:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-200 dark:hover:shadow-zinc-600 border border-zinc-100 dark:border-zinc-700">
              <PagePanel :page="page"></PagePanel>
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
      content: '早早集市,博客站,前端,前端工程化,前端架构,Node,Nuxt3,Nuxt4,Hono,副业',
    },
  ],
})
import { hash } from 'ohash';
const { formatDate } = useDayjs();
const selectedTags = ref();
const appConfig = useAppConfig();
const tags = computed(() => appConfig.tags.map((tag, index) => ({ name: tag, value: index })))
const route = useRoute();
const filter_tags = computed(() => {
  let tag_str = route.query.tag || '';
  if (tag_str) {
    const query_tags = tag_str as string
    if (!selectedTags.value) {
      selectedTags.value = tags.value.filter(tag => tag.name === query_tags)[0]
    }
    return query_tags
  } else {
    if (!selectedTags.value) {
      selectedTags.value = tags.value[0] // 默认选中"全部"标签
    }
    return null
  }
})
const count = ref(0)



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
// const changePage = async (offset: number) => {
//   const _page = page.value + offset
//   navigateTo({
//     path: '/article',
//     query: {
//       ...route.query || {},
//       page: _page,
//     }
//   })
// }

const queryArticles = async (filter_tags: any) => {
  let query = queryCollection('content')

  if (filter_tags) {
    query = query.where('tags', 'LIKE', `%${filter_tags}%`)
  }
  // count.value = await query.count();
  return query.order('date', 'DESC').select('id', 'path', 'title', 'showTitle', 'date', 'tags', 'description', 'versions', 'lastmod', 'meta').all()
}

const { data, status, refresh } = await useAsyncData(hash('artile-page' + formatDate(new Date())), async () => {
  return queryArticles(filter_tags.value)
}, { watch: [filter_tags], lazy: true })

const selectTag = async (tag: { name: string, value: number }) => {
  selectedTags.value = tag;
  await changeTags(tag.name);
}

// const articles = computed(() => {

// })


</script>