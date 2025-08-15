<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const show = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const { searchParams } = useSearch()
const searchMode = ref<'content' | 'tag'>('content')
const loading = ref(false)
const articles = ref<any[]>([])
const feeds = ref<any[]>([])
const _tags = ref<string[]>(['nuxt', 'vue', 'hono', '全栈', '动态']) // 可替换为实际 tag 数据

const hasResults = computed(() => articles.value.length > 0 || feeds.value.length > 0)

// const searchModeOptions = [
//   { value: 'content', label: '内容' },
//   { value: 'tag', label: '标签' },
// ]

// const { onEnter, onBeforeEnter, onLeave } = useStaggeredListTransition('.search-result-item')

async function fetchArticles() {
  loading.value = true
  articles.value = []
  feeds.value = []
  const { data } = await usePages({ filter_tags: searchParams.value.tag })
  articles.value = data.value || []
  loading.value = false
}

onMounted(() => {
  if (searchParams.value.text || searchParams.value.tag) {
    fetchArticles()
  }
})

watch(
  () => [searchParams.value.tag, searchParams.value.text],
  ([tag, text]) => {
    if (tag)
      searchMode.value = 'tag'
    else if (text)
      searchMode.value = 'content'
    if (tag)
      fetchArticles()
  },
  { immediate: true },
)
</script>

<template>
  <Dialog v-model:open="show">
    <DialogContent class="md:!max-w-none md:!w-[700px] p-6 min-h-[380px] max-h-[480px] flex flex-col overflow-hidden !bg-bg-pixel-primary font-mono rounded-none">
      <DialogHeader>
        <DialogTitle>站内搜索</DialogTitle>
        <DialogDescription />
      </DialogHeader>
      <div class="space-y-6 flex-1 flex flex-col p-2 overflow-hidden">
        <!-- 搜索输入栏已注释，替换为类型标题 -->
        <div class="flex items-center gap-2 mb-2 text-lg font-semibold">
          <Icon name="material-symbols:search" class="text-zinc-500" />
          <span>{{ searchMode === 'tag' ? 'tag' : 'content' }}: </span>
          <span class="text-primary-600">{{ searchMode === 'tag' ? `#${searchParams.tag}` : searchParams.text }}</span>
        </div>
        <div class="relative min-h-[180px] max-h-[300px] overflow-y-auto flex-1 rounded-lg p-1 cyan-scrollbar shadow-inner">
          <!-- 结果内容始终渲染，loading/empty 用绝对定位覆盖 -->
          <div v-if="loading || !hasResults" class="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-zinc-900/80">
            <template v-if="loading">
              <div class="flex flex-col gap-3 w-full mt-4">
                <Skeleton v-for="i in 5" :key="i" class="h-6 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
            </template>
            <span v-else class="text-zinc-400 text-base tracking-wide select-none">暂无结果</span>
          </div>
          <div v-show="!loading && hasResults" class="relative h-full">
            <div v-if="articles.length" class="flex flex-col gap-3 mt-4">
              <div
                v-for="article in articles"
                :key="article.id"
                class="flex items-center gap-2 search-result-item group cursor-pointer"
                @click="navigateTo(article.path)"
              >
                <Icon name="pixelarticons:open" class="text-text-pixel-secondary flex-shrink-0" size="1.2em" />
                <span
                  class="relative font-medium transition-colors duration-200 hover-underline-animate"
                >
                  {{ article.title }}
                  <span class="hover-underline" />
                </span>
              </div>
            </div>
            <!-- <div v-if="feeds.length">
              <div class="font-bold mb-3 text-zinc-700 dark:text-zinc-200 text-lg">
                动态
              </div>
              <TransitionGroup tag="div" class="flex flex-col gap-3" appear @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
                <Card v-for="item in feeds" :key="item.id" class="cursor-pointer hover:shadow-lg transition rounded-lg px-4 py-3 bg-zinc-50 dark:bg-zinc-800">
                  <div class="font-medium text-base text-zinc-900 dark:text-zinc-100">
                    {{ item.title }}
                  </div>
                  <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                    {{ item.summary }}
                  </div>
                </Card>
              </TransitionGroup>
            </div> -->
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style>
/* .custom-vertical-inner-shadow {
  box-shadow: inset 0 16px 24px -12px rgba(8, 145, 178, 0.1);
} */
</style>
