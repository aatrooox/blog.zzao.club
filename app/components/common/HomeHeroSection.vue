<script setup lang="ts">
const appConfig = useAppConfig()

const tags = computed(() => {
  const allTags: string[] = appConfig.tags || []
  return allTags.filter(t => t !== '全部')
})

const socialItems = computed(() => appConfig.social || [])

const githubRepos = computed(() => appConfig.githubRepos || [])

function formatStars(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return String(count)
}
</script>

<template>
  <div class="space-y-5 mb-8">
    <!-- 作者简介 + 社交 -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <NuxtImg
          :src="appConfig.avatar"
          alt="Aatrox"
          width="40"
          height="40"
          class="rounded-full shrink-0"
        />
        <div class="min-w-0">
          <div class="font-bold text-zinc-800 dark:text-zinc-200 text-sm truncate">
            Aatrox
          </div>
          <div class="text-xs text-zinc-400 dark:text-zinc-500 truncate">
            Nuxt 全栈开发
          </div>
        </div>
      </div>

      <!-- 社交图标 -->
      <div class="flex items-center gap-1 shrink-0">
        <template v-for="item in socialItems" :key="item.name">
          <!-- 有 popover（二维码）的：hover 显示图片 -->
          <div v-if="item.popover" class="relative group">
            <NuxtLink
              :to="item.url || '#'"
              :external="!!item.url"
              :target="item.url ? '_blank' : undefined"
              class="flex items-center justify-center w-8 h-8 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              :title="item.name"
            >
              <Icon :name="item.icon" class="w-5 h-5" />
            </NuxtLink>
            <!-- Hover 弹出二维码 -->
            <div class="absolute right-0 top-full mt-2 hidden group-hover:block z-50">
              <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 p-2">
                <div class="text-xs text-zinc-500 dark:text-zinc-400 text-center mb-1.5">
                  {{ item.name }}
                </div>
                <NuxtImg
                  :src="item.popover"
                  :alt="item.name"
                  width="160"
                  height="160"
                  class="w-40 h-40 rounded object-cover"
                />
              </div>
              <!-- 小三角 -->
              <div class="absolute -top-1.5 right-3 w-3 h-3 bg-white dark:bg-zinc-800 border-l border-t border-zinc-200 dark:border-zinc-700 rotate-45" />
            </div>
          </div>

          <!-- 纯链接的 -->
          <NuxtLink
            v-else-if="item.url"
            :to="item.url"
            external
            target="_blank"
            class="flex items-center justify-center w-8 h-8 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            :title="item.name"
          >
            <Icon :name="item.icon" class="w-5 h-5" />
          </NuxtLink>
        </template>
      </div>
    </div>

    <!-- 热门标签 -->
    <div v-if="tags.length" class="flex items-center gap-2 flex-wrap">
      <span class="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">标签</span>
      <NuxtLink
        v-for="tag in tags"
        :key="tag"
        :to="`/article?tag=${tag}`"
        class="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary transition-colors"
      >
        {{ tag }}
      </NuxtLink>
    </div>

    <!-- GitHub 项目 -->
    <div v-if="githubRepos.length" class="space-y-2">
      <div class="flex items-center gap-2">
        <Icon name="icon-park-outline:github" class="text-primary w-4 h-4 shrink-0" />
        <span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">开源项目</span>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <NuxtLink
          v-for="repo in githubRepos"
          :key="repo.name"
          :to="repo.url"
          external
          target="_blank"
          class="group rounded-lg border border-zinc-100 dark:border-zinc-800 p-2.5 hover:border-primary/30 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
        >
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors truncate">
              {{ repo.name }}
            </span>
          </div>
          <p class="text-xs text-zinc-400 dark:text-zinc-500 truncate mb-1.5">
            {{ repo.desc }}
          </p>
          <div class="flex items-center gap-2">
            <span v-if="repo.lang" class="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
              <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: repo.langColor }" />
              {{ repo.lang }}
            </span>
            <span v-if="repo.stars > 0" class="flex items-center gap-0.5 text-xs text-zinc-400 dark:text-zinc-500">
              <Icon name="lucide:star" class="w-3 h-3" />
              {{ formatStars(repo.stars) }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="border-b border-zinc-100 dark:border-zinc-800" />
  </div>
</template>
