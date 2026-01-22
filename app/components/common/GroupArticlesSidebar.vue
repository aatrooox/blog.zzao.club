<script setup lang="ts">
import type { Page } from '~/components/common/PagePanel.vue'

const props = defineProps<{
  articles: Page[]
  currentPath: string
}>()

// 构建层级结构
interface GroupTreeNode {
  name: string
  fullPath: string
  articles: Page[]
  children: Map<string, GroupTreeNode>
}

const groupTree = computed(() => {
  const root: GroupTreeNode = {
    name: 'root',
    fullPath: '',
    articles: [],
    children: new Map(),
  }

  props.articles.forEach((article) => {
    if (!article.group) {
      root.articles.push(article)
      return
    }

    const parts = article.group.split(':')
    let current = root
    let path = ''

    parts.forEach((part, index) => {
      path = path ? `${path}:${part}` : part

      if (!current.children.has(part)) {
        current.children.set(part, {
          name: part,
          fullPath: path,
          articles: [],
          children: new Map(),
        })
      }

      current = current.children.get(part)!

      // 叶子节点才添加文章
      if (index === parts.length - 1) {
        current.articles.push(article)
      }
    })
  })

  return root
})
</script>

<template>
  <!-- 悬浮侧边栏容器 - 与 TOC 布局对称 -->
  <div class="hidden lg:block absolute top-0 right-full mr-8 h-full">
    <div class="sticky top-24 w-[240px] max-h-[calc(100vh-8rem)] overflow-y-auto group-sidebar">
      <!-- 侧边栏标题 -->
      <div class="mb-3 px-3">
        <h2 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          系列文章
        </h2>
      </div>

      <!-- 文章列表 -->
      <nav class="space-y-0.5">
        <!-- 递归渲染层级结构 -->
        <template v-for="[_, node] in groupTree.children" :key="node.fullPath">
          <!-- 一级分组标题 -->
          <div class="mb-3">
            <div class="px-3 py-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {{ node.name }}
            </div>
            
            <!-- 一级分组直接的文章 -->
            <div v-if="node.articles.length > 0" class="space-y-0.5 mb-2">
              <NuxtLink
                v-for="article in node.articles"
                :key="article.path"
                :to="article.path"
                class="group-sidebar-link"
                :class="[
                  article.path === currentPath 
                    ? 'group-sidebar-link-active' 
                    : ''
                ]"
              >
                <span class="group-sidebar-text">{{ article.title }}</span>
              </NuxtLink>
            </div>

            <!-- 二级子分组 -->
            <template v-for="[_, childNode] in node.children" :key="childNode.fullPath">
              <div class="mb-2">
                <div class="px-3 py-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                  {{ childNode.name }}
                </div>
                <div class="space-y-0.5">
                  <NuxtLink
                    v-for="article in childNode.articles"
                    :key="article.path"
                    :to="article.path"
                    class="group-sidebar-link group-sidebar-link-nested"
                    :class="[
                      article.path === currentPath 
                        ? 'group-sidebar-link-active' 
                        : ''
                    ]"
                  >
                    <span class="group-sidebar-text">{{ article.title }}</span>
                  </NuxtLink>
                </div>
              </div>
            </template>
          </div>
        </template>
      </nav>
    </div>
  </div>
</template>

<style scoped>
/* 侧边栏链接样式 - 与 TOC 一致 */
.group-sidebar-link {
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem; /* 13px - 比 TOC 稍小 */
  line-height: 1.4;
  color: rgb(161 161 170); /* text-zinc-400 */
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  position: relative;
  border-left: 2px solid transparent;
  margin-left: -2px;
}

/* 嵌套链接缩进 */
.group-sidebar-link-nested {
  padding-left: 1.5rem;
  font-size: 0.75rem; /* 12px */
}

/* Dark mode */
.dark .group-sidebar-link {
  color: rgb(161 161 170);
}

/* Hover state */
.group-sidebar-link:hover {
  color: rgb(113 113 122);
  background-color: rgb(244 244 245);
}

.dark .group-sidebar-link:hover {
  color: rgb(212 212 216);
  background-color: rgb(39 39 42);
}

/* Active state - 与 TOC 完全一致 */
.group-sidebar-link-active {
  color: hsl(142 32% 32%) !important;
  background-color: rgb(240 253 244) !important;
  font-weight: 500;
  border-left-color: hsl(142 32% 32%) !important;
}

.dark .group-sidebar-link-active {
  color: hsl(142 45% 55%) !important;
  background-color: rgba(34 197 94 / 0.1) !important;
  border-left-color: hsl(142 45% 55%) !important;
}

/* Text ellipsis */
.group-sidebar-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
