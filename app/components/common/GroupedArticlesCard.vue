<script setup lang="ts">
import type { Page } from '~/components/common/PagePanel.vue'
import type { FlatGroup } from '~/composables/usePages'

const props = defineProps<{
  group: FlatGroup
}>()

const isExpanded = ref(false)
const { formatDate } = useDayjs()

// 堆叠效果:最多显示3篇文章的"叠层"
const stackCount = computed(() => Math.min(props.group.articles.length, 3))

// 构建层级结构用于展示
interface ArticleTreeNode {
  name: string
  articles: Page[]
  children: Map<string, ArticleTreeNode>
}

const articleTree = computed(() => {
  const root: ArticleTreeNode = {
    name: 'root',
    articles: [],
    children: new Map(),
  }

  props.group.articles.forEach((article) => {
    if (!article.group) {
      root.articles.push(article)
      return
    }

    const parts = article.group.split(':')
    // 跳过第一级（已经是 group 名称了）
    const subParts = parts.slice(1)

    if (subParts.length === 0) {
      // 直接属于一级分组的文章
      root.articles.push(article)
      return
    }

    let current = root
    subParts.forEach((part, index) => {
      if (!current.children.has(part)) {
        current.children.set(part, {
          name: part,
          articles: [],
          children: new Map(),
        })
      }
      current = current.children.get(part)!

      // 最后一级才添加文章
      if (index === subParts.length - 1) {
        current.articles.push(article)
      }
    })
  })

  return root
})

// 检查是否有子分组
const hasSubGroups = computed(() => articleTree.value.children.size > 0)
</script>

<template>
  <div class="relative group/stack cursor-pointer" @click="isExpanded = !isExpanded">
    <!-- 堆叠背景层 -->
    <div
      v-for="i in stackCount"
      :key="i"
      class="absolute inset-0 bg-gray-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-transform duration-300"
      :style="{
        transform: isExpanded
          ? 'none'
          : `translate(${(stackCount - i) * 4}px, ${(stackCount - i) * 4}px)`,
        zIndex: stackCount - i,
        opacity: 1 - (i - 1) * 0.15,
      }"
    />

    <!-- 主内容卡片 -->
    <div
      class="relative bg-white dark:bg-zinc-950 border-2 border-primary/20 rounded-lg p-4 transition-all duration-300 hover:border-primary"
      :style="{ zIndex: stackCount + 1 }"
    >
      <!-- 分组标题 -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <Icon name="pixelarticons:folder" class="text-primary" />
          <h3 class="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            {{ group.name }}
          </h3>
          <span class="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
            {{ group.articles.length }} 篇
          </span>
        </div>
        <Icon
          :name="isExpanded ? 'pixelarticons:chevron-up' : 'pixelarticons:chevron-down'"
          class="text-zinc-400 transition-transform"
        />
      </div>

      <!-- 折叠状态: 显示最新文章 + 子分组信息 -->
      <div v-if="!isExpanded" class="space-y-2">
        <div class="text-sm text-zinc-600 dark:text-zinc-400">
          最新: {{ group.articles[0]?.title }}
        </div>
        <!-- 显示子分组标签 -->
        <div v-if="hasSubGroups" class="flex flex-wrap gap-1.5">
          <span
            v-for="[name] in articleTree.children"
            :key="name"
            class="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded"
          >
            {{ name }}
          </span>
        </div>
      </div>

      <!-- 展开后的文章列表(层级显示) -->
      <div v-else class="space-y-3 mt-4">
        <!-- 一级分组直接的文章 -->
        <div v-if="articleTree.articles.length > 0" class="space-y-1">
          <NuxtLink
            v-for="article in articleTree.articles"
            :key="article.path"
            :to="article.path"
            class="block p-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            @click.stop
          >
            <div class="flex justify-between items-start gap-2">
              <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {{ article.title }}
              </span>
              <span class="text-xs text-zinc-400 shrink-0">
                {{ formatDate(article.date ?? '') }}
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- 子分组 -->
        <template v-for="[name, node] in articleTree.children" :key="name">
          <div class="border-l-2 border-zinc-200 dark:border-zinc-700 pl-3">
            <!-- 子分组标题 -->
            <div class="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
              <Icon name="pixelarticons:chevron-right" class="w-3 h-3" />
              {{ name }}
            </div>
            <!-- 子分组文章 -->
            <div class="space-y-1">
              <NuxtLink
                v-for="article in node.articles"
                :key="article.path"
                :to="article.path"
                class="block p-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                @click.stop
              >
                <div class="flex justify-between items-start gap-2">
                  <span class="text-sm text-zinc-600 dark:text-zinc-400">
                    {{ article.title }}
                  </span>
                  <span class="text-xs text-zinc-400 shrink-0">
                    {{ formatDate(article.date ?? '') }}
                  </span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
