<template>
  <div class="flex flex-col gap-4 box-border relative">
    <div class="author-panel py-8 flex flex-col gap-4">
      <div class="flex gap-4">

        <div class="w-16 h-16">
          <UserAvatar :preview-url="config.avatar" size="xlarge" />
        </div>
        <div class="info-box flex flex-col gap-2">
          <div class="text-3xl font-bold">{{ config.author }}
            <Button v-if="config.organization" class="text-sm text-zinc-400 font-normal" as="a" target="_blank"
              :label="`@${config.organization}`" :href="config.organizationUrl" variant="link" />
          </div>
          <div class="text-sm text-zinc-500">{{ config.desciption }}</div>
        </div>
      </div>
      <!-- 如果存在auth layer 则会使用此组件显示状态 -->
      <div class="social-panel flex gap-4">
        <div v-for="item in config.social">
          <Button type="button" severity="secondary" size="large" label="Share" @click="(event) => toggle(event, item)"
            v-tooltip.top="item.name">
            <Icon :name="item.icon"></Icon>
          </Button>
        </div>

        <Popover ref="socialOp">
          <div class="flex flex-col gap-4">
            <div>
              <span class="font-medium block mb-2">{{ curSocial?.name }}</span>
            </div>
            <div>
              <AppImg :src="curSocial?.popover" :width="200" />
            </div>

          </div>
        </Popover>
      </div>
    </div>
    <div class="page-panel-title text-2xl font-bold">
      <span class="border-b-4 border-zinc-800 dark:border-zinc-400">最近文章</span>
    </div>

    <div class="page-panel gap-4 flex flex-col">
      <template v-for="page of articles">
        <div class="page-item flex justify-between group">
          <div class="page-title flex items-center gap-2">
            <Icon name="icon-park-outline:right" class="group-hover:hidden transition-all duration-150"></Icon>
            <Icon name="icon-park-outline:hand-right"
              class="hidden transition-all duration-150 group-hover:inline-block"></Icon>
            <NuxtLink :to="page.path"
              class="prose prose-a transition-all duration-150 dark:text-zinc-200 group-hover:underline group-hover:underline-offset-2 group-hover:font-bold">
              <span class="text-sm md:text-md text-zinc-400 mr-4">{{ formatDate(page.date, '/') }}</span>{{
                page.title
              }}
            </NuxtLink>
          </div>
          <div class="hidden group-hover:md:block">
            <template v-if="page.versions">
              <Tag v-for="v of page.versions.filter((v: any, i: number) => i < 2)" :key="v" :value="v"></Tag>
            </template>
            <template v-else>
              <Tag v-for="tag of page.tags" :key="tag" :value="tag"></Tag>
            </template>
          </div>
        </div>
      </template>
      <div class="more-articles">
        <Button text @click="turnToPages" :icon-pos="'right'">
          <Icon name="icon-park-outline:hand-right" slot="icon"></Icon>更多文章
        </Button>
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
      href: 'https://blog.zzao.club/'
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