<template>
  <div class="flex flex-col gap-4 max-w-7xl mx-auto px-4 py-4">
    <!-- 个人介绍区域 -->
    <div class="relative">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-700/10 dark:from-primary-900/20 dark:to-primary-700/20 rounded-xl"></div>
      <div class="relative p-5 rounded-xl">
        <div class="flex flex-col md:flex-row gap-5 items-center md:items-start">
          <div class="relative">
            <div class="w-28 h-28 rounded-full overflow-hidden ring-2 ring-white dark:ring-zinc-800 shadow-lg">
              <img :src="config.avatar" alt="avatar" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-800"></div>
          </div>
          <div class="flex-1 text-center md:text-left">
            <div class="flex flex-col md:flex-row items-center md:items-baseline gap-2">
              <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{{ config.author }}</h1>
              <Button v-if="config.organization" class="text-sm text-zinc-500 dark:text-zinc-400 font-normal" as="a" target="_blank"
                :label="`@${config.organization}`" :href="config.organizationUrl" variant="link" />
            </div>
            <p class="mt-2 text-base text-zinc-600 dark:text-zinc-400">{{ config.desciption }}</p>
            <div class="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
              <div v-for="item in config.social" :key="item.name" class="group">
                <Button type="button" severity="secondary" size="large" @click="(event) => toggle(event, item)"
                  v-tooltip.top="item.name" class="transition-all duration-200 hover:scale-105">
                  <Icon :name="item.icon" class="text-base"></Icon>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 占位图区域 -->
    <!-- <div class="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-100 dark:border-zinc-700">
      <div class="aspect-video rounded-lg bg-gradient-to-br from-primary-500/10 to-primary-700/10 dark:from-primary-900/20 dark:to-primary-700/20 flex items-center justify-center">
        <div class="text-center">
          <Icon name="icon-park-outline:chart-line" class="text-4xl text-primary-500 dark:text-primary-400 mb-2"></Icon>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">数据统计</p>
        </div>
      </div>
    </div> -->

    <!-- 最近文章区域 -->
    <div class="flex-1 space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          <span class="relative">
            最近文章
            <span class="absolute -bottom-0.5 left-0 w-full h-0.5 bg-primary-500"></span>
          </span>
        </h2>
        <Button as="a" variant="link" href="/article" @click="turnToPages" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
          <span>更多文章</span>
          <Icon name="icon-park-outline:right" class="ml-1"></Icon>
        </Button>
      </div>

      <div class="grid gap-2">
        <template v-for="page of articles" :key="page.path">
          <div class="group">
            <div class="p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:shadow-md hover:shadow-zinc-200 dark:hover:shadow-zinc-600 transition-all duration-200">
              <div class="flex flex-col md:flex-row md:items-center gap-2">
                <div class="flex items-center gap-2 flex-1">
                  <Icon name="icon-park-outline:right" class="text-zinc-400 group-hover:text-primary-500 transition-colors"></Icon>
                  <NuxtLink :to="page.path" class="flex-1 min-w-0">
                    <div class="text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                      {{ page.title }}
                    </div>
                    <div class="text-sm text-zinc-500 dark:text-zinc-400">
                      {{ formatDate(page.date, '/') }}
                    </div>
                  </NuxtLink>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <template v-if="page.versions">
                    <Tag v-for="v of page.versions.filter((v: any, i: number) => i < 2)" :key="v" :value="v" severity="secondary" size="small"></Tag>
                  </template>
                  <template v-else>
                    <Tag v-for="tag of page.tags" :key="tag" :value="tag" severity="secondary" size="small"></Tag>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 社交分享弹窗 -->
    <Popover ref="socialOp">
      <div class="flex flex-col gap-2 p-2">
        <div>
          <span class="font-medium block mb-1 text-sm">{{ curSocial?.name }}</span>
        </div>
        <div>
          <AppImg :src="curSocial?.popover" :width="200" />
        </div>
      </div>
    </Popover>
  </div>
</template>
<script lang="ts" setup>
useHead({
  title: '早早集市｜博客站',
  meta: [
    {
      name: 'description',
      content: '最新最全的 Nuxt4 全栈开发实战内容',
    },
    {
      name: 'keywords',
      content: '早早集市,博客站,前端,前端工程化,前端架构,Node,Nuxt3,Hono,副业',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://zzao.club/'
    }
  ]
})
const config = useAppConfig();
// console.log(`config`, config.authLayer)
const socialOp = ref();
const curSocial = ref();
const { formatDate } = useDayjs();
// const contentQuery = queryContent('post')
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
// console.log(`count`, count, maxPage)
const { data: articles } = await useAsyncData('articles', () => {
  return queryCollection('content').order('date', 'DESC').limit(5).select('path', 'title', 'showTitle', 'date', 'tags', 'versions', 'lastmod').all()
})

const toggle = (event, socail: any) => {
  console.log(`socail`, socail)
  curSocial.value = socail;
  if (!socail.popover) {
    if (socail.url) {
      navigateTo(socail.url, { external: true, open: { target: '_blank' } })
    }
  } else {
    socialOp.value.toggle(event);
  }
}

const turnToPages = () => {
  navigateTo('/article')
}

</script>
<style lang="less" scoped></style>