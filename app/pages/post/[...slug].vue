<template>
  <div class="relative max-w-3xl mx-auto" @scroll="handlePageScroll">
    <div class="page-header">
      <Button label="返回" @click="$router.back()">
        <Icon name="icon-park-outline:back" slot="icon"></Icon>
      </Button>
    </div>
    <div
      class="page-fixed-footer fixed left-0 right-0 bottom-0 bg-white dark:bg-zinc-200 py-2 px-10 flex gap-4 justify-between w-full max-w-3xl mx-auto shadow-md transition-all duration-300 z-[999]"
      v-if="showFixedHeader">
      <div class="left flex gap-2">
        <Button severity="secondary" text size="small">
          <Icon slot="icon" name="icon-park-outline:thumbs-up" mode="svg" ref="likeIcon" />
          <span slot="badge">{{ 0 }}</span>
        </Button>
        <Button severity="secondary" text size="small" v-tooltip.top="'回复'">
          <Icon name="icon-park-outline:comments">
          </Icon>
          <span slot="badge">{{ 0 }}</span>
        </Button>
        <Button severity="secondary" text size="small" v-tooltip.top="'转发图片'">
          <Icon name="icon-park-outline:collect-picture"></Icon>
        </Button>
        <Button severity="secondary" text size="small" v-tooltip.top="'转发链接'">
          <Icon name="icon-park-outline:share-two"></Icon>
        </Button>
      </div>
      <div class="right pr-6 md:pr-0">
        <Button label="返回" @click="$router.back()">
          <Icon name="icon-park-outline:back" slot="icon"></Icon>
        </Button>
      </div>
    </div>
    <h1 class="text-2xl font-bold mb-4 text-center relative"> {{ page?.title }}</h1>
    <div class="pannel-box flex justify-end transition-all">
      <Button v-tooltip.top="'复制到公众号[Alpha]'" @click="getInnerHTML" severity="primary" rounded size="small"
        variant="text">
        <Icon slot="icon" size="1.5em" name="icon-park-outline:wechat"></Icon>
      </Button>
    </div>
    <article class="!w-full !max-w-full mdc-prose prose " v-if="page">
      <!-- <ContentDoc ref="curMdContentRef" v-slot="{ doc }"> -->
      <article ref="curMdContentRef">
        <div class="version-info" v-if="page?.versions">
          <Tag v-for="v of page?.versions" :key="v" :value="v" class="mr-2"></Tag>
        </div>
        <ContentRenderer :value="page?.body"></ContentRenderer>
      </article>
      <!-- </ContentDoc> -->
    </article>
  </div>
</template>

<script setup>
  import { EffectCssAttrs, camelCaseToHyphen, ExcludeClassList, IMG_WRAP_CLASS, PreCodeCssAttrs, customTagCssAttrs } from '@/config/richText';
  const toast = useToast()
  const route = useRoute();
  // console.log(`path`, route.params.slug, `/${route.params.slug.join('/')}`)
  // const path = computed( () => route.params.slug)
  const curMdContentRef = ref(null)
  const scorllTrigger = ref(120) // 大于此值时，显示一个 header
  const showFixedHeader = ref(false)
  let _htmlCache = {}
  let _styleValueCache = {}
  let copyHTML = ``

  const { data: page } = await useAsyncData(route.path, () => {
    return queryCollection('content').path(decodeURI(route.path)).first()
  })

  useSeoMeta({
    title: page.value?.seo.title,
    description: page.value?.seo.description,
  })


  onMounted( () => {
    window.onscroll = (event) => {
      // console.log(`event.滚动`, window.scrollY || document.documentElement.scrollTop)
      const scrollY = window.scrollY || document.documentElement.scrollTop
      if (scrollY > scorllTrigger.value) {
        // console.log(`显示`, )
        showFixedHeader.value = true
      } else {
        showFixedHeader.value = false
        // console.log(`隐藏`, )
      }
      
    }
  })
  const handlePageScroll = (e) => {
    // console.log(`e.target`, e.target.scrollTop)
  }

  const getContentDom = () => {
    const articleDom = curMdContentRef.value
    // 默认内部会套一层div
    const contentDom = articleDom.childNodes[1]
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

    toast.add({ 
      severity: 'contrast',
      summary: '已复制到剪贴板',
      detail: '去公众号后台粘贴吧！',
      life: 2000
    })
  }

  /**
   * 
   * @param childDom dom元素
   * @param pointCssAttrs 关键css 传入此值将忽略其他属性
   */
  const getOneDomCssStyle = (childDom, pointCssAttrs = []) => {
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
      if (classList.some( item => ExcludeClassList.includes(item))) { return '' }

      // 特殊处理一下img元素
      if (checkDomIsImg(childDom)) {
        return getImgDomHTML(childDom)
      }
    // 如果有子元素, 需要递归处理
      let childNodes = Array.from(childDom.childNodes)
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
          const _pointCssAttrs = childNodes.tageName === 'pre' ? PreCodeCssAttrs : []
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
  const checkDomIsImg = (dom) => {
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

  const findImgDom = (dom) => {
    const childDoms = Array.from(dom.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE)
    const imgDom = childDoms.find( node => node.tagName.toLowerCase() === 'img')
    
    if (!imgDom && childDoms && childDoms.length > 0) { 
      for (let childDom of childDoms) {
        return findImgDom(childDom)
      }
    } 

    return imgDom
  }
</script>
