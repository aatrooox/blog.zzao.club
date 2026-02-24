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
      <div class="flex items-center gap-4 min-w-0">
        <!-- Aatrox -->
        <div class="flex items-center gap-3">
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

        <!-- 竖线分隔 -->
        <div v-if="appConfig.jinx" class="h-8 w-px bg-zinc-200 dark:bg-zinc-700 shrink-0" />

        <!-- Jinx -->
        <div v-if="appConfig.jinx" class="flex items-center gap-3 min-w-0">
          <NuxtImg
            :src="appConfig.jinx.avatar"
            :alt="appConfig.jinx.name"
            width="40"
            height="40"
            class="rounded-full shrink-0"
          />
          <div class="min-w-0">
            <div class="font-bold text-indigo-600 dark:text-indigo-400 text-sm truncate">
              {{ appConfig.jinx.name }}
            </div>
            <div class="text-xs text-zinc-400 dark:text-zinc-500 truncate">
              {{ appConfig.jinx.description }}
            </div>
            <div class="flex items-center gap-2.5 mt-0.5">
              <span class="text-[10px] text-zinc-400 dark:text-zinc-500">
                <span class="font-semibold text-zinc-600 dark:text-zinc-300">{{ appConfig.jinx.skills }}</span> SKILLS
              </span>
              <span class="text-[10px] text-zinc-400 dark:text-zinc-500">
                <span class="font-semibold text-zinc-600 dark:text-zinc-300">{{ appConfig.jinx.cron }}</span> CRON
              </span>
            </div>
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
            <div class="absolute right-0 top-full mt-2 hidden group-hover:block z-50 w-44">
              <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 p-2 w-full">
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

    <!-- GitHub 项目：紧凑 chip 行 -->
    <div v-if="githubRepos.length" class="flex items-center gap-2 flex-wrap">
      <Icon name="icon-park-outline:github" class="text-zinc-400 dark:text-zinc-500 w-3.5 h-3.5 shrink-0" />
      <NuxtLink
        v-for="repo in githubRepos"
        :key="repo.name"
        :to="repo.url"
        external
        target="_blank"
        class="group flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-primary/40 hover:text-primary dark:hover:text-primary transition-colors"
      >
        <span>{{ repo.name }}</span>
        <span v-if="repo.stars > 0" class="flex items-center gap-0.5 text-zinc-400 dark:text-zinc-500 group-hover:text-primary/70 transition-colors">
          <Icon name="lucide:star" class="w-2.5 h-2.5" />
          {{ formatStars(repo.stars) }}
        </span>
      </NuxtLink>
    </div>

    <!-- 分隔线 -->
    <div class="border-b border-zinc-100 dark:border-zinc-800" />
  </div>
</template>
