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

/** 顶部固定展示的系列名（一级 group） */
const seriesTitle = computed(() => {
  const nodes = [...groupTree.value.children.values()]
  if (nodes.length === 1)
    return nodes[0]!.name
  if (nodes.length > 1)
    return nodes.map(n => n.name).join(' · ')
  return ''
})

/** 仅一个一级系列时，系列名已在顶栏，列表里不再重复 */
const singleSeries = computed(() => groupTree.value.children.size === 1)
</script>

<template>
  <!--
    使用 fixed 锚定视口，避免 sticky 受正文容器高度限制：
    滑到 footer 时正文父级离开视口，sticky 侧栏会被整块带走。
  -->
  <aside
    class="group-sidebar-rail group-sidebar hidden lg:flex flex-col"
    aria-label="系列文章"
  >
    <!-- 固定顶栏：系列文章 + 系列名，不随列表滚动 -->
    <div class="shrink-0 px-3 pb-3 mb-2 border-b border-zinc-100 dark:border-zinc-800">
      <h2 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        系列文章
      </h2>
      <p
        v-if="seriesTitle"
        class="mt-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider truncate"
        :title="seriesTitle"
      >
        {{ seriesTitle }}
      </p>
    </div>

    <!-- 仅标题列表可滚动 -->
    <nav class="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-0.5 pr-0.5">
      <template v-for="[key, node] in groupTree.children" :key="node.fullPath || key">
        <div class="mb-3">
          <!-- 多系列时在列表里保留一级名；单系列已在顶栏展示 -->
          <div
            v-if="!singleSeries"
            class="px-3 py-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
          >
            {{ node.name }}
          </div>

          <div v-if="node.articles.length > 0" class="space-y-0.5 mb-2">
            <NuxtLink
              v-for="article in node.articles"
              :key="article.path"
              :to="article.path"
              class="group-sidebar-link"
              :class="[
                article.path === currentPath
                  ? 'group-sidebar-link-active'
                  : '',
              ]"
            >
              <span class="group-sidebar-text">{{ article.title }}</span>
            </NuxtLink>
          </div>

          <template v-for="[childKey, childNode] in node.children" :key="childNode.fullPath || childKey">
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
                      : '',
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
  </aside>
</template>

<style scoped>
/* 视口固定：贴在正文列左侧，不随页面滚到 footer 时被带走 */
.group-sidebar-rail {
  position: fixed;
  top: 2rem;
  z-index: 20;
  width: 240px;
  max-height: calc(100vh - 4rem);
  /* 正文列左缘 ≈ 50% - measure/2；再留 2rem 间距 + 240px 自身宽度 */
  left: max(
    0.75rem,
    calc(50% - var(--article-measure, 40rem) / 2 - 2rem - 240px)
  );
}

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

/* Active state - 与 TOC 完全一致，走全局 --primary */
.group-sidebar-link-active {
  color: var(--primary) !important;
  background-color: color-mix(in oklab, var(--primary) 10%, transparent) !important;
  font-weight: 500;
  border-left-color: var(--primary) !important;
}

.dark .group-sidebar-link-active {
  color: var(--primary) !important;
  background-color: color-mix(in oklab, var(--primary) 15%, transparent) !important;
  border-left-color: var(--primary) !important;
}

/* Text ellipsis */
.group-sidebar-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
