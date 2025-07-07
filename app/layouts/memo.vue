<script lang="ts" setup>
const userStore = useUserStore()

const { memoStats, getMemoStats } = useMemoStats()

await getMemoStats()

const { tags, getTags } = useTags()

await getTags()

const route = useRoute()
const router = useRouter()

const selectedTags = ref<string[]>([])

// SSR/CSR: 初始化选中标签
onMounted(() => {
  updateSelectedTagsFromQuery()
})
watch(() => route.query.tags, updateSelectedTagsFromQuery)
function updateSelectedTagsFromQuery() {
  const q = route.query.tags
  if (typeof q === 'string' && q.length > 0) {
    selectedTags.value = q.split(',').filter(Boolean)
  }
  else {
    selectedTags.value = []
  }
}

const sortedTags = computed(() => {
  return [...(tags.value || [])]
    .sort((a, b) => (b._count?.memos || 0) - (a._count?.memos || 0))
})

function toggleTag(tagName: string) {
  const idx = selectedTags.value.indexOf(tagName)
  if (idx === -1) {
    selectedTags.value.push(tagName)
  }
  else {
    selectedTags.value.splice(idx, 1)
  }
  updateUrlWithTags()
}
function updateUrlWithTags() {
  const tagsParam = selectedTags.value.length > 0 ? selectedTags.value.join(',') : undefined
  router.replace({
    path: route.path,
    query: { ...route.query, tags: tagsParam },
  })
}
function isTagSelected(tagName: string) {
  return selectedTags.value.includes(tagName)
}

// 供 memo 卡片标签点击用，单选跳转
function handleTagClickSingle(tagName: string) {
  router.replace({
    path: '/memo',
    query: { ...route.query, tags: tagName },
  })
}

// Toast 支持
const globalToast = useGlobalToast()
const { $toast } = useNuxtApp() as any
watch(() => globalToast.toastState.value.messages, (messages) => {
  if (messages.length > 0) {
    messages.forEach((message) => {
      switch (message.type) {
        case 'success':
          $toast.success(message.message, message.options as any)
          break
        case 'error':
          $toast.error(message.message, message.options as any)
          break
        case 'info':
          $toast.info(message.message, message.options as any)
          break
        case 'warning':
          $toast.warning(message.message, message.options as any)
          break
        case 'promise':
          $toast.promise(message.options as any)
          break
        default:
          $toast(message.message, message.options as any)
      }
    })
    globalToast.clear()
  }
}, { deep: true })
</script>

<template>
  <Toaster position="top-right" rich-colors />
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
              <span
                v-for="tag in sortedTags"
                :key="tag.id"
                class="px-2 py-1 text-sm cursor-pointer rounded-none transition-all duration-200 group flex-shrink-0 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 hover:text-cyan-700 dark:hover:text-cyan-300"
                :class="[
                  isTagSelected(tag.tag_name)
                    ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 font-bold'
                    : 'bg-zinc-200 text-zinc-800 dark:bg-zinc-200 dark:text-zinc-800',
                ]"
                @click="toggleTag(tag.tag_name)"
              >
                {{ tag.tag_name }} ({{ tag._count?.memos || 0 }})
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
      <slot :selected-tags="selectedTags" :on-tag-click="handleTagClickSingle" />
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
          全部标签
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in sortedTags"
            :key="tag.id"
            class="px-2 py-1 text-sm cursor-pointer rounded-none transition-all duration-200 group flex-shrink-0 hover:text-cyan-700"
            :class="[
              isTagSelected(tag.tag_name)
                ? 'border-cyan-600 border-2 box-border rounded-sm bg-zinc-100 text-zinc-800 font-bold'
                : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-200 dark:text-zinc-800',
            ]"
            @click="toggleTag(tag.tag_name)"
          >
            {{ tag.tag_name }} ({{ tag._count?.memos || 0 }})
          </span>
        </div>
      </div>
    </aside>
  </div>
</template>
