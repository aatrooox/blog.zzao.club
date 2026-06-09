<script lang="ts" setup>
definePageMeta({ layout: 'home' })
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
      href: 'https://zzao.club/',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': '早早集市',
        'alternateName': 'zzao.club',
        'url': 'https://zzao.club/',
        'description': '最新最全的Nuxt4全栈开发实战内容，提供免费的Nuxt4权威课程，高质量Nuxt中文交流群',
        'inLanguage': 'zh-CN',
        'publisher': {
          '@type': 'Person',
          'name': 'Aatrox',
          'url': 'https://zzao.club/about',
        },
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Aatrox',
        'url': 'https://zzao.club/about',
        'sameAs': [
          'https://github.com/aatrooox',
        ],
      }),
    },
  ],
})

const [
  { data: allArticles },
  { data: jinxArticles },
] = await Promise.all([
  usePagesWithGroup({ limit: 50 }),
  useJinxArticles({ limit: 8 }),
])

// 解析文章分组结构（排除 Jinx 文章）
const groupHierarchy = computed(() => {
  if (!allArticles.value)
    return null
  // 过滤掉 Jinx 的文章，Aatrox 专栏只展示 Aatrox 的内容
  const aatroxArticles = allArticles.value.filter((a: any) => !a.author || a.author !== 'Jinx')
  return parseGroupHierarchy(aatroxArticles)
})

const flatGroups = computed(() => {
  if (!groupHierarchy.value)
    return []
  return flattenGroups(groupHierarchy.value)
})

// LATEST 列：最新5篇 Aatrox 无分组文章
const latestArticles = computed(() => {
  if (!groupHierarchy.value)
    return []
  return groupHierarchy.value.articles.slice(0, 5)
})

// 技术文章列表（单篇 + 分组，排除前3篇已在 Latest 展示的；最多8条）
const techItems = computed(() => {
  const items: any[] = []
  if (groupHierarchy.value) {
    groupHierarchy.value.articles.forEach((article: any, idx: number) => {
      if (idx < 5)
        return // Latest 已展示前5篇
      items.push({ type: 'article', data: article })
    })
  }
  flatGroups.value.forEach((group) => {
    items.push({ type: 'group', data: group })
  })
  return items.slice(0, 8)
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <!-- 顶部信息栏 -->
    <HomeHeroSection />

    <!-- 三列文章区：LATEST | AATROX | JINX -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 xl:divide-x divide-zinc-200 dark:divide-zinc-800">
      <!-- LATEST -->
      <div class="xl:pr-6">
        <HomeNewsColumn :articles="latestArticles" />
      </div>
      <!-- AATROX -->
      <div class="pt-6 xl:pt-0 xl:px-6 border-t md:border-t-0 xl:border-t-0 border-zinc-200 dark:border-zinc-800">
        <HomeTechColumn :items="techItems" />
      </div>
      <!-- JINX -->
      <div class="pt-6 xl:pt-0 xl:pl-6 border-t xl:border-t-0 border-zinc-200 dark:border-zinc-800">
        <HomeJinxColumn :articles="jinxArticles ?? []" />
      </div>
    </div>
  </div>
</template>
