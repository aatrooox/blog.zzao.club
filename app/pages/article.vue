<template>
  <div class="flex flex-col gap-4">
    <div class="paginator flex gap-4 justify-between items-center">
      <!-- <Select v-model="selectedTags" showClear :options="tags" optionLabel="name" placeholder="筛选标签"
        class="w-full md:w-56" @update:modelValue="changeTags" /> -->
      <SelectButton v-model="selectedTags" :options="tags" optionLabel="name" multiple aria-labelledby="multiple"
        @update:modelValue="changeTags" size="small" />
        <Tag class="ml-2" :value="`${count} 篇`"></Tag>
    </div>
    <!-- <TransitionGroup name="page" @leave="leaveTransition"> -->
    <!-- <Transition name="page">
      <div class="flex flex-col gap-4" v-if="status === 'pending'" key="skeleton">
        <SkeletonPage v-for="_ in 10"></SkeletonPage>
      </div>
    </Transition> -->

    <template v-for="page of (data as unknown)" :key="page.path">
      <PagePanel :page="page"></PagePanel>
    </template>
    <!-- </TransitionGroup> -->

    <!-- <div class="paginator flex gap-4 justify-center items-center">
      <Button rounded :disabled="prevDisabled" @click="changePage(-1)">
        <Icon name="icon-park-outline:arrow-up"></Icon>
      </Button>
      <span class="text-xl font-bold">{{ page }}</span>
      <Button rounded :disabled="nextDisabled" @click="changePage(1)">
        <Icon name="icon-park-outline:arrow-down"></Icon>
      </Button>
      <Tag class="ml-2" :value="`总计 ${count} 篇`"></Tag>
    </div> -->
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

const selectedTags = ref();
const tags = ref([
  { name: '博客', value: 1 },
  { name: 'Nuxt', value: 2 },
  { name: '吐槽', value: 3 },
  { name: 'Hono', value: 4 },
  // { name: 'Markdown', value: 5 }
]);
const route = useRoute();
const filter_tags = computed(() => {
  let tag_str = route.query.tag || '';
  if (tag_str) {
    const query_tags = (tag_str as string).split('+')
    if (!selectedTags.value) {
      selectedTags.value = tags.value.filter(tag => query_tags.includes(tag.name))
    }
    return query_tags
  } else {
    return []
  }
})
const count = ref(0)



const changeTags = async (tags: string[]) => {
  console.log(`selectedTags.value`, selectedTags.value)
  const tags_str = selectedTags.value.map(tag => tag.name).join('+')
  navigateTo({
    path: '/article',
    query: {
      ...route.query || {},
      page: 1,
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

const queryArticles = async (filter_tags: string[] = []) => {
  let query = queryCollection('content')
  if (filter_tags.length) {
    filter_tags.forEach(tag => {
      query = query.where('tags', 'LIKE', `%${tag}%`)
    })
  }
  count.value = await query.count();
  return query.order('date', 'DESC').select('id', 'path', 'title', 'date', 'tags', 'description', 'versions', 'lastmod', 'meta').all()
}

const { data, status, refresh } = await useAsyncData(hash('artile-page'), async () => {
  return queryArticles(filter_tags.value)
}, { watch: [filter_tags]})




</script>