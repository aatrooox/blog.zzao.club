<template>
  <div class="pb-10 m-auto mb-4 sm:rounded-lg">
    <main class="w-full max-w-full relative flex justify-center gap-4">
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

        <div class="mdc-prose flex !max-w-full" v-if="page">
          <!-- 左侧点赞评论操作栏 -->
          <ClientOnly>
            <div class="flex-col gap-8 px-10 h-80 hidden md:flex fixed top-28 left-[2%]">
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
          <div class="article-warp flex flex-col max-w-full w-full box-border md:px-20 lg:px-60 2xl:px-10">
            <!-- 悬浮标题栏 -->
            <div
              class="fixed-title text-lg font-bold text-center w-full overflow-hidden text-ellipsis h-12 leading-12 sticky top-0 transition-all delay-200 bg-white/90 dark:bg-zinc-900/80 md:text-xl"
              v-if="navBarStore.navBar?.isHidden"> {{ page?.title }}</div>

            <article ref="curMdContentRef" class="content-wrap w-full max-w-full md:flex-1 !md:max-w-2xl">
              <ContentRenderer :value="page?.body" class="!w-full !max-w-full "></ContentRenderer>
            </article>
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
          </div>
        </div>
      </div>
      <ClientOnly>
        <div
          class="version-info fixed h-[80px] right-0 lg:right-0 pc:right-10 xl:right-[1%] 2xl:right-[10%] top-[10%] w-[220px] hidden lg:flex box-border dark:text-zinc-500  lg:flex-col lg:gap-2"
          v-if="page?.versions">
          <div class="flex" v-for="v of page?.versions" :key="v">
            <Badge :value="v" class=""></Badge>
          </div>
        </div>
        <!-- <div
          class="toc fixed h-[30px] right-0 lg:right-0 pc:right-10 xl:right-40 2xl:right-[15%] top-[20%] w-[220px] hidden lg:block box-border dark:text-zinc-500">
          <Button v-tooltip.top="'复制到公众号[Alpha]'" @click="getInnerHTML" variant="primary" rounded size="small"
            variant="text">
            <Icon slot="icon" size="1.5em" name="icon-park-outline:wechat"></Icon>
          </Button>
        </div> -->
        <AppToc v-if="tocData && tocData.length" :toc-data="tocData" :active-id="activeTocId"></AppToc>
      </ClientOnly>

    </main>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '#app';
import { EffectCssAttrs, camelCaseToHyphen, ExcludeClassList, IMG_WRAP_CLASS, PreCodeCssAttrs, customTagCssAttrs } from '@/config/richText';
const toast = useGlobalToast()
const { $api } = useNuxtApp();
const userStore = useUserStore();
const tokenStore = useTokenStore()
const navBarStore = useNavBarStore()
const clientjs = useClientjs()
const route = useRoute();
const activeTocId = ref('')
const curMdContentRef = ref(null)
import { Prisma, type User } from '@prisma/client';

type BlogCommentWithUserInfo = Prisma.BlogCommentGetPayload<{
  include: { user_info: true, _count: true, sub_comments: { include: { user_info: true } } }
}>
const likeCount = ref(0)
const isLiked = ref(false)
const comments = ref<BlogCommentWithUserInfo[]>([])
const isDefer = ref(true)

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
const createComment = async (data) => {
  if (!userStore.user.id) {
    const res = await $api.post<{ user: User, token: string }>('/api/v1/user/visitor/regist', { visitorId: clientjs.getVisitorId(), visitorName: data.visitor.name, visitorEmail: data.visitor.email, visitorWebsite: data.visitor.website })
    userStore.setUser(res.data.user)
    tokenStore.setToken(res.data.token)
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
watchEffect(async () => {
  if (page.value?.id) {
    setTimeout(() => {
      initComment();
      initLikeCount();
    }, 800)
  }
})
</script>
