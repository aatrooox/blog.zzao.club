<script lang="ts" setup>
defineProps<{
  tocData: any[]
}>()

const activeId = ref('')
const observer = ref()

const { onEnter, onBeforeEnter, onLeave } = useStaggeredListTransition('.toc-item')

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    const headings = document.querySelectorAll('.heading')
    observer.value = new IntersectionObserver((_entries) => {
      // 重新检查所有标题的可见性，而不仅仅是状态变化的标题
      const allHeadings = document.querySelectorAll('.heading')
      const visibleHeadings = Array.from(allHeadings)
        .map((heading) => {
          const rect = heading.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0
          return {
            id: heading.id,
            top: rect.top,
            isVisible,
          }
        })
        .filter(heading => heading.isVisible)
        .sort((a, b) => a.top - b.top) // 按照距离顶部的位置排序

      // 如果有可见的标题，选择最顶部的那个
      if (visibleHeadings.length > 0) {
        activeId.value = visibleHeadings[0]?.id || ''
      }
    })
    headings.forEach(heading => observer.value.observe(heading))
  }, 100)
})

onUnmounted(() => observer.value?.disconnect())
</script>

<template>
  <div
    class="pixel-toc"
    :style="{ width: tocData.length ? '200px' : '0' }"
  >
    <transition-group tag="ul" appear @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
      <template v-for="link in tocData" :key="link.id">
        <li
          class="pixel-toc-item" :class="[{ 'pixel-toc-active': link.id === activeId }]"
        >
          <span v-if="link.id === activeId" class="pixel-toc-indicator">#</span>
          <NuxtLink :href="`#${link.id}`" class="pixel-toc-link" :class="[link.id === activeId && 'pixel-toc-link-active']">
            {{ link.text }}
          </NuxtLink>
        </li>
        <template v-if="link.children">
          <template v-for="child in link.children" :key="child.id">
            <li
              class="pixel-toc-item pixel-toc-child" :class="[{ 'pixel-toc-active': child.id === activeId }]"
            >
              <span v-if="child.id === activeId" class="pixel-toc-indicator">#</span>
              <NuxtLink :href="`#${child.id}`" class="pixel-toc-link" :class="[child.id === activeId && 'pixel-toc-link-active']">
                {{ child.text }}
              </NuxtLink>
            </li>
          </template>
        </template>
      </template>
    </transition-group>
  </div>
</template>

<style scoped>
/* 像素风格目录容器 */
.pixel-toc {
  height: 500px;
  overflow-y: auto;
  box-sizing: border-box;
  background: var(--pixel-bg-secondary);
  border: 2px solid var(--pixel-border-primary);
  border-radius: 4px;
  padding: 8px;
  font-family: ui-monospace, monospace;
  box-shadow:
    2px 2px 0 var(--pixel-border-primary),
    4px 4px 0 var(--pixel-bg-tertiary);
}

/* 目录项基础样式 */
.pixel-toc-item {
  font-size: 14px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 4px 8px;
  margin: 2px 0;
  position: relative;
  border-radius: 2px;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 子级目录项缩进 */
.pixel-toc-child {
  padding-left: 24px;
}

/* 目录项悬停效果 */
/* .pixel-toc-item:hover {
  background: var(--pixel-bg-tertiary);
  border: 1px solid var(--pixel-border-secondary);
  box-shadow: 1px 1px 0 var(--pixel-border-secondary);
} */

/* 激活状态的目录项 */
.pixel-toc-active {
  background: var(--pixel-bg-quaternary);
  border: 1px solid var(--pixel-accent-cyan);
}

/* 激活指示器 */
.pixel-toc-indicator {
  color: var(--pixel-accent-cyan);
  font-weight: bold;
  font-size: 12px;
  text-shadow: 1px 1px 0 var(--pixel-shadow-primary);
  flex-shrink: 0;
}

/* 目录链接基础样式 */
.pixel-toc-link {
  color: var(--pixel-text-primary) !important;
  text-decoration: none !important;
  font-weight: 400;
  transition: all 0.15s ease;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: none;
}

/* 目录链接悬停效果 */
.pixel-toc-link:hover {
  color: var(--pixel-text-primary) !important;
  text-shadow: 0 0 4px var(--pixel-accent-cyan);
}

/* 激活状态的目录链接 */
.pixel-toc-link-active {
  color: var(--pixel-highlight-yellow) !important;
  font-weight: bold !important;
  text-shadow:
    0 0 6px var(--pixel-highlight-yellow),
    0 0 12px var(--pixel-highlight-yellow);
}

/* 滚动条样式 */
.pixel-toc::-webkit-scrollbar {
  width: 8px;
}

.pixel-toc::-webkit-scrollbar-track {
  background: var(--pixel-bg-primary);
  border-radius: 2px;
}

.pixel-toc::-webkit-scrollbar-thumb {
  background: var(--pixel-bg-quaternary);
  border-radius: 2px;
  border: 1px solid var(--pixel-border-secondary);
}

.pixel-toc::-webkit-scrollbar-thumb:hover {
  background: var(--pixel-text-disabled);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .pixel-toc {
    border-width: 1px;
    box-shadow: 1px 1px 0 var(--pixel-border-primary);
  }

  .pixel-toc-item {
    font-size: 13px;
    padding: 3px 6px;
  }

  .pixel-toc-child {
    padding-left: 18px;
  }
}
</style>
