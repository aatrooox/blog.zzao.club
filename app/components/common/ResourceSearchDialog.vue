<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  defaultParams?: { tag?: string, text?: string }
}>()
const emit = defineEmits(['update:modelValue'])

const show = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const searchText = ref(props.defaultParams?.text || '')
const selectedTag = ref(props.defaultParams?.tag || '')
const searchMode = ref<'content' | 'tag'>('content')
const loading = ref(false)
const articles = ref<any[]>([])
const feeds = ref<any[]>([])
const _tags = ref<string[]>(['nuxt', 'vue', 'hono', '全栈', '动态']) // 可替换为实际 tag 数据

const hasResults = computed(() => articles.value.length > 0 || feeds.value.length > 0)

const searchModeOptions = [
  { value: 'content', label: '内容' },
  { value: 'tag', label: '标签' },
]

const { onEnter, onBeforeEnter, onLeave } = useStaggeredListTransition('.search-result-item')

function _selectTag(tag: string) {
  selectedTag.value = tag
  onSearch()
}

function onSearch() {
  loading.value = true
  articles.value = []
  feeds.value = []
  setTimeout(() => {
    // 假数据模拟
    articles.value = searchText.value || selectedTag.value
      ? [
          { id: 'a1', title: 'Nuxt3 全面指南' },
          { id: 'a2', title: 'Hono 实战' },
        ]
      : []
    feeds.value = searchText.value || selectedTag.value
      ? [
          { id: 'f1', title: '动态：Nuxt3 发布', summary: 'Nuxt3 正式发布，带来全新体验...' },
        ]
      : []
    loading.value = false
  }, 500)
}

// function goFeed(item: any) {
//   show.value = false
//   navigateTo(`/m/${item.id}`)
// }

onMounted(() => {
  if (searchText.value || selectedTag.value) {
    onSearch()
  }
})
</script>

<template>
  <Dialog v-model:open="show">
    <DialogContent class="max-w-lg w-full p-6 min-h-[380px] max-h-[480px] flex flex-col overflow-hidden">
      <DialogHeader>
        <DialogTitle>站内搜索（开发中，不可用）</DialogTitle>
        <DialogDescription />
      </DialogHeader>
      <div class="space-y-6 flex-1 flex flex-col overflow-hidden">
        <div class="flex gap-3 mb-2">
          <Select v-model="searchMode" class="w-24">
            <SelectTrigger class="h-11 min-h-[44px] px-3 text-base rounded-lg border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary-500 transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in searchModeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
          <Input v-model="searchText" :placeholder="searchMode === 'content' ? '搜索标题/内容...' : '搜索标签...'" class="flex-1 h-11 min-h-[44px] px-4 text-base rounded-lg border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary-500 transition-all duration-200" @keyup.enter="onSearch" />
          <Button class="h-11 min-h-[44px] px-6 text-base rounded-lg" @click="onSearch">
            搜索
          </Button>
        </div>
        <!-- <div v-if="tags && tags.length" class="flex flex-wrap gap-2 mb-2">
          <Button v-for="tag in tags" :key="tag" size="sm" :variant="selectedTag === tag ? 'secondary' : 'outline'" class="rounded-full px-4 py-1.5 text-sm" @click="selectTag(tag)">
            {{ tag }}
          </Button>
        </div> -->
        <div class="relative min-h-[180px] max-h-[300px] overflow-y-auto flex-1 rounded-lg pr-1">
          <!-- 结果内容始终渲染，loading/empty 用绝对定位覆盖 -->
          <div v-if="loading || !hasResults" class="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-zinc-900/80">
            <span v-if="loading" class="text-zinc-400 text-base tracking-wide">加载中...</span>
            <span v-else class="text-zinc-400 text-base tracking-wide select-none">暂无结果</span>
          </div>
          <div v-show="!loading && hasResults" class="relative h-full">
            <div v-if="articles.length" class="mb-8">
              <TransitionGroup tag="div" class="block" appear @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
                <NuxtLink
                  v-for="(item, idx) in articles"
                  :key="item.id"
                  :to="`/post/${item.id}`"
                  class="search-result-item justify-start text-sm px-4 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all block"
                  :class="{ 'mb-3': idx !== articles.length - 1 }"
                >
                  {{ item.title }}
                </NuxtLink>
              </TransitionGroup>
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
