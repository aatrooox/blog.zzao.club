<script lang="ts" setup>
interface XPost {
  index: number
  username: string
  postId: string
  publishTime: string
  postLink: string
  textContent: string
  views: string
  likes: string
  retweets: string
  replies: string
}

interface NewsData {
  posts: XPost[]
}

useHead({
  title: '动态｜早早集市',
  meta: [
    {
      name: 'description',
      content: 'X.com 动态聚合，关注技术大佬的最新动态',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://zzao.club/news',
    },
  ],
})

// Query the news collection
const { data } = await useAsyncData('news', () => queryCollection('news').all())

// Transform data into flat posts with source information
const allPosts = computed(() => {
  if (!data.value) return []
  
  return data.value.flatMap(item => {
    const newsData = item as unknown as NewsData
    const source = item._path?.replace('/news/', '') || 'unknown'
    
    return newsData.posts.map(post => ({
      ...post,
      source,
      parsedDate: new Date(post.publishTime),
    }))
  }).sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime())
})

// Group by date
const groupedByDate = computed(() => {
  const groups: Record<string, typeof allPosts.value> = {}
  
  allPosts.value.forEach((post) => {
    const dateKey = post.parsedDate.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(post)
  })
  
  return Object.entries(groups)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .map(([date, posts]) => ({ date, posts }))
})

function formatEngagement(num: string) {
  // Convert Chinese format like "2.6万" to readable format
  return num
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950">
    <div class="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          动态
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400">
          来自 X.com 的技术大佬动态聚合
        </p>
      </div>

      <!-- Posts grouped by date -->
      <div v-if="groupedByDate.length > 0" class="space-y-12">
        <div v-for="group in groupedByDate" :key="group.date" class="space-y-6">
          <!-- Date Header -->
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-bold text-zinc-600 dark:text-zinc-400">
              {{ group.date }}
            </h2>
            <div class="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <!-- Posts in this date -->
          <div class="space-y-4">
            <div
              v-for="post in group.posts"
              :key="post.postId"
              class="group"
            >
              <a
                :href="post.postLink"
                target="_blank"
                rel="noopener noreferrer"
                class="block p-4 -mx-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors duration-200"
              >
                <!-- Author & Time -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-zinc-800 dark:text-zinc-200">
                      @{{ post.username }}
                    </span>
                    <span class="text-xs text-zinc-400">·</span>
                    <span class="text-sm text-zinc-400 font-mono">
                      {{ new Date(post.publishTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }}
                    </span>
                  </div>
                  
                  <!-- External link icon -->
                  <div class="text-zinc-300 group-hover:text-zinc-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>

                <!-- Content -->
                <div class="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap mb-3 leading-relaxed">
                  {{ post.textContent }}
                </div>

                <!-- Engagement Stats -->
                <div class="flex items-center gap-4 text-xs text-zinc-400">
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{{ formatEngagement(post.views) }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{{ post.likes }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>{{ post.retweets }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{{ post.replies }}</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-20 text-center text-zinc-400">
        暂无动态数据
      </div>
    </div>
  </div>
</template>
