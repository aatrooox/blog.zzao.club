<template>
  <div class="pb-10 m-auto mb-4 sm:rounded-lg">
      <div class="relative w-full max-w-full">
        <!-- 底部固定的操作栏 -->
        <ClientOnly>
          <div
            class="md:hidden page-fixed-footer fixed left-0 right-0 bottom-0 bg-white/10 dark:bg-zinc-800/10 py-2 px-10 flex gap-4 justify-between w-full max-w-3xl mx-auto shadow-md transition-all duration-300 z-[49] !backdrop-blur-md !backdrop-opacity-90 ">
            <div class="left flex gap-2">
              <Button variant="ghost" text size="sm">
                <Icon slot="icon" name="icon-park-outline:thumbs-up" ref="likeIcon" @click="likePage" />
                <span slot="badge">{{ likeCount }}</span>
              </Button>
              <Button variant="ghost" text size="sm" @click="navigateTo('#评论区')">
                <Icon name="icon-park-outline:comments">
                </Icon>
                <span slot="badge">{{ formatCommentCount }}</span>
              </Button>
              <Button variant="ghost" text size="sm" @click="copyLink">
                <Icon name="material-symbols:share-reviews-outline-rounded"></Icon>
              </Button>
              <Button variant="ghost" text size="sm" @click="getInnerHTML">
                <Icon slot="icon" name="icon-park-outline:wechat"></Icon>
              </Button>
            </div>
            <div class="right pr-6 md:pr-0">
              <Button label="返回" variant="secondary" @click="navigateTo('/article')">
                <Icon name="icon-park-outline:back" slot="icon"></Icon>
              </Button>
            </div>
          </div>
        </ClientOnly>

        <div class="mdc-prose flex w-full" v-if="page">
          <!-- 左侧点赞评论操作栏 -->
          <ClientOnly>
            <div class="flex-col gap-8 h-80 hidden md:flex top-28 sticky">
              <div class="flex flex-col items-center cursor-pointer">
                <Icon name="icon-park-outline:thumbs-up" size="1.5em" ref="likeIcon" @click="likePage" />
                <span slot="badge">{{ likeCount }}</span>
              </div>
              <div class=" cursor-pointer">
                <NuxtLink href="#评论区" class="flex flex-col items-center">
                  <Icon name="icon-park-outline:comments" size="1.5em">
                  </Icon>
                  <span slot="badge">{{ formatCommentCount }}</span>
                </NuxtLink>
              </div>
              <div class="flex flex-col items-center cursor-pointer" @click="copyLink">
                <Icon name="material-symbols:share-reviews-outline-rounded" size="1.5em"></Icon>
              </div>
              <div class="flex flex-col items-center cursor-pointer" @click="getInnerHTML"
                data-umami-event="wx-copy-btn">
                <Icon slot="icon" name="icon-park-outline:wechat" size="1.5em"></Icon>
              </div>
            </div>
          </ClientOnly>
          <div class="article-wrap relative flex flex-col  flex-1 px-6 box-border overflow-x-auto" ref="articleWrap">
            <!-- 选中文字的悬浮气泡 -->
            <ClientOnly>
              <transition appear @enter="commentEnter" @before-enter="commentBeforeEnter" @leave="commentLeave">
                <div
                  class="page-btns absolute opacity-0 bg-zinc-800/90 text-zinc-100 dark:bg-zinc-200/90 dark:text-zinc-800 rounded-sm px-2 py-1 flex items-center gap-2"
                  v-if="commentIconPosition.top !== 0 || commentIconPosition.left !== 0"
                  :style="{ top: commentIconPosition.top + 'px', left: commentIconPosition.left + 'px' }">
                  <Icon class="cursor-pointer page-operation-btn" name="icon-park-outline:comments" size="1.5em"
                    @click.stop="handleCommentPragph" />
                  <Icon class="cursor-pointer page-operation-btn" name="material-symbols:image-arrow-up-rounded"
                    size="1.5em" @click.stop="handleCommentPragph" />
                  <Icon class="cursor-pointer page-operation-btn"
                    name="material-symbols:stylus-fountain-pen-outline-rounded" size="1.5em"
                    @click="isOpenDrawer = true" />
                </div>
              </transition>
            </ClientOnly>
            <!-- 悬浮标题栏 -->
            <div
              class="fixed-title text-lg font-bold text-center overflow-hidden text-ellipsis h-12 leading-12 sticky top-0 transition-all delay-200 bg-white/90 dark:bg-zinc-900/80 md:text-xl"
              v-if="navBarStore.navBar?.isHidden"> {{ page?.title }}</div>

            <!-- 文章内容 markdown -->
            <article ref="curMdContentRef" class="content-wrap">
              <ContentRenderer :value="page?.body">
              </ContentRenderer>
            </article>
            <!-- 相邻的文章 -->
            <ClientOnly v-if="adjacentPages.length">
              <Separator class="my-1" label="END" />
              <div class="flex justify-between text-xs py-4">
                <div class="flex-1 flex items-center gap-1">
                  <template v-if="adjacentPages[0]">
                    <Icon name="material-symbols:arrow-back-2-outline-rounded" size="1.5em"></Icon>
                    <NuxtLink class="!underline" :href="adjacentPages[0].path">{{ adjacentPages[0].title }}</NuxtLink>
                  </template>
                </div>
                <div class="flex-1 text-right flex items-center justify-end gap-1">
                  <NuxtLink class="!underline" :href="adjacentPages[1].path">{{ adjacentPages[1].title }}</NuxtLink>
                  <Icon name="material-symbols:play-arrow-outline-rounded" size="1.5em"></Icon>
                </div>
              </div>
            </ClientOnly>
            <!-- 评论区 -->
            <ClientOnly>
              <div>
                <template v-if="page?.body && !isDefer">
                  <Separator label="END" />
                  <div class="text-xl py-4" id="评论区">评论区</div>
                  <AppCommentInput @send="createComment"></AppCommentInput>
                  <div class="py-4"></div>
                  <template v-for="comment in comments">
                    <CommentViewPanel :comment="comment" @refresh="initComment"></CommentViewPanel>
                  </template>

                </template>
              </div>

            </ClientOnly>

            <!-- 作者添加注解 v-model:open="isOpen"-->
            <Drawer :dismissible="true" v-model:open="isOpenDrawer">
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>

                  </DrawerTitle>
                </DrawerHeader>
                <div class="border-box px-4 pb-8 md:px-20">
                  <QuoteComment :content="selectedText?.text ?? ''" :article-id="page?.id" @close="isOpenDrawer = false"
                    @success="handleSubmitExplain">
                  </QuoteComment>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <ClientOnly>
            <div class="sticky top-28 hidden lg:block h-[500px]">
              <AppToc v-if="tocData && tocData.length" :toc-data="tocData" :active-id="activeTocId"></AppToc>
            </div>
          </ClientOnly>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { EffectCssAttrs, camelCaseToHyphen, ExcludeClassList, IMG_WRAP_CLASS, PreCodeCssAttrs, customTagCssAttrs } from '@/config/richText';
import type { CommentData } from '@nuxtjs/mdc';
import { Prisma, type User } from '@prisma/client';
import type { Visitor } from '~~/types/blog';

type BlogCommentWithUserInfo = Prisma.BlogCommentGetPayload<{
  include: { user_info: true, _count: true, sub_comments: { include: { user_info: true } } }
}>

const toast = useGlobalToast()
const { $api } = useNuxtApp();
const userStore = useUserStore();
const tokenStore = useTokenStore()
const navBarStore = useNavBarStore()
const clientjs = useClientjs()
const route = useRoute();
const activeTocId = ref('')
const curMdContentRef = ref(null)
const articleWrap = templateRef('articleWrap')
const selectedText = ref()
const { text, rects, ranges, selection } = useTextSelection()

const likeCount = ref(0)
const isLiked = ref(false)
const comments = ref<BlogCommentWithUserInfo[]>([])
const isDefer = ref(true)
const isOpenDrawer = ref(false)

const commentIconPosition = computed(() => {
  if (text.value.trim().length) {
    // 发生划词时，记录当前划线的滚动距离
    if (navBarStore.selectionScrollY === 0) {
      navBarStore.setSelectionScrollY(navBarStore.scrollY)
    }
    let left = -50;
    if (selection?.value) {
      const range = selection?.value?.getRangeAt(0);
      if (range) {
        const rectList = range.getClientRects();

        selectedText.value = serializeSelection(text.value)

        if (rectList.length > 0) {
          const firstRect = rectList[0];
          const containerRect = articleWrap.value?.getBoundingClientRect();
          const rectLeft = firstRect?.left ?? window.scrollX;
          if (containerRect) {
            left = rectLeft - containerRect.left;
          } else {
            left = rectLeft + window.scrollX;
          }
        }
      }
    }



    return {
      top: (rects?.value?.[0]?.top || 0) - 50 + navBarStore.selectionScrollY + (rects?.value?.[0]?.height || 0),
      left
    }
  } else {
    navBarStore.setSelectionScrollY(0)
    return {
      top: 0,
      left: 0
    }
  }

})

const commentEnter = (el) => {
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
          { to: 0, ease: 'outBounce', duration: 200, delay: 150 }
        ],
        rotate: {
          from: '-1turn',
          delay: 0
        },
        opacity: '1',
        duration: 400,
        delay: (_, i) => i * 50,
        ease: 'inOutCirc',
        onComplete: () => {

        }
      })
    }
  })
}
const commentBeforeEnter = (el) => {
  el.style.opacity = '0'
}

const commentLeave = (el, done) => {
  animate(el, {
    scale: [1, 1.1, 1],
    opacity: '0',
    duration: 200,
    delay: 300,
    ease: 'inOut',
    onComplete: () => {
      done()
    }
  })
}


const handleCommentPragph = () => {
  console.log('评论段落', selectedText.value)
}

const applySelectedText = () => {
  // underlineSavedSelection(selectedText.value)
}
// 选中时及时保存当前文字
function serializeSelection(text?: string) {
  if (!text) return {}
  return {
    text: text
  }
}






const adjacentPages = ref<any[]>([])
let _htmlCache = {}
let _styleValueCache = {}
let copyHTML = ``

const { data: page, error, status } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(decodeURI(route.path)).first()
}, { lazy: true })

useSeoMeta({
  title: page.value?.seo.title,
  description: page.value?.seo.description,
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://zzao.club${route.path}`
    }
  ]
})


watch(error, (err) => {
  console.log(`error`, err)
  throw createError({
    statusCode: 404,
    message: '页面不存在',
    fatal: true
  })
})

watch(page, (page) => {
  if (status.value === 'success' || status.value === 'error') {
    if (!!!page) {
      throw createError({
        statusCode: 404,
        message: '页面不存在',
        fatal: true
      })
    }
  }
})

const tocData = computed(() => {
  return page.value?.body?.toc?.links
})


// const handleSelection = () => {
//   const selection = window.getSelection()

//   if (selection && selection?.rangeCount > 0 && selection?.toString().trim().length > 0) {
//     const range = selection.getRangeAt(0)
//     console.log(`range`, range, selection, selection.toString())
//   }
// }

const getContentDom = () => {
  const articleDom: any = curMdContentRef.value
  // 默认内部会套一层div
  const contentDom = articleDom && articleDom.childNodes[0]
  return contentDom
}
const getInnerHTML = async (e) => {
  // 获取内容区域的父级div
  const contentDom = getContentDom();
  const contentChildrens = contentDom.childNodes
  let articleOutHTML = `<section style="padding-left:12px; padding-right:12px;background-image: linear-gradient(90deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%), linear-gradient(360deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%);background-size: 20px 20px;">`
  contentChildrens.forEach(childDom => {
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
const getOneDomCssStyle = (childDom, pointCssAttrs: string[] = []) => {
  // 如果不存在，或是注释部分，则返回空字符串
  // 忽略掉button
  if (!childDom || childDom.nodeType === Node.COMMENT_NODE || childDom.tageName === 'BUTTON' || childDom.tageName === 'STYLE') return '';
  // 文本节点， 直接返回文本
  if (childDom.nodeType === Node.TEXT_NODE) {
    return childDom.nodeValue
  }

  console.log(`childDom.tageName `, childDom.tagName, childDom.nodeType)
  let classList = Array.from(childDom.classList)
  // 如果元素的class在excludeClassList中，则忽略掉此元素， 一般是一些辅助类的元素
  if (classList.some(item => ExcludeClassList.includes(item as string))) { return '' }

  // 特殊处理一下img元素
  if (checkDomIsImg(childDom)) {
    return getImgDomHTML(childDom)
  }
  // 如果有子元素, 需要递归处理
  let childNodes: Array<HTMLElement> = Array.from(childDom.childNodes)
  let tagName = childDom.tagName.toLowerCase()
  let childOutHTML = childDom.outerHTML
  let childInnerHTML = childDom.innerHTML

  let curCssStyles = {}
  let styleStrValue = ``

  // 获取当前dom的所有样式
  // 如果有缓存，直接使用缓存
  // htmlcache key相同 意味着元素完全一致
  if (childOutHTML && _htmlCache[childOutHTML]) {
    curCssStyles = _htmlCache[childOutHTML]
    styleStrValue = _styleValueCache[childOutHTML]
  } else {
    // 没缓存, 获取对应的css
    const computedCssStyles = getComputedStyle(childDom, null)
    // console.log(`computedCssStyles`, computedCssStyles)
    const _effectCssAttrs = pointCssAttrs.length > 0 ? pointCssAttrs : EffectCssAttrs
    _effectCssAttrs.forEach(cssAttr => {
      const value = computedCssStyles[cssAttr]
      if (value) {
        curCssStyles[cssAttr] = value
      }
    })
    // 如果当前元素有些属性需要添加进去
    // if (classList.some( item => !!customTagCssAttrs[item])) {
    //   console.log(`当前 classList ${classList} 存在自定义属性值`, )
    //   classList.forEach( item => {
    //     if (customTagCssAttrs[item]) {
    //       customTagCssAttrs[item].forEach( cssAttr => {
    //         const value = computedCssStyles[cssAttr]
    //         if (value) {
    //           curCssStyles[cssAttr] = value
    //           console.log(`自定义后的属性值为 => `, curCssStyles)
    //         }
    //       })
    //     }
    //   })
    // }

    // 设置缓存, 如果存在相同html, 则直接使用缓存
    _htmlCache[childOutHTML] = curCssStyles
    // 组装style字符串
    Object.entries(curCssStyles).forEach((value, index) => {
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
    childNodes.forEach(child => {
      const _pointCssAttrs: string[] = child.tagName === 'pre' ? PreCodeCssAttrs : []
      const childOwnHTML = getOneDomCssStyle(child, _pointCssAttrs)
      curDomAllHTML += childOwnHTML;
    })
    curDomAllHTML += `</${tagName}>`
  } else {
    // 不存在子元素, 直接闭合标签
    curDomAllHTML = `<${tagName} style="${styleStrValue}">${childInnerHTML}</${tagName}>`
  }

  return curDomAllHTML
}

/**
 * 检测当前dom是不是包裹img，一般都需要特殊处理
 * @param dom dom元素
 */
const checkDomIsImg = (dom: HTMLElement) => {
  return Array.from(dom.classList)?.includes(IMG_WRAP_CLASS)
}
/**
 * 在imgWrapDom中提取到img html字符串
 * @param imgWrapDom 
 */
const getImgDomHTML = (imgWrapDom) => {
  // console.log(`imgWrapDom`, imgWrapDom)
  // imgWrapDom
  const imgDom = findImgDom(imgWrapDom)

  return imgDom?.outerHTML
}

const findImgDom = (dom: HTMLElement | ChildNode): HTMLElement => {
  const childDoms: ChildNode[] = Array.from(dom.childNodes).filter((node: any) => node.nodeType === Node.ELEMENT_NODE)
  const imgDom = childDoms.find((node: any) => node.tagName.toLowerCase() === 'img')

  if (!imgDom && childDoms && childDoms.length > 0) {
    for (let childDom of childDoms) {
      return findImgDom(childDom)
    }
  }

  return imgDom as HTMLElement
}

const copyLink = async () => {
  await navigator.clipboard.writeText('https://zzao.club' + route.fullPath);
  toast.add({ message: '已复制链接!' })
}
const createComment = async (data: CommentData) => {
  if (!userStore.user.id) {
    await createVistorID(data.visitor as Visitor)
  }
  const res = await $api.post('/api/v1/comment/create', {
    article_id: page.value?.id,
    content: data.content,
    user_id: userStore.user.id,
    path: 'https://zzao.club' + route.fullPath
  })

  if (!res.error) {
    toast.add({ type: 'success', message: '评论成功' })
    umami.track('comment', { page: page.value?.id, isOk: true });
    initComment();
  }
}
const likePage = async () => {
  // 游客点赞 生成指纹 -> 注册为游客 (随机用户名 + 固定id)
  if (!userStore.user.id) {
    const res = await $api.post<{ user: User, token: string }>('/api/v1/user/visitor/regist', { visitorId: clientjs.getVisitorId() })
    userStore.setUser(res.data.user)
    tokenStore.setToken(res.data.token)
    // return toast.add({ type: 'warning', message: '登录后才能点赞' })
  };

  if (isLiked.value) {
    return toast.warn('已经点过赞了')
  };

  const res = await $api.post('/api/v1/like/create', { article_id: page.value?.id, user_id: userStore.user.id })

  if (!res.error) {
    toast.success('感谢支持！');
    umami.track('like', { page: page.value?.id, isOk: true });
    initLikeCount()
  }

}

const initComment = async () => {
  const res = await $api.get('/api/v1/comment/list', { article_id: page.value?.id });
  if (!res.error) {
    comments.value = res.data
  }
  isDefer.value = false;
}

const initLikeCount = async () => {
  const res = await $api.get('/api/v1/like/count', { article_id: page.value?.id, user_id: userStore.user.id });
  if (!res.error) {
    likeCount.value = res.data.count
    isLiked.value = res.data.isLiked
  }
}


const formatCommentCount = computed(() => {
  let count = comments.value.length;
  comments.value.forEach(item => {
    count += (item._count?.sub_comments ?? 0)
  })
  if (count > 99) return '99+'
  return count
})

const getSurroundingPage = async () => {
  const paths = route.path.split('/').filter(Boolean);
  console.log(`paths`, route.path)
  const { data } = await useAsyncData(page.value?.id || 'surrounding-page', () => {
    return queryCollectionItemSurroundings('content', route.path).order('date', 'DESC')
  })

  console.log(`data`, data.value)
  adjacentPages.value = data.value || []
}
function handleSubmitExplain() {
  isOpenDrawer.value = false;
  initExplain();
}
// 初始化注释内容
const initExplain = async () => {
  const res = await $api.get(`/api/v1/explain?id=${encodeURIComponent(page.value?.id ?? '')}`);
  if (!res.error) {
    const explains = res.data;
    const container = curMdContentRef.value
    processArticleContent(explains, container)
  }
}

// 处理文章内容，查找并标记注解
function processArticleContent(explains, container) {
  // 获取所有文本节点
  const textNodes = getAllTextNodes(container);

  // 对每个注解进行处理
  explains.forEach(annotation => {
    const searchText = annotation.text;

    // 在所有文本节点中查找匹配
    textNodes.forEach(node => {
      const parent = node.parentNode;
      const content = node.textContent;

      // 如果文本节点包含注解文本
      if (content.includes(searchText)) {
        // 分割文本节点
        const parts = content.split(searchText);

        // 创建文档片段
        const fragment = document.createDocumentFragment();

        // 添加第一部分文本
        if (parts[0]) {
          fragment.appendChild(document.createTextNode(parts[0]));
        }

        // 创建注解元素
        const annotatedSpan = document.createElement('span');
        annotatedSpan.className = 'highlight-explain-selection';
        annotatedSpan.textContent = searchText;

        // 创建提示气泡
        const tooltip = document.createElement('div');
        tooltip.className = 'explain-tooltip';

        // 添加注解内容
        const annotationItem = document.createElement('div');
        annotationItem.className = 'explain-content';
        annotationItem.textContent = annotation.content;
        tooltip.appendChild(annotationItem);

        // 将气泡添加到注解元素
        annotatedSpan.appendChild(tooltip);
        fragment.appendChild(annotatedSpan);

        // 添加剩余部分文本
        for (let i = 1; i < parts.length; i++) {
          if (i > 1) {
            // 如果有多个匹配，添加注解文本
            const repeatAnnotatedSpan = annotatedSpan.cloneNode(true);
            fragment.appendChild(repeatAnnotatedSpan);
          }
          if (parts[i]) {
            fragment.appendChild(document.createTextNode(parts[i]));
          }
        }

        // 替换原始节点
        parent && parent.replaceChild(fragment, node);
      }
    });
  });
}

// 获取元素内的所有文本节点
function getAllTextNodes(element) {
  const textNodes: any[] = [];

  // 递归函数获取所有文本节点
  function getTextNodes(node) {
    console.log(`node`, node)
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node);
    } else {
      const children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        getTextNodes(children[i]);
      }
    }
  }

  getTextNodes(element);
  return textNodes;
}
watchEffect(async () => {
  if (page.value?.id) {
    nextTick(() => {
      initComment();
      initLikeCount();
      getSurroundingPage();
      initExplain();
    })
  }
})
</script>
