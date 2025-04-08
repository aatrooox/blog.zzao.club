<template>
  <div class="pb-10 m-auto mb-4 sm:rounded-lg">
    <main class="max-w-full relative flex justify-center gap-4">
      <div class="relative max-w-full lg:max-w-6xl mx-auto md:left-[-80px] lg:left-[-40px]" @scroll="handlePageScroll">
        <!-- 底部固定的操作栏 -->
        <div
          class="page-fixed-footer fixed left-0 right-0 bottom-0 bg-white/10 dark:bg-zinc-800/10 py-2 px-10 flex gap-4 justify-between w-full max-w-3xl mx-auto shadow-md transition-all duration-300 z-[999] !backdrop-blur-md !backdrop-opacity-90 md:hidden">
          <div class="left flex gap-2">
            <Button severity="secondary" text size="small">
              <Icon slot="icon" name="icon-park-outline:thumbs-up" ref="likeIcon" @click="likePage" class="!text-red-500"/>
              <span slot="badge">{{ likeCount }}</span>
            </Button>
            <Button severity="secondary" text size="small" v-tooltip.top="'回复'" @click="navigateTo('#评论区')">
              <Icon name="icon-park-outline:comments">
              </Icon>
              <span slot="badge">{{ comments.length }}</span>
            </Button>
            <Button severity="secondary" text size="small" v-tooltip.top="'复制链接'" @click="copyLink">
              <Icon name="material-symbols:share-reviews-outline-rounded"></Icon>
            </Button>
            <Button severity="secondary" text size="small" v-tooltip.top="'复制到公众号[Alpha]'" @click="getInnerHTML">
              <Icon slot="icon" name="icon-park-outline:wechat"></Icon>
            </Button>
          </div>
          <div class="right pr-6 md:pr-0">
            <Button label="返回" @click="navigateTo('/article')">
              <Icon name="icon-park-outline:back" slot="icon"></Icon>
            </Button>
          </div>
        </div>
        <!-- 文章标题 -->
        <!-- <h1 class="text-2xl font-bold mb-4 text-center relative"> {{ page?.title }}</h1> -->
        <article class="mdc-prose flex max-w-full sm:pr-8" v-if="page">
          <!-- <ContentDoc ref="curMdContentRef" v-slot="{ doc }"> -->

          <div class="flex-col gap-8 px-10 h-80 hidden md:flex sticky top-28">
            <div class="flex flex-col items-center cursor-pointer" v-tooltip.right="'点赞'">
              <Icon name="icon-park-outline:thumbs-up" size="1.5em" ref="likeIcon" @click="likePage" />
              <span slot="badge">{{ likeCount }}</span>
            </div>
            <div class=" cursor-pointer" v-tooltip.right="'回复'">
              <NuxtLink href="#评论区" class="flex flex-col items-center">
                <Icon name="icon-park-outline:comments" size="1.5em">
                </Icon>
                <span slot="badge">{{ comments.length }}</span>
              </NuxtLink>
            </div>
            <div class="flex flex-col items-center cursor-pointer" v-tooltip.right="'复制链接'" @click="copyLink">
              <Icon name="material-symbols:share-reviews-outline-rounded" size="1.5em"></Icon>
            </div>
            <div class="flex flex-col items-center cursor-pointer" v-tooltip.right="'复制到公众号[Alpha]'"
              @click="getInnerHTML" data-umami-event="wx-copy-btn">
              <Icon slot="icon" name="icon-park-outline:wechat" size="1.5em"></Icon>
            </div>
          </div>
          <div class="flex flex-col w-full max-w-full lg:max-w-2xl pc:max-w-2xl">
            <article ref="curMdContentRef">
              <ContentRenderer :value="page?.body" class="!max-w-full"></ContentRenderer>
            </article>
            <!-- 评论区 -->
            <ClientOnly>
              <div>
                <template v-if="page?.body && !isDefer">
                  <Divider align="center" type="solid">
                    <b>END</b>
                  </Divider>
                  <div class="text-xl mb-4" id="评论区">评论区</div>
                  <AppCommentInput @send="createComment"></AppCommentInput>
                  <template v-for="comment in comments">
                    <CommentViewPanel :comment="comment" @refresh="initComment"></CommentViewPanel>
                  </template>
                  
                </template>
              </div>

            </ClientOnly>
          </div>
        </article>
      </div>
      <ClientOnly>
        <div
          class="version-info fixed h-[80px] right-0 lg:right-0 pc:right-10 xl:right-[5%] 2xl:right-[5%] top-[10%] w-[220px] hidden lg:flex box-border dark:text-zinc-500  lg:flex-col lg:gap-2"
          v-if="page?.versions">
          <div class="flex" v-for="v of page?.versions" :key="v">
            <Tag :value="v" class=""></Tag>
          </div>
        </div>
        <!-- <div
          class="toc fixed h-[30px] right-0 lg:right-0 pc:right-10 xl:right-40 2xl:right-[15%] top-[20%] w-[220px] hidden lg:block box-border dark:text-zinc-500">
          <Button v-tooltip.top="'复制到公众号[Alpha]'" @click="getInnerHTML" severity="primary" rounded size="small"
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
  
  import { EffectCssAttrs, camelCaseToHyphen, ExcludeClassList, IMG_WRAP_CLASS, PreCodeCssAttrs, customTagCssAttrs } from '@/config/richText';
  const toast = useGlobalToast()
  const { $api } = useNuxtApp();
  const userStore = useUserStore();
  const route = useRoute();
  const activeTocId = ref('')
  const curMdContentRef = ref(null)
  import { Prisma } from '@prisma/client';

  type BlogCommentWithUserInfo = Prisma.BlogCommentGetPayload<{ 
      include: { user_info: true , _count: true } }>
  const likeCount = ref(0)
  const isLiked = ref(false)
  const comments = ref<BlogCommentWithUserInfo[]>([])
  const isDefer = ref(true)
  
  let _htmlCache = {}
  let _styleValueCache = {}
  let copyHTML = ``

  const { data: page, error, status } = await useAsyncData(route.path, () => {
    return queryCollection('content').path(decodeURI(route.path)).first()
  }, {lazy: true})

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

  const tocData = computed( () => {
    return page.value?.body?.toc?.links
  })

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

  const handlePageScroll = (e) => {
    // console.log(`e.target`, e.target.scrollTop)
  }

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
    contentChildrens.forEach( childDom => {
      const childInnerHTMLWithInlineStyle = getOneDomCssStyle(childDom)
      articleOutHTML += childInnerHTMLWithInlineStyle
    })

    articleOutHTML += `</section>`
    // 微信不支持div, 用section代替
    copyHTML = articleOutHTML?.replaceAll('<div', '<section')?.replaceAll('</div>', '</section>')
    const data = new Blob([copyHTML], { type: 'text/html' })
    const data2 = new Blob([copyHTML], { type: 'text/plain' })
    const item = new ClipboardItem({ 'text/html': data, 'text/plain': data2})
    await navigator.clipboard.write([item])

    toast.contrast('已复制HTML到剪贴板!')
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
      if (classList.some( item => ExcludeClassList.includes(item as string))) { return '' }

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
        _effectCssAttrs.forEach( cssAttr => {
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
        Object.entries(curCssStyles).forEach( (value, index) => {
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
        childNodes.forEach( child => {
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

  const findImgDom = (dom:HTMLElement | ChildNode): HTMLElement => {
    const childDoms:ChildNode[] = Array.from(dom.childNodes).filter((node: any) => node.nodeType === Node.ELEMENT_NODE)
    const imgDom = childDoms.find( (node: any) => node.tagName.toLowerCase() === 'img')
    
    if (!imgDom && childDoms && childDoms.length > 0) { 
      for (let childDom of childDoms) {
        return findImgDom(childDom)
      }
    } 

    return imgDom as HTMLElement
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText('https://zzao.club' + route.fullPath);
    toast.contrast('已复制链接!')
  }
  const createComment = async (data) => {
    if (!userStore.user.id) {
       umami.track('comment', { page: page.value?.id, isOk: false });
       return toast.warn('登录后就可以评论了')
    }
    const res = await $api.post('/api/v1/comment/create', {
      article_id: page.value?.id,
      content: data.content,
      user_id: userStore.user.id
    })
    console.log(`res`, res)
    if (!res.error) {
      toast.success('评论成功')
      umami.track('comment', { page: page.value?.id, isOk: true });
      initComment();
    }
  }
  const likePage = async () => {
    if (!userStore.user.id) {
      umami.track('like', { page: page.value?.id, isOk: false });
      return toast.contrast('登录后才能点赞')
    };

    if (isLiked.value) {
      return toast.contrast('已经点过赞了')
    };

    const res = await $api.post('/api/v1/like/create', { article_id: page.value?.id, user_id: userStore.user.id })

    if (!res.error) {
      toast.contrast('感谢支持！');
      umami.track('like', { page: page.value?.id, isOk: true });
      initLikeCount()
    }

  }

  const initComment = async () => {
    isDefer.value = false;
    const res = await $api.get('/api/v1/comment/list', { article_id: page.value?.id });
    if (!res.error) {
      comments.value = res.data
    }
  }

  const initLikeCount = async () => {
    const res = await $api.get('/api/v1/like/count', { article_id: page.value?.id, user_id: userStore.user.id });
    if (!res.error) {
      likeCount.value = res.data.count
      isLiked.value = res.data.isLiked
    }
  }

  watchEffect( async () => {
    if (page.value?.id) {
      setTimeout(() => {
        initComment();
        initLikeCount();
      }, 800)
    }
  })
</script>
