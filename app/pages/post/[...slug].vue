<script setup lang="ts">
import type { CommentData } from '@nuxtjs/mdc'
import type { Visitor } from '~~/types/blog'
import type { BlogCommentWithUserInfo } from '~~/types/blog-drizzle'
import type { ApiResponse } from '~~/types/fetch'
import type { Page } from '~/components/common/PagePanel.vue'
import { camelCaseToHyphen, EffectCssAttrs, ExcludeClassList, IMG_WRAP_CLASS, PreCodeCssAttrs } from '@/config/richText'

definePageMeta({
  layout: false, // 手动控制布局
})

const toast = useGlobalToast()
const { $api } = useNuxtApp()
const userStore = useUser()
// const navBarStore = useNavBar()
// const clientjs = useClientjs()
const route = useRoute()
const curMdContentRef = useTemplateRef('curMdContentRef')
const articleWrap = useTemplateRef('articleWrap')
// const tocContainer = useTemplateRef('tocContainer')
// const titleRef = useTemplateRef('titleRef')
const activeTocId = ref('')
// const actionContainer = useTemplateRef('actionContainer')
const selectedText = ref()
const { text } = useTextSelection()
// const isTocFixed = ref(false)

// 使用吸顶组合式函数
// const { isSticky: _isTitleSticky } = useSticky(titleRef, {
//   topOffset: 0, // 吸顶到页面顶部
//   triggerOffset: 24, // 额外的触发偏移
//   debug: true, // 启用调试日志
// })

// 使用视口元素检测组合式函数
const { firstVisibleId, visibleIds: _visibleIds, refresh: _refreshViewport } = useViewportHeadings({
  debug: true, // 启用调试日志
  rootMargin: '0px 0px -80% 0px', // 当标题进入视口前20%时触发
})

const { formatDate } = useDayjs()

watch(firstVisibleId, (val) => {
  if (val) {
    activeTocId.value = val
  }
})
const likeCount = ref(0)
const isLiked = ref(false)
const comments = ref<BlogCommentWithUserInfo[]>([])
const isDefer = ref(true)
const isOpenDrawer = ref(false)

// const commentIconPosition = computed(() => {
//   if (text.value.trim().length) {
//     // 发生划词时，记录当前划线的滚动距离
//     if (navBarStore.selectionScrollY.value === 0) {
//       navBarStore.setSelectionScrollY(navBarStore.scrollY.value)
//     }
//     let left = -50
//     if (selection?.value) {
//       const range = selection?.value?.getRangeAt(0)
//       if (range) {
//         const startNode = range.startContainer
//         const endNode = range.endContainer
//         const targetElement = curMdContentRef.value
//         // 判断选中的文本是否完全包含在目标元素内
//         if (targetElement && targetElement?.contains(startNode) && targetElement?.contains(endNode)) {
//           const rectList = range.getClientRects()

//           // selectedText.value = serializeSelection(text.value)

//           if (rectList.length > 0) {
//             const firstRect = rectList[0]
//             const containerRect = articleWrap.value?.getBoundingClientRect()
//             const rectLeft = firstRect?.left ?? window.scrollX
//             if (containerRect) {
//               left = rectLeft - containerRect.left
//             }
//             else {
//               left = rectLeft + window.scrollX
//             }
//           }
//         }
//         else {
//           return {
//             top: 0,
//             left: 0,
//           }
//         }
//       }
//     }

//     return {
//       top: (rects?.value?.[0]?.top || 0) - 50 + navBarStore.selectionScrollY.value + (rects?.value?.[0]?.height || 0),
//       left,
//     }
//   }
//   else {
//     navBarStore.setSelectionScrollY(0)
//     return {
//       top: 0,
//       left: 0,
//     }
//   }
// })

watch(
  () => text.value,
  (newText) => {
    if (newText?.trim()) {
      selectedText.value = serializeSelection(newText)
    }
  },
)

function commentEnter(el) {
  animate(el, {
    // scale: [0.5, 1, 1.5, 1],
    opacity: '1',
    duration: 100,
    delay: 200,
    ease: 'inOut',
    onComplete: () => {
      animate('.page-operation-btn', {
        // scale: [0.5, 1, 1.5, 1],
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
        onComplete: () => {

        },
      })
    },
  })
}
function commentBeforeEnter(el) {
  el.style.opacity = '0'
}

function commentLeave(el, done) {
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

// function handleCommentPragph() {
//   console.log('评论段落', selectedText.value)
// }
// 选中时及时保存当前文字
function serializeSelection(text?: string) {
  if (!text)
    return {}
  return {
    text,
  }
}

const adjacentPages = ref<any[]>([])
const _htmlCache = {}
const _styleValueCache = {}
let copyHTML = ``

const { data: page, pending: _pending, refresh: _refresh, error: _error } = await usePageByPath(route.path)

useSeoMeta({
  title: page.value?.seo?.title,
  description: page.value?.seo?.description,
  ogTitle: page.value?.seo?.title,
  ogDescription: page.value?.seo?.description,
  ogImage: 'https://img.zzao.club/og-default.png',
  ogUrl: `https://zzao.club${route.path}`,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: page.value?.seo?.title,
  twitterDescription: page.value?.seo?.description,
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://zzao.club${route.path}`,
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
          'name': 'Aatrox',
          'url': 'https://zzao.club/about',
        },
        'publisher': {
          '@type': 'Organization',
          'name': '早早集市',
          'url': 'https://zzao.club',
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `https://zzao.club${route.path}`,
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
            'item': 'https://zzao.club/',
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': '文章',
            'item': 'https://zzao.club/article',
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

watch(() => page, (val) => {
  if (!val) {
    console.log(page.value)
    throw createError({
      statusCode: 404,
      message: '页面不存在',
      fatal: true,
    })
  }
})

const tocData = computed(() => {
  console.log('toc =>', page.value?.body?.toc?.links)
  return page.value?.body?.toc?.links
})

// 新增:判断是否为分组文章
const isGroupedArticle = computed(() => !!page.value?.group)

// 新增:获取同组文章（一级分组下的所有文章）
const groupArticles = ref<Page[]>([])

async function loadGroupArticles() {
  if (page.value?.group) {
    // 提取一级分组名（冒号前的部分）
    const topLevelGroup = page.value.group.split(':')[0]

    // 获取所有带分组的文章
    const { data } = await useGroupedPages()
    const allGroupedPages = data.value || []

    // 筛选出属于同一个一级分组的所有文章
    groupArticles.value = allGroupedPages.filter((p) => {
      return p.group?.startsWith(`${topLevelGroup}:`) || p.group === topLevelGroup
    })
  }
}

// Provide 数据给布局使用
provide('groupArticles', groupArticles)
provide('tocData', tocData)
provide('activeTocId', activeTocId)

function getContentDom() {
  const articleDom: any = curMdContentRef.value
  // 默认内部会套一层div
  const contentDom = articleDom && articleDom.childNodes[0]
  return contentDom
}
async function getInnerHTML() {
  // 获取内容区域的父级div
  const contentDom = getContentDom()
  const contentChildrens = contentDom.childNodes
  let articleOutHTML = `<section style="padding-left:12px; padding-right:12px;background-image: linear-gradient(90deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%), linear-gradient(360deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%);background-size: 20px 20px;">`
  contentChildrens.forEach((childDom) => {
    const childInnerHTMLWithInlineStyle = getOneDomCssStyle(childDom)
    articleOutHTML += childInnerHTMLWithInlineStyle
  })

  articleOutHTML += `</section>`
  // 微信不支持div, 用section代替
  copyHTML = articleOutHTML?.replaceAll('<div', '<section')?.replaceAll('</div>', '</section>')
  const data = new Blob([copyHTML], { type: 'text/html' })
  const data2 = new Blob([copyHTML], { type: 'text/plain' })
  const item = new ClipboardItem({ 'text/html': data, 'text/plain': data2 })
  await navigator.clipboard.write([item])

  toast.add({ message: '已复制HTML到剪贴板!' })
}

/**
 *
 * @param childDom dom元素
 * @param pointCssAttrs 关键css 传入此值将忽略其他属性
 */
function getOneDomCssStyle(childDom, pointCssAttrs: string[] = []) {
  // 如果不存在，或是注释部分，则返回空字符串
  // 忽略掉button
  if (!childDom || childDom.nodeType === Node.COMMENT_NODE || childDom.tageName === 'BUTTON' || childDom.tageName === 'STYLE')
    return ''
  // 文本节点， 直接返回文本
  if (childDom.nodeType === Node.TEXT_NODE) {
    return childDom.nodeValue
  }

  console.log(`childDom.tageName `, childDom.tagName, childDom.nodeType)
  const classList = Array.from(childDom.classList)
  // 如果元素的class在excludeClassList中，则忽略掉此元素， 一般是一些辅助类的元素
  if (classList.some(item => ExcludeClassList.includes(item as string))) {
    return ''
  }

  // 特殊处理一下img元素
  if (checkDomIsImg(childDom)) {
    return getImgDomHTML(childDom)
  }
  // 如果有子元素, 需要递归处理
  const childNodes: Array<HTMLElement> = Array.from(childDom.childNodes)
  const tagName = childDom.tagName.toLowerCase()
  const childOutHTML = childDom.outerHTML
  const childInnerHTML = childDom.innerHTML

  let curCssStyles = {}
  let styleStrValue = ``

  // 获取当前dom的所有样式
  // 如果有缓存，直接使用缓存
  // htmlcache key相同 意味着元素完全一致
  if (childOutHTML && _htmlCache[childOutHTML]) {
    curCssStyles = _htmlCache[childOutHTML]
    styleStrValue = _styleValueCache[childOutHTML]
  }
  else {
    // 没缓存, 获取对应的css
    const computedCssStyles = getComputedStyle(childDom, null)
    // console.log(`computedCssStyles`, computedCssStyles)
    const _effectCssAttrs = pointCssAttrs.length > 0 ? pointCssAttrs : EffectCssAttrs
    _effectCssAttrs.forEach((cssAttr) => {
      const value = computedCssStyles[cssAttr]
      if (value) {
        curCssStyles[cssAttr] = value
      }
    })

    // 设置缓存, 如果存在相同html, 则直接使用缓存
    _htmlCache[childOutHTML] = curCssStyles
    // 组装style字符串
    Object.entries(curCssStyles).forEach((value) => {
      const cssKey = value[0]
      const cssValue = value[1]
      styleStrValue += `${camelCaseToHyphen(cssKey)}:${cssValue};`
    })
    // 组装后的字符串缓存, 如果存在相同html, 则直接使用缓存
    _styleValueCache[childOutHTML] = styleStrValue
  }
  // DOM的前半截
  let curDomAllHTML = `<${tagName} style="${styleStrValue}">`
  // 如果存在子元素, 还需要递归处理子元素
  if (childNodes && childNodes.length > 0) {
    childNodes.forEach((child) => {
      const _pointCssAttrs: string[] = child.tagName === 'pre' ? PreCodeCssAttrs : []
      const childOwnHTML = getOneDomCssStyle(child, _pointCssAttrs)
      curDomAllHTML += childOwnHTML
    })
    curDomAllHTML += `</${tagName}>`
  }
  else {
    // 不存在子元素, 直接闭合标签
    curDomAllHTML = `<${tagName} style="${styleStrValue}">${childInnerHTML}</${tagName}>`
  }

  return curDomAllHTML
}

/**
 * 检测当前dom是不是包裹img，一般都需要特殊处理
 * @param dom dom元素
 */
function checkDomIsImg(dom: HTMLElement) {
  return Array.from(dom.classList)?.includes(IMG_WRAP_CLASS)
}
/**
 * 在imgWrapDom中提取到img html字符串
 * @param imgWrapDom
 */
function getImgDomHTML(imgWrapDom) {
  // console.log(`imgWrapDom`, imgWrapDom)
  // imgWrapDom
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
  await navigator.clipboard.writeText(`https://zzao.club${route.fullPath}`)
  toast.add({ message: '已复制链接!' })
}
async function createComment(data: CommentData) {
  if (!userStore.user.value.id) {
    await createVistorID(data.visitor as Visitor)
  }
  const res = await $api.post<ApiResponse>('/api/v1/comment/create', {
    article_id: page.value?.id,
    content: data.content,
    user_id: userStore.user.value.id,
    path: `https://zzao.club${route.fullPath}`,
  })

  if (!res.error) {
    toast.add({ type: 'success', message: '评论成功' })
    // umami.track('comment', { page: page.value?.id, isOk: true })
    initComment()
  }
}
// async function likePage() {
//   console.log(page)
//   // 游客点赞 生成指纹 -> 注册为游客 (随机用户名 + 固定id)
//   if (!userStore.user.value.id) {
//     await createVistorID()
//     // const res = await $api.post<ApiResponse<LoginResponse>>('/api/v1/user/visitor/regist', { visitorId: clientjs.getVisitorId() })
//     // const { user, accessToken, refreshToken, accessExpiresAt, refreshExpiresAt } = res.data

//     // userStore.setUser(user)
//     // userStore.setTokenInfo({
//     //   accessToken,
//     //   refreshToken,
//     //   accessExpiresAt,
//     //   refreshExpiresAt,
//     // })
//     // return toast.add({ type: 'warning', message: '登录后才能点赞' })
//   };

//   if (isLiked.value) {
//     return toast.warn('已经点过赞了')
//   };

//   const res = await $api.post<ApiResponse>('/api/v1/like/create', { article_id: page.value?.id, user_id: userStore.user.value.id })

//   if (!res.error) {
//     toast.success('感谢支持！')
//     umami.track('like', { page: page.value?.id, isOk: true })
//     initLikeCount()
//   }
// }

async function initComment() {
  const res = await $api.get<ApiResponse<any>>('/api/v1/comment/list', { article_id: page.value?.id })
  if (!res.error) {
    comments.value = res.data
  }
  isDefer.value = false
}

async function initLikeCount() {
  const res = await $api.get<ApiResponse<any>>('/api/v1/like/count', { article_id: page.value?.id, user_id: userStore.user.value.id })
  if (!res.error) {
    likeCount.value = res.data.count
    isLiked.value = res.data.isLiked
  }
}

// const formatCommentCount = computed(() => {
//   let count = comments.value.length
//   comments.value.forEach((item) => {
//     count += (item._count?.sub_comments ?? 0)
//   })
//   if (count > 99)
//     return '99+'
//   return count
// })

async function getSurroundingPage() {
  // const paths = route.path.split('/').filter(Boolean)
  // console.log(`paths`, route.path)
  const { data } = await useAsyncData(page.value?.id || 'surrounding-page', () => {
    return queryCollectionItemSurroundings('content', route.path).order('date', 'DESC')
  })

  console.log(`data`, data.value)
  adjacentPages.value = data.value || []
}
function handleSubmitExplain() {
  isOpenDrawer.value = false
  initExplain()
}
// 初始化注释内容
async function initExplain() {
  const res = await $api.get<ApiResponse>(`/api/v1/explain?id=${encodeURIComponent(page.value?.id ?? '')}`)
  if (!res.error) {
    const explains = res.data
    const container = curMdContentRef.value
    processArticleContent(explains, container)
  }
}

// 处理文章内容，查找并标记注解
function processArticleContent(explains, container) {
  // 获取所有文本节点
  const textNodes = getAllTextNodes(container)

  // 对每个注解进行处理
  explains.forEach((annotation) => {
    const searchText = annotation.text

    // 在所有文本节点中查找匹配
    textNodes.forEach((node) => {
      const parent = node.parentNode
      const content = node.textContent

      // 如果文本节点包含注解文本
      if (content.includes(searchText)) {
        // 分割文本节点
        const parts = content.split(searchText)

        // 创建文档片段
        const fragment = document.createDocumentFragment()

        // 添加第一部分文本
        if (parts[0]) {
          fragment.appendChild(document.createTextNode(parts[0]))
        }

        // 创建注解元素
        const annotatedSpan = document.createElement('span')
        annotatedSpan.className = 'highlight-explain-selection'
        annotatedSpan.textContent = searchText

        // 创建提示气泡
        const tooltip = document.createElement('div')
        tooltip.className = 'explain-tooltip'

        // 添加注解内容
        const annotationItem = document.createElement('div')
        annotationItem.className = 'explain-content'
        annotationItem.textContent = annotation.content
        tooltip.appendChild(annotationItem)

        // 将气泡添加到注解元素
        annotatedSpan.appendChild(tooltip)
        fragment.appendChild(annotatedSpan)

        // 添加剩余部分文本
        for (let i = 1; i < parts.length; i++) {
          if (i > 1) {
            // 如果有多个匹配，添加注解文本
            const repeatAnnotatedSpan = annotatedSpan.cloneNode(true)
            fragment.appendChild(repeatAnnotatedSpan)
          }
          if (parts[i]) {
            fragment.appendChild(document.createTextNode(parts[i]))
          }
        }

        // 替换原始节点
        parent && parent.replaceChild(fragment, node)
      }
    })
  })
}

// 获取元素内的所有文本节点
function getAllTextNodes(element) {
  const textNodes: any[] = []

  // 递归函数获取所有文本节点
  function getTextNodes(node) {
    if (!node)
      return
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node)
    }
    else {
      const children = node.childNodes
      for (let i = 0; i < children.length; i++) {
        getTextNodes(children[i])
      }
    }
  }

  getTextNodes(element)
  return textNodes
}
// TOC滚动监听
// function handleTocScroll() {
//   if (!tocContainer.value)
//     return

//   const scrollTop = window.pageYOffset || document.documentElement.scrollTop
//   const tocOffset = tocContainer.value.offsetTop
//   const headerHeight = 80 // 固定标题栏高度

//   // 当滚动距离超过TOC容器位置减去标题栏高度时，启用固定定位
//   isTocFixed.value = scrollTop > (tocOffset - headerHeight)
// }
// 统一的滚动处理函数
// function handleScroll() {
//   handleTocScroll()
// }

// onMounted(() => {
//   // 添加滚动监听（仅用于 TOC）
//   window.addEventListener('scroll', handleScroll, { passive: true })
// })

// onUnmounted(() => {
//   // 移除滚动监听
//   window.removeEventListener('scroll', handleScroll)
// })

// Smooth scroll to heading
// function smoothScrollTo(id: string) {
//   const element = document.getElementById(id)
//   if (element) {
//     const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100
//     window.scrollTo({
//       top: offsetTop,
//       behavior: 'smooth',
//     })
//   }
// }

watchEffect(async () => {
  if (page.value?.id) {
    nextTick(() => {
      initComment()
      initLikeCount()
      getSurroundingPage()
      initExplain()
      loadGroupArticles() // 加载分组文章
    })
  }
})
</script>

<template>
  <NuxtLayout :name="isGroupedArticle ? 'group-post-layout' : 'post-layout'">
    <div v-if="page" class="pb-10 m-auto mb-4">
      <div ref="articleWrap" class="article-wrap relative w-full flex flex-col box-border my-6">
        <!-- 悬浮标题栏 -->
        <h1
          class="text-left text-2xl font-bold title-normal transition-all duration-150 ease-out"
        >
          {{ page?.title }}
        </h1>
        <ClientOnly>
          <div class="article-actions flex gap-8 justify-start text-sm text-zinc-500 py-2">
            <div>{{ formatDate(page.date ?? '') }}</div>
            <!-- <div class="flex items-center cursor-pointer gap-1.5">
                <Icon name="icon-park-outline:thumbs-up" class="" @click="likePage" />
                <span class=" ">{{ likeCount }}</span>
              </div>
              <div class="cursor-pointer">
                <NuxtLink href="#评论区" class="flex items-center gap-1.5">
                  <Icon name="icon-park-outline:comments" class="" />
                  <span class="  ">{{ formatCommentCount }}</span>
                </NuxtLink>
              </div> -->
            <div class="flex items-center cursor-pointer" @click="copyLink">
              <Icon name="material-symbols:share-reviews-outline-rounded" class="" />
            </div>
            <div class="flex items-center cursor-pointer" data-umami-event="wx-copy-btn" @click="getInnerHTML">
              <Icon name="icon-park-outline:wechat" class="" />
            </div>
          </div>
        </ClientOnly>
        <!-- 文章内容 markdown -->
        <article ref="curMdContentRef" class="content-wrap prose prose-zinc prose-base max-w-none p-0 w-full">
          <ContentRenderer :value="page?.body" class="max-w-full" />
        </article>
        <!-- 相邻的文章 -->
        <ClientOnly>
          <div v-if="adjacentPages.length">
            <!-- <Separator class="my-4" label="END" /> -->
            <div class="bg-primary/5 dark:bg-zinc-900 rounded-lg p-4 md:p-6">
              <div class="flex justify-between text-sm md:text-base ">
                <div class="flex-1 flex items-center gap-2">
                  <template v-if="adjacentPages[0]">
                    <Icon name="material-symbols:arrow-back-2-outline-rounded" size="1.5em" />
                    <NuxtLink class="font-bold w-[300px] whitespace-nowrap overflow-hidden text-ellipsis hover:text-primary transition-colors" :href="adjacentPages[0].path">
                      {{ adjacentPages[0].title }}
                    </NuxtLink>
                  </template>
                </div>
                <div class="flex-1 text-right flex items-center justify-end gap-2">
                  <template v-if="adjacentPages[1]">
                    <NuxtLink class="font-bold w-[300px] whitespace-nowrap overflow-hidden text-ellipsis hover:text-primary transition-colors" :href="adjacentPages[1].path">
                      {{ adjacentPages[1].title }}
                    </NuxtLink>
                    <Icon name="material-symbols:play-arrow-outline-rounded" size="1.5em" />
                  </template>
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>
        <!-- 评论区 -->
        <ClientOnly>
          <div class="comment-area bg-primary/5 dark:bg-zinc-900 rounded-lg p-4 md:p-6 mt-6">
            <template v-if="page?.body && !isDefer">
              <!-- <Separator class="my-4" label="评论" /> -->
              <div id="评论区" class="text-xl py-4 ">
                评论区
              </div>
              <AppCommentInput @send="createComment" />
              <div class="py-4" />
              <transition-group appear name="comment" tag="div" class="comment-list mt-6 space-y-4" @enter="commentEnter" @leave="commentLeave" @before-enter="commentBeforeEnter">
                <template v-for="comment in comments" :key="comment.id">
                  <CommentViewPanel :comment="comment" @refresh="initComment" />
                </template>
              </transition-group>
            </template>
          </div>
        </ClientOnly>

        <!-- 作者添加注解 v-model:open="isOpen" -->
        <Drawer v-model:open="isOpenDrawer" :dismissible="true">
          <DrawerContent class="bg-gray-900 border-t-2 border-gray-800">
            <DrawerHeader>
              <DrawerTitle class=" text-gray-100" />
            </DrawerHeader>
            <div class="border-box px-4 pb-8 md:px-20">
              <QuoteComment
                :content="selectedText?.text ?? ''" :article-id="page?.id" @close="isOpenDrawer = false"
                @success="handleSubmitExplain"
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  </NuxtLayout>
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
  color: rgb(161 161 170); /* text-zinc-400 */
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  position: relative;
  border-left: 2px solid transparent;
  margin-left: -2px; /* Compensate for border */
}

/* Dark mode text colors */
.dark .notion-toc-link {
  color: rgb(161 161 170);
}

/* Hover state */
.notion-toc-link:hover {
  color: rgb(113 113 122); /* text-zinc-500 dark */
  background-color: rgb(244 244 245); /* bg-zinc-100 */
}

.dark .notion-toc-link:hover {
  color: rgb(212 212 216); /* text-zinc-300 */
  background-color: rgb(39 39 42); /* bg-zinc-800 */
}

/* Active state with primary color and left border indicator */
.notion-toc-link.active {
  color: hsl(142 32% 32%); /* primary color */
  background-color: rgb(240 253 244); /* bg-green-50 */
  font-weight: 500;
  border-left-color: hsl(142 32% 32%); /* primary border */
}

.dark .notion-toc-link.active {
  color: hsl(142 45% 55%); /* lighter primary for dark mode */
  background-color: rgba(34 197 94 / 0.1); /* subtle green bg */
  border-left-color: hsl(142 45% 55%);
}

/* Text ellipsis for long titles */
.notion-toc-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Child item (nested heading) indentation */
.notion-toc-child .notion-toc-link {
  padding-left: 1.5rem;
  font-size: 0.8125rem;
}

/* Smooth scrollbar styling */
.notion-toc-list::-webkit-scrollbar {
  width: 4px;
}

.notion-toc-list::-webkit-scrollbar-track {
  background: transparent;
}

.notion-toc-list::-webkit-scrollbar-thumb {
  background: rgb(228 228 231);
  border-radius: 2px;
}

.dark .notion-toc-list::-webkit-scrollbar-thumb {
  background: rgb(63 63 70);
}

.notion-toc-list::-webkit-scrollbar-thumb:hover {
  background: rgb(212 212 216);
}

.dark .notion-toc-list::-webkit-scrollbar-thumb:hover {
  background: rgb(82 82 91);
}
</style>
