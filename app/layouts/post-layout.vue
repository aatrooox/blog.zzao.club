<script lang="ts" setup>
import { useSearch } from '~/composables/useSearch'

const { showSearchDialog } = useSearch()

const tocData = inject<any>('tocData', ref(null))
const activeTocId = inject<any>('activeTocId', ref(''))

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

function isSectionOpen(link: { id: string, children?: { id: string }[] }) {
  if (!link.children?.length)
    return false
  if (link.id === activeTocId.value)
    return true
  return link.children.some(child => child.id === activeTocId.value)
}
</script>

<template>
  <div class="min-h-screen bg-[oklch(0.985_0.005_100)] dark:bg-zinc-950 flex flex-col font-sans text-zinc-900 dark:text-zinc-50">
    <div class="decorative-top-line" />
    <div class="decorative-edge-glow decorative-edge-glow-left" />
    <div class="decorative-edge-glow decorative-edge-glow-right" />

    <main class="flex-1 w-full mx-auto px-4 py-8 md:py-12">
      <div class="relative w-full max-w-7xl mx-auto">
        <div class="relative w-full max-w-[var(--article-measure,40rem)] mx-auto">
          <!-- 与列表页同一套 LOGO + 导航，无扩展区 -->
          <SiteHeader variant="minimal" />
          <!-- TOC 相对正文定位，避免顶到 SiteHeader 上方 -->
          <div class="relative w-full">
            <slot />

            <ClientOnly>
              <div
                v-if="tocData && tocData.length"
                class="hidden lg:block absolute top-0 left-full ml-10 h-full w-[min(220px,calc((100vw-var(--article-measure,40rem))/2-3rem))]"
              >
                <div class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pt-1">
                  <nav class="reading-toc" aria-label="文章目录">
                    <ul class="reading-toc-list">
                      <li
                        v-for="link in tocData"
                        :key="link.id"
                        class="reading-toc-item"
                        :class="{ 'is-open': isSectionOpen(link) }"
                      >
                        <a
                          :href="`#${link.id}`"
                          class="reading-toc-link"
                          :class="{ active: link.id === activeTocId }"
                          @click.prevent="smoothScrollTo(link.id)"
                        >
                          <span class="reading-toc-text">{{ link.text }}</span>
                        </a>
                        <ul v-if="link.children?.length" class="reading-toc-children reading-toc-list">
                          <li
                            v-for="child in link.children"
                            :key="child.id"
                            class="reading-toc-item reading-toc-child"
                          >
                            <a
                              :href="`#${child.id}`"
                              class="reading-toc-link"
                              :class="{ active: child.id === activeTocId }"
                              @click.prevent="smoothScrollTo(child.id)"
                            >
                              <span class="reading-toc-text">{{ child.text }}</span>
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </main>

    <ScrollTopButton />
    <AppFooter />
    <AppBottomNav />
    <ResourceSearchDialog v-model="showSearchDialog" />

    <div
      class="fixed inset-0 -z-10 pointer-events-none opacity-[0.025]"
      style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 24px 24px;"
    />
  </div>
</template>
