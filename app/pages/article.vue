<template>
  <div class="flex flex-col gap-4">
    <div class="paginator flex gap-4 justify-between items-center">
      <SelectButton v-model="selectedTags" :options="tags" optionLabel="name" @update:modelValue="changeTags"
        size="small" />
      <Tag class="ml-2" :value="`${count} 篇`"></Tag>
    </div>
    <template v-for="page of (data as unknown)" :key="page.path">
      <PagePanel :page="page"></PagePanel>
    </template>

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
      content: '早早集市,博客站,前端,前端工程化,前端架构,Node,Nuxt,Hono,副业',
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
    return null
  }
})
const count = ref(0)



const changeTags = async (tags: string[]) => {
  const tags_str = selectedTags.value.name
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
  count.value = await query.count();
  return query.order('date', 'DESC').select('id', 'path', 'title', 'showTitle', 'date', 'tags', 'description', 'versions', 'lastmod', 'meta').all()
}

const { data, status, refresh } = await useAsyncData(hash('artile-page' + formatDate(new Date())), async () => {
  return queryArticles(filter_tags.value)
}, { watch: [filter_tags], lazy: true })

// const articles = computed(() => {

// })


</script>