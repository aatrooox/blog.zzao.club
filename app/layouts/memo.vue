<script lang="ts" setup>
const userStore = useUserStore()

const { memoStats, getMemoStats } = useMemoStats()

await getMemoStats()

const popularTags = ref([
  { id: '1', name: 'Nuxt', count: 20 },
  { id: '2', name: 'Vue', count: 15 },
  { id: '3', name: 'TypeScript', count: 18 },
  { id: '4', name: 'TailwindCSS', count: 12 },
  { id: '5', name: 'SSR', count: 10 },
])

</script>

<template>
  <div class="memos-page-container min-h-screen bg-gray-100 dark:bg-zinc-900 p-4 flex flex-col md:flex-row gap-4">
    <!-- Left Column: User Info & Stats -->
    <aside class="w-1/4 lg:w-1/5 hidden md:block p-4 bg-white dark:bg-zinc-800 rounded-lg shadow sticky top-4 self-start">
      <div class="user-info text-center">
        <ClientOnly>
          <NuxtLink to="/">
            <UserAvatar :user-info="userStore.user" alt="User Avatar" class="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-zinc-300 dark:border-zinc-700" />
          </NuxtLink>
          <h2 class="text-xl font-semibold dark:text-white">
            {{ userStore?.user?.nickname || '早早集市' }}
          </h2>
          <template #fallback>
            <div class="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-zinc-300 dark:border-zinc-700 bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
              <Icon name="material-symbols:person" class="w-12 h-12 text-gray-400 dark:text-zinc-500" />
            </div>
            <h2 class="text-xl font-semibold dark:text-white">
              早早集市
            </h2>
          </template>
        </ClientOnly>
      </div>
      <div class="stats mt-6 space-y-2">
        <div class="stat-item flex justify-between dark:text-gray-300">
          <span>动态:</span>
          <ClientOnly>
            <span class="font-semibold dark:text-white">{{ memoStats.count || 0 }} 条</span>
          </ClientOnly>
        </div>
        <!-- <div class="stat-item flex justify-between dark:text-gray-300">
          <span>活跃天数:</span>
          <span class="font-semibold dark:text-white">{{ userInfo.activeDays }} 天</span>
        </div> -->
        <!-- Add more stats as needed -->
      </div>
      <!-- Right sidebar content when lg breakpoint is not met -->
      <div class="md:block lg:hidden mt-6 space-y-6">
        <transition name="slide-down" appear>
          <div class="heatmap-container">
            <h3 class="text-lg font-semibold mb-2 dark:text-white">
              贡献热力图
            </h3>
            <div class="heatmap bg-gray-200 dark:bg-zinc-700 p-2 rounded h-32 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
              <!-- Placeholder for Heatmap Component -->
              热力图占位
              <!-- Example: <GithubHeatmap :data="heatmapData" /> -->
            </div>
          </div>
        </transition>
        <transition name="slide-down" appear>
          <div class="tags-cloud">
            <h3 class="text-lg font-semibold mb-2 dark:text-white">
              热门标签
            </h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in popularTags" :key="tag.id" class="px-2 py-1 bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100 rounded-md text-sm cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-600">
                {{ tag.name }} ({{ tag.count }})
              </span>
            </div>
          </div>
        </transition>
      </div>
    </aside>

    <!-- Middle Column: Slot for page content -->
    <main class="w-full md:flex-1 md:max-w-3xl md:mx-auto">
      <!-- Compact User Info for Mobile/Small Screens -->
      <div class="compact-user-info md:hidden mb-6 bg-white dark:bg-zinc-800 rounded-lg shadow p-3">
        <div class="flex items-center space-x-3">
          <NuxtLink to="/">
            <UserAvatar :user-info="userStore.user" alt="User Avatar" class="w-10 h-10 rounded-full mx-auto border-2 border-zinc-300 dark:border-zinc-700" />
          </NuxtLink>
          <div class="flex-1 flex items-center space-x-4">
            <h2 class="text-base font-semibold dark:text-white">
              {{ userStore?.user?.nickname || '早早集市' }}
            </h2>
            <div class="flex space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <span class="flex items-center space-x-1">
                <Icon name="material-symbols:edit-note-outline" class="w-4 h-4" />
                <span>{{ memoStats.count || 0 }} 条</span>
              </span>
              <!-- <span class="flex items-center space-x-1">
                <Icon name="material-symbols:calendar-today-outline" class="w-4 h-4" />
                <span>{{ userInfo.activeDays }} 天</span>
              </span> -->
            </div>
          </div>
        </div>
      </div>

      <!-- Page content slot -->
      <slot />
    </main>

    <!-- Right Column: Heatmap & Tags -->
    <aside class="w-1/4 lg:w-1/5 hidden lg:block p-4 bg-white dark:bg-zinc-800 rounded-lg shadow sticky top-4 self-start">
      <div class="heatmap-container mb-6">
        <h3 class="text-lg font-semibold mb-2 dark:text-white">
          贡献热力图
        </h3>
        <div class="heatmap bg-gray-200 dark:bg-zinc-700 p-2 rounded h-40 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <!-- Placeholder for Heatmap Component -->
          热力图占位
          <!-- Example: <GithubHeatmap :data="heatmapData" /> -->
        </div>
      </div>
      <div class="tags-cloud">
        <h3 class="text-lg font-semibold mb-2 dark:text-white">
          热门标签
        </h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in popularTags" :key="tag.id" class="px-2 py-1 bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100 rounded-md text-sm cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-600">
            {{ tag.name }} ({{ tag.count }})
          </span>
        </div>
      </div>
    </aside>
  </div>
</template>
