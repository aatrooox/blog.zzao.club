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
  <div class="memos-page-container min-h-screen bg-secondary-100 p-4 flex flex-col md:flex-row gap-4">
    <!-- Left Column: User Info & Stats -->
    <aside class="w-1/4 lg:w-1/5 hidden md:block p-4 md:p-6 bg-base border-2 border-bg-base rounded-lg shadow-pixel sticky top-4 self-start">
      <div class="user-info text-center">
        <ClientOnly>
          <NuxtLink to="/">
            <UserAvatar :user-info="userStore.user" alt="User Avatar" class="w-24 h-24 rounded-lg mx-auto mb-4 border-2 border-bg-base hover:scale-105 transition-transform duration-200" />
          </NuxtLink>
          <h2 class="text-xl font-pixel font-bold text-bg-base">
            {{ userStore?.user?.nickname || '早早集市' }}
          </h2>
          <template #fallback>
            <div class="w-24 h-24 rounded-lg mx-auto mb-4 border-2 border-bg-base bg-secondary-500/20 flex items-center justify-center">
              <Icon name="material-symbols:person" class="w-12 h-12 text-bg-base/70" />
            </div>
            <h2 class="text-xl font-pixel font-bold text-bg-base">
              早早集市
            </h2>
          </template>
        </ClientOnly>
      </div>
      <div class="stats mt-6 space-y-3">
        <div class="stat-item flex justify-between font-cartoon text-bg-base">
          <span class="font-bold">动态:</span>
          <ClientOnly>
            <span class="font-bold text-primary-600">{{ memoStats.count || 0 }} 条</span>
          </ClientOnly>
        </div>
        <!-- <div class="stat-item flex justify-between font-cartoon text-bg-base">
          <span class="font-bold">活跃天数:</span>
          <span class="font-bold text-primary-600">{{ userInfo.activeDays }} 天</span>
        </div> -->
        <!-- Add more stats as needed -->
      </div>
      <!-- Right sidebar content when lg breakpoint is not met -->
      <div class="md:block lg:hidden mt-6 space-y-6">
        <transition name="slide-down" appear>
          <div class="heatmap-container">
            <h3 class="text-lg font-pixel font-bold mb-3 text-bg-base flex items-center gap-2">
              <div class="w-2 h-2 bg-accent-400 rounded-sm" />
              贡献热力图
            </h3>
            <div class="heatmap bg-secondary-500/20 border-2 border-bg-base p-4 rounded-lg h-32 flex items-center justify-center text-bg-base/70 text-sm font-cartoon">
              <!-- Placeholder for Heatmap Component -->
              热力图占位
              <!-- Example: <GithubHeatmap :data="heatmapData" /> -->
            </div>
          </div>
        </transition>
        <transition name="slide-down" appear>
          <div class="tags-cloud">
            <h3 class="text-lg font-pixel font-bold mb-3 text-bg-base flex items-center gap-2">
              <div class="w-2 h-2 bg-accent-400 rounded-sm" />
              热门标签
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in sortedTags"
                :key="tag.id"
                class="px-3 py-2 text-sm cursor-pointer rounded-lg border-2 transition-all duration-200 group flex-shrink-0 font-cartoon font-bold hover:scale-105"
                :class="[
                  isTagSelected(tag.tag_name)
                    ? 'bg-primary-600 text-base border-bg-base'
                    : 'bg-secondary-500 text-bg-base border-bg-base hover:bg-primary-600',
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
      <div class="compact-user-info md:hidden mb-6 bg-base border-2 border-bg-base rounded-lg shadow-pixel p-4">
        <div class="flex items-center space-x-3">
          <NuxtLink to="/">
            <UserAvatar :user-info="userStore.user" alt="User Avatar" class="w-12 h-12 rounded-lg border-2 border-bg-base hover:scale-105 transition-transform duration-200" />
          </NuxtLink>
          <div class="flex-1 flex items-center space-x-4">
            <h2 class="text-base font-pixel font-bold text-bg-base">
              {{ userStore?.user?.nickname || '早早集市' }}
            </h2>
            <div class="flex space-x-3 text-sm font-cartoon text-bg-base">
              <span class="flex items-center space-x-1">
                <Icon name="material-symbols:edit-note-outline" class="w-4 h-4 text-primary-600" />
                <span class="font-bold">{{ memoStats.count || 0 }} 条</span>
              </span>
              <!-- <span class="flex items-center space-x-1">
                <Icon name="material-symbols:calendar-today-outline" class="w-4 h-4 text-primary-600" />
                <span class="font-bold">{{ userInfo.activeDays }} 天</span>
              </span> -->
            </div>
          </div>
        </div>
      </div>

      <!-- Page content slot -->
      <slot :selected-tags="selectedTags" :on-tag-click="handleTagClickSingle" />
    </main>

    <!-- Right Column: Heatmap & Tags -->
    <aside class="w-1/4 lg:w-1/5 hidden lg:block p-4 md:p-6 bg-base border-2 border-bg-base rounded-lg shadow-pixel sticky top-4 self-start">
      <div class="heatmap-container mb-6">
        <h3 class="text-lg font-pixel font-bold mb-3 text-bg-base flex items-center gap-2">
          <div class="w-2 h-2 bg-accent-400 rounded-sm" />
          贡献热力图
        </h3>
        <div class="heatmap bg-secondary-500/20 border-2 border-bg-base p-4 rounded-lg h-40 flex items-center justify-center text-bg-base/70 font-cartoon">
          <!-- Placeholder for Heatmap Component -->
          热力图占位
          <!-- Example: <GithubHeatmap :data="heatmapData" /> -->
        </div>
      </div>
      <div class="tags-cloud">
        <h3 class="text-lg font-pixel font-bold mb-3 text-bg-base flex items-center gap-2">
          <div class="w-2 h-2 bg-accent-400 rounded-sm" />
          全部标签
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in sortedTags"
            :key="tag.id"
            class="px-3 py-2 text-sm cursor-pointer rounded-lg border-2 transition-all duration-200 group flex-shrink-0 font-cartoon font-bold hover:scale-105"
            :class="[
              isTagSelected(tag.tag_name)
                ? 'bg-primary-600 text-base border-bg-base'
                : 'bg-secondary-500 text-bg-base border-bg-base hover:bg-primary-600',
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
