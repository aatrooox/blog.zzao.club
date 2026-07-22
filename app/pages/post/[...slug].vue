<script setup lang="ts">
import type { EffectCssAttrs, ExcludeClassList, IMG_WRAP_CLASS, PreCodeCssAttrs } from '@/config/richText'

definePageMeta({
  layout: false,
})

const appConfig = useAppConfig()
const toast = useGlobalToast()
const route = useRoute()
const curMdContentRef = useTemplateRef('curMdContentRef')
const articleWrap = useTemplateRef('articleWrap')
const activeTocId = ref('')

const { firstVisibleId } = useViewportHeadings({
  debug: true,
  rootMargin: '0px 0px -80% 0px',
})

const { formatDate } = useDayjs()

watch(firstVisibleId, (val) => {
  if (val) {
    activeTocId.value = val
  }
})

function _commentEnter(el) {
  animate(el, {
    opacity: '1',
    duration: 100,
    delay: 200,
    ease: 'inOut',
    onComplete: () => {
      animate('.page-operation-btn', {
        y: [
          { to: '-1.75rem', ease: 'outExpo', duration: 200 },
          { to: 0, ease: 'outBounce', duration: 200, delay: 150 },
        ],
        rotate: {
          from: '-1turn',
          delay: 0,
        },
        opacity: '1',
        duration: 400,
        delay: (_, i) => i * 50,
        ease: 'inOutCirc',
      })
    },
  })
}
function _commentBeforeEnter(el) {
  el.style.opacity = '0'
}

function _commentLeave(el, done) {
  animate(el, {
    scale: [1, 1.1, 1],
    opacity: '0',
    duration: 200,
    delay: 300,
    ease: 'inOut',
    onComplete: () => {
      done()
    },
  })
}

const adjacentPages = ref<any[]>([])
const _htmlCache = {}
const _styleValueCache = {}
let copyHTML = ``

const { data: page } = await usePageByPath(route.path)

if (!page.value) {
  throw createError({
    statusCode: 404,
    message: '页面不存在',
    fatal: true,
  })
}

useSeoMeta({
  title: page.value?.seo?.title,
  description: page.value?.seo?.description,
  ogTitle: page.value?.seo?.title,
  ogDescription: page.value?.seo?.description,
  ogImage: 'https://img.zzao.club/og-default.png',
  ogUrl: `https://blog.nezus.cn${route.path}`,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: page.value?.seo?.title,
  twitterDescription: page.value?.seo?.description,
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://blog.nezus.cn${route.path}`,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': page.value?.seo?.title || page.value?.title,
        'description': page.value?.seo?.description,
        'datePublished': page.value?.date,
        'dateModified': page.value?.lastmod || page.value?.date,
        'author': {
          '@type': 'Person',
          'name': 'Kairos',
          'url': 'https://blog.nezus.cn/about',
        },
        'publisher': {
          '@type': 'Organization',
          'name': '早早集市',
          'url': 'https://blog.nezus.cn',
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `https://blog.nezus.cn${route.path}`,
        },
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': '首页',
            'item': 'https://blog.nezus.cn/',
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': '文章',
            'item': 'https://blog.nezus.cn/article',
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': page.value?.seo?.title || page.value?.title,
          },
        ],
      }),
    },
  ],
})

const tocData = computed(() => {
  console.log('toc =>', page.value?.body?.toc?.links)
  return page.value?.body?.toc?.links
})

const isGroupedArticle = computed(() => !!page.value?.group)

const groupArticles = ref<any[]>([])

async function loadGroupArticles() {
  if (page.value?.group) {
    const topLevelGroup = page.value.group.split(':')[0]
    const { data } = await useGroupedPages()
    const allGroupedPages = data.value || []
    groupArticles.value = allGroupedPages.filter((p) => {
      return p.group?.startsWith(`${topLevelGroup}:`) || p.group === topLevelGroup
    })
  }
}

provide('groupArticles', groupArticles)
provide('tocData', tocData)
provide('activeTocId', activeTocId)

function getContentDom() {
  const articleDom: any = curMdContentRef.value
  const contentDom = articleDom && articleDom.childNodes[0]
  return contentDom
}
async function getInnerHTML() {
  const contentDom = getContentDom()
  const contentChildrens = contentDom.childNodes
  let articleOutHTML = `<section style="padding-left:12px; padding-right:12px;background-image: linear-gradient(90deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%), linear-gradient(360deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%);background-size: 20px 20px;">`
  contentChildrens.forEach((childDom) => {
    const childInnerHTMLWithInlineStyle = getOneDomCssStyle(childDom)
    articleOutHTML += childInnerHTMLWithInlineStyle
  })

  articleOutHTML += `</section>`
  copyHTML = articleOutHTML?.replaceAll('<div', '<section')?.replaceAll('</div>', '</section>')
  const data = new Blob([copyHTML], { type: 'text/html' })
  const data2 = new Blob([copyHTML], { type: 'text/plain' })
  const item = new ClipboardItem({ 'text/html': data, 'text/plain': data2 })
  await navigator.clipboard.write([item])

  toast.add({ message: '已复制HTML到剪贴板!' })
}

function getOneDomCssStyle(childDom, pointCssAttrs: string[] = []) {
  if (!childDom || childDom.nodeType === Node.COMMENT_NODE || childDom.tageName === 'BUTTON' || childDom.tageName === 'STYLE')
    return ''
  if (childDom.nodeType === Node.TEXT_NODE) {
    return childDom.nodeValue
  }

  console.log(`childDom.tageName `, childDom.tagName, childDom.nodeType)
  const classList = Array.from(childDom.classList)
  if (classList.some(item => ExcludeClassList.includes(item as string))) {
    return ''
  }

  if (checkDomIsImg(childDom)) {
    return getImgDomHTML(childDom)
  }
  const childNodes: Array<HTMLElement> = Array.from(childDom.childNodes)
  const tagName = childDom.tagName.toLowerCase()
  const childOutHTML = childDom.outerHTML
  const childInnerHTML = childDom.innerHTML

  let curCssStyles = {}
  let styleStrValue = ``

  if (childOutHTML && _htmlCache[childOutHTML]) {
    curCssStyles = _htmlCache[childOutHTML]
    styleStrValue = _styleValueCache[childOutHTML]
  }
  else {
    const computedCssStyles = getComputedStyle(childDom, null)
    const _effectCssAttrs = pointCssAttrs.length > 0 ? pointCssAttrs : EffectCssAttrs
    _effectCssAttrs.forEach((cssAttr) => {
      const value = computedCssStyles[cssAttr]
      if (value) {
        curCssStyles[cssAttr] = value
      }
    })

    _htmlCache[childOutHTML] = curCssStyles
    Object.entries(curCssStyles).forEach((value) => {
      const cssKey = value[0]
      const cssValue = value[1]
      styleStrValue += `${camelCaseToHyphen(cssKey)}:${cssValue};`
    })
    _styleValueCache[childOutHTML] = styleStrValue
  }
  let curDomAllHTML = `<${tagName} style="${styleStrValue}">`
  if (childNodes && childNodes.length > 0) {
    childNodes.forEach((child) => {
      const _pointCssAttrs: string[] = child.tagName === 'pre' ? PreCodeCssAttrs : []
      const childOwnHTML = getOneDomCssStyle(child, _pointCssAttrs)
      curDomAllHTML += childOwnHTML
    })
    curDomAllHTML += `</${tagName}>`
  }
  else {
    curDomAllHTML = `<${tagName} style="${styleStrValue}">${childInnerHTML}</${tagName}>`
  }

  return curDomAllHTML
}

function checkDomIsImg(dom: HTMLElement) {
  return Array.from(dom.classList)?.includes(IMG_WRAP_CLASS)
}
function getImgDomHTML(imgWrapDom) {
  const imgDom = findImgDom(imgWrapDom)
  return imgDom?.outerHTML
}

function findImgDom(dom?: HTMLElement | ChildNode): HTMLElement {
  const childDoms: ChildNode[] = Array.from(dom?.childNodes ?? []).filter((node: any) => node.nodeType === Node.ELEMENT_NODE)
  let imgDom = childDoms.find((node: any) => node.tagName.toLowerCase() === 'img')

  if (!imgDom && childDoms && childDoms.length > 0) {
    imgDom = findImgDom(childDoms?.[0])
  }

  return imgDom as HTMLElement
}

async function copyLink() {
  await navigator.clipboard.writeText(`https://blog.nezus.cn${route.fullPath}`)
  toast.add({ message: '已复制链接!' })
}

const { data: surroundingPages } = await useAsyncData('surrounding-page', () => {
  if (!page.value?.id)
    return []
  return queryCollectionItemSurroundings('content', route.path).order('date', 'DESC')
}, {
  watch: [() => page.value?.id, () => route.path],
})

watchEffect(() => {
  adjacentPages.value = surroundingPages.value || []
})

watchEffect(async () => {
  if (page.value?.id) {
    nextTick(() => {
      loadGroupArticles()
    })
  }
})
</script>

<template>
  <NuxtLayout :name="isGroupedArticle ? 'group-post-layout' : 'post-layout'">
    <div v-if="page" class="pb-10 m-auto">
      <div ref="articleWrap" class="site-content article-wrap relative w-full flex flex-col box-border">
        <header class="mb-8">
          <h1 class="text-left text-3xl md:text-4xl font-black tracking-tight leading-tight text-[var(--article-text)]">
            {{ page?.title }}
          </h1>

          <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--article-muted)] font-sans">
            <div class="flex items-center gap-2">
              <NuxtImg
                :src="page.author === 'Jinx' ? appConfig.jinx.avatar : appConfig.avatar"
                :alt="page.author === 'Jinx' ? appConfig.jinx.name : 'Kairos'"
                width="28"
                height="28"
                class="w-7 h-7 rounded-full object-cover shrink-0 opacity-90"
              />
              <span class="font-medium text-zinc-700 dark:text-zinc-300">
                {{ page.author === 'Jinx' ? appConfig.jinx.name : 'Kairos' }}
              </span>
            </div>
            <span class="text-zinc-300 dark:text-zinc-600" aria-hidden="true">·</span>
            <time class="tabular-nums" :datetime="page.date">{{ formatDate(page.date ?? '') }}</time>

            <ClientOnly>
              <div class="ml-auto flex items-center gap-1 text-zinc-400 dark:text-zinc-500">
                <button
                  type="button"
                  class="p-1.5 rounded-md hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="复制链接"
                  @click="copyLink"
                >
                  <Icon name="material-symbols:share-reviews-outline-rounded" class="w-4 h-4" />
                </button>
                <button
                  type="button"
                  class="p-1.5 rounded-md hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  data-umami-event="wx-copy-btn"
                  title="复制为微信公众号格式"
                  @click="getInnerHTML"
                >
                  <Icon name="icon-park-outline:wechat" class="w-4 h-4" />
                </button>
              </div>
            </ClientOnly>
          </div>

          <div v-if="page.tags && page.tags.length" class="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-sans">
            <span
              v-for="tag in page.tags"
              :key="tag"
              class="text-sm text-[var(--article-muted)]"
            >
              #{{ tag }}
            </span>
          </div>
        </header>

        <article ref="curMdContentRef" class="content-wrap article-reading w-full max-w-none p-0">
          <ContentRenderer :value="page?.body" class="max-w-full" />
        </article>

        <ClientOnly>
          <div v-if="adjacentPages.length" class="mt-12 font-sans">
            <div class="border-t border-zinc-200 dark:border-zinc-800 pt-6">
              <div class="flex justify-between gap-4 text-sm">
                <div class="flex-1 min-w-0 flex items-center gap-2">
                  <template v-if="adjacentPages[0]">
                    <Icon name="material-symbols:arrow-back-2-outline-rounded" class="shrink-0 opacity-50" size="1.25em" />
                    <NuxtLink
                      class="font-medium truncate text-zinc-700 dark:text-zinc-300 hover:text-[var(--article-text)] transition-colors"
                      :href="adjacentPages[0].path"
                    >
                      {{ adjacentPages[0].title }}
                    </NuxtLink>
                  </template>
                </div>
                <div class="flex-1 min-w-0 text-right flex items-center justify-end gap-2">
                  <template v-if="adjacentPages[1]">
                    <NuxtLink
                      class="font-medium truncate text-zinc-700 dark:text-zinc-300 hover:text-[var(--article-text)] transition-colors"
                      :href="adjacentPages[1].path"
                    >
                      {{ adjacentPages[1].title }}
                    </NuxtLink>
                    <Icon name="material-symbols:play-arrow-outline-rounded" class="shrink-0 opacity-50" size="1.25em" />
                  </template>
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>
  </NuxtLayout>
</template>
