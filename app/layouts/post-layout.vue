<script lang="ts" setup>
import { useSearch } from '~/composables/useSearch'

const { showSearchDialog } = useSearch()
const showScrollTopBtn = ref(false)

// 从slot中获取tocData(通过provide/inject)
const tocData = inject<any>('tocData', ref(null))
const activeTocId = inject<any>('activeTocId', ref(''))

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function smoothScrollTo(id: string) {
  const element = document.getElementById(id)
  if (element) {
    const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    })
  }
}
</script>

<template>
  <div class="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-900">
    <!-- Top Navigation -->
    <AppTopNav max-width-class="max-w-2xl" />

    <!-- Main Content Area - 带TOC的布局 -->
    <main class="flex-1 w-full mx-auto px-4 py-6 md:py-10">
      <div class="relative w-full max-w-7xl mx-auto">
        <div class="relative w-full max-w-2xl mx-auto">
          <!-- 中间:文章内容 -->
          <div class="relative w-full">
            <slot />
          </div>

          <!-- 右侧悬浮:TOC -->
          <ClientOnly>
            <div v-if="tocData && tocData.length" class="hidden xl:block absolute top-0 left-full ml-8 h-full">
              <div class="sticky top-24 w-[240px] max-h-[calc(100vh-8rem)] overflow-y-auto">
                <!-- Notion-style TOC -->
                <nav class="notion-toc">
                  <ul class="notion-toc-list">
                    <template v-for="link in tocData" :key="link.id">
                      <li class="notion-toc-item">
                        <a
                          :href="`#${link.id}`"
                          class="notion-toc-link" :class="[{ active: link.id === activeTocId }]"
                          @click.prevent="smoothScrollTo(link.id)"
                        >
                          <span class="notion-toc-text">{{ link.text }}</span>
                        </a>
                      </li>
                      <template v-if="link.children">
                        <li
                          v-for="child in link.children"
                          :key="child.id"
                          class="notion-toc-item notion-toc-child"
                        >
                          <a
                            :href="`#${child.id}`"
                            class="notion-toc-link" :class="[{ active: child.id === activeTocId }]"
                            @click.prevent="smoothScrollTo(child.id)"
                          >
                            <span class="notion-toc-text">{{ child.text }}</span>
                          </a>
                        </li>
                      </template>
                    </template>
                  </ul>
                </nav>
              </div>
            </div>
          </ClientOnly>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Bottom Navigation (Mobile) -->
    <AppBottomNav />

    <!-- Scroll to Top Button -->
    <div
      v-if="showScrollTopBtn"
      class="fixed right-6 bottom-24 md:bottom-10 z-40 bg-white border border-zinc-200 shadow-lg rounded-full p-3 cursor-pointer hover:bg-zinc-50 transition-all"
      @click="scrollToTop"
    >
      <Icon name="pixelarticons:arrow-up" class="w-6 h-6 text-zinc-600" />
    </div>

    <!-- Global Search Dialog -->
    <ResourceSearchDialog v-model="showSearchDialog" />

    <!-- Background Decoration (Optional, simplified) -->
    <div
      class="fixed inset-0 -z-10 pointer-events-none opacity-[0.03]"
      style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 24px 24px;"
    />
  </div>
</template>

<style scoped>
/* Notion-style TOC Styles */
.notion-toc {
  padding: 0.5rem 0;
}

.notion-toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
}

.notion-toc-item {
  margin: 0;
  position: relative;
}

.notion-toc-link {
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgb(161 161 170);
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  position: relative;
  border-left: 2px solid transparent;
  margin-left: -2px;
}

.dark .notion-toc-link {
  color: rgb(161 161 170);
}

.notion-toc-link:hover {
  color: rgb(113 113 122);
  background-color: rgb(244 244 245);
}

.dark .notion-toc-link:hover {
  color: rgb(212 212 216);
  background-color: rgb(39 39 42);
}

.notion-toc-link.active {
  color: hsl(142 32% 32%);
  background-color: rgb(240 253 244);
  font-weight: 500;
  border-left-color: hsl(142 32% 32%);
}

.dark .notion-toc-link.active {
  color: hsl(142 45% 55%);
  background-color: rgba(34 197 94 / 0.1);
  border-left-color: hsl(142 45% 55%);
}

.notion-toc-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notion-toc-child .notion-toc-link {
  padding-left: 1.5rem;
  font-size: 0.8125rem;
}
</style>
