<script lang="ts" setup>
import type { BlogMemoWithUser } from '~~/types/memo.d'

// 评论类型
const props = defineProps<Props>()
defineEmits(['refresh'])
const memoWrap = ref<any>(null)
const contentRef = ref<any>(null)
// const userStore = useUserStore()
// const { $api } = useNuxtApp()
// const { updateDateFromNow } = useDayjs()
// const showInfo = ref(true)
// const isContentOverflowing = ref(false)
// const commentReplyOpen = ref(false)
// const isLikedLocal = ref(false);
// const observer = ref()
// const textColor = ref()
// const textFontSize = ref()
// const colorMode = useColorMode()
interface Props {
  memo: BlogMemoWithUser
  showAll?: boolean
  hideBtns?: boolean
}
// const refreshKey = ref(1)
// const commentType = 'memo'// 解析特殊用户字符的展示, 如标签, 双链等
const parsedContent = computed(() => {
  return props.memo.content as string
  // // 把props.memo.content 中的以#开头,以空格结尾的部分提取,并替换成 链接
  // return props.memo.content?.replace(/#([^\s#]+)/g, (match, p1) => {
  //   // 以a标签外加传参的方式渲染tag
  //   return `[#${p1}](?tag=${p1}){target="_self"}`
  //   // 解析为vue组件, 避免不了换行问题, 只有换行才能触发渲染vue组件, 而如果把ProseP的p标签去掉, 还要处理需要换行的情况
  //   // return `::prose-a{href="?tag=${p1}"}\n#${p1}\n::`
  // })
})

// async function copyURL2Clipboard() {
//   // await navigator.clipboard.writeText(`https://blog.zzao.club/m/${props.memo.uid}`);
//   // toast.add({ severity: 'contrast', summary: '链接已复制！', detail: '快去粘贴分享吧！', life: 3000 });
// }

// async function copyIMG2Clipboard() {
//   // await navigator.clipboard.writeText(`https://blog.zzao.club/m/${props.memo.uid}`);
//   // toast.add({ severity: 'contrast', summary: '图片已复制!(假的，还没写呢)', detail: '快去粘贴分享吧！', life: 3000 });
// }

// function memoReply() {
//   if (!userStore.isLogin) {
//     // toast.add({ severity: 'error', summary: '登录后就可以评论了', life: 3000 });
//     return
//   }
//   commentReplyOpen.value = !commentReplyOpen.value
// }
// 评论
// async function createComment(message: string) {
//   if (!userStore.isLogin) {
//     // toast.add({ severity: 'error', summary: '请先登录后再留言', life: 3000 });
//     return
//   }

//   const { data, error } = await $api.post('/api/v1/comment/create', { type: commentType, user_id: userStore.user?.id, memo_id: props.memo.id, content: message }, { server: false })
//   if (error.value) {
//     // disposeError(error)
//     return
//   }

//   // toast.add({ severity: 'contrast', summary: '评论成功', life: 3000 })
//   commentReplyOpen.value = false
//   refreshList()
//   // emit('refresh')
//   // refresh()
// }
// const isLiked = computed(() => !!props.memo.likes?.find((item) => item.user_id === userStore?.user?.id))

// function refreshList() {
//   refreshKey.value++
//   emit('refresh')
// }

// function updateTextColor() {
//   const rect = memoWrap.value.getBoundingClientRect()
//   const viewportHeight = window.innerHeight

//   // 计算组件中心相对于文档顶部的距离
//   const componentCenter = rect.top + rect.height / 2 + window.scrollY

//   // 计算视口中心相对于文档顶部的距离
//   const viewportCenter = window.scrollY + viewportHeight / 2

//   // 计算组件中心与视口中心的距离
//   const distanceFromCenter = Math.abs(componentCenter - viewportCenter)
//   // 根据距离调整透明度
//   const opacity = 1 - Math.min(distanceFromCenter / (viewportHeight / 2), 1)
//   const isDark = colorMode.preference === 'dark'
//   textColor.value = isDark ? `rgba(255, 255, 255, ${0.5 + opacity * 0.5})` : `rgba(0, 0, 0, ${0.5 + opacity * 0.5})` // 颜色从浅到深
//   // 根据距离调整字号
//   const minFontSize = 10 // 最小字号
//   const maxFontSize = 18 // 最大字号
//   const fontSize = minFontSize + (maxFontSize - minFontSize) * opacity // 动态计算字号
//   textFontSize.value = `${fontSize}px`
// }

// 检测内容是否溢出
// function checkContentOverflow() {
//   if (contentRef.value) {
//     const element = contentRef.value.$el || contentRef.value
//     isContentOverflowing.value = element.scrollHeight > element.clientHeight
//   }
// }

// 监听内容变化
// watch(() => props.memo.content, () => {
//   nextTick(() => {
//     checkContentOverflow()
//   })
// }, { immediate: true })

// onMounted(() => {
//   // isLikedLocal.value = false;
//   const callback = (entries: any) => {
//     entries.forEach((entry: any) => {
//       if (entry.isIntersecting) {
//         console.log('Div 进入视口')
//         // entry.target.style.backgroundColor = "green";
//         showInfo.value = true
//         updateTextColor()
//         window.addEventListener('scroll', updateTextColor)
//         // 检测内容溢出
//         nextTick(() => {
//           checkContentOverflow()
//         })
//       }
//       else {
//         console.log('Div 离开视口')
//         showInfo.value = false
//         window.removeEventListener('scroll', updateTextColor)
//         // entry.target.style.backgroundColor = "red";
//       }
//     })
//   }

//   const options = {
//     root: null,
//     rootMargin: '0px',
//     threshold: 0.5,
//   }

//   observer.value = new IntersectionObserver(callback, options)
//   observer.value.observe(memoWrap.value) // 开始观察

//   // 初始检测
//   nextTick(() => {
//     checkContentOverflow()
//   })
// })

// onUnmounted(() => {
//   observer.value?.disconnect()
//   window.removeEventListener('scroll', updateTextColor)
// })
</script>

<template>
  <div ref="memoWrap" class="pixel-memo-panel">
    <MDC ref="contentRef" :value="parsedContent" tag="section" class="pixel-memo-content" />
  </div>
</template>

<style scoped>
/* Pixel style memo panel */
.pixel-memo-panel {
  min-height: 30px;
  display: flex;
  flex-direction: column;
  font-family: ui-monospace, monospace;
}

.pixel-memo-content {
  flex: 1;
  color: var(--pixel-text-primary);
  font-family: ui-monospace, monospace;
  line-height: 1.6;
  font-size: 0.875rem;
}

/* Override MDC prose styles for pixel theme */
.pixel-memo-content :deep(p) {
  margin: 0.5rem 0;
  color: var(--pixel-text-primary);
  font-family: ui-monospace, monospace;
}

.pixel-memo-content :deep(h1),
.pixel-memo-content :deep(h2),
.pixel-memo-content :deep(h3),
.pixel-memo-content :deep(h4),
.pixel-memo-content :deep(h5),
.pixel-memo-content :deep(h6) {
  color: var(--pixel-highlight-teal-text);
  font-family: ui-monospace, monospace;
  font-weight: bold;
  margin: 1rem 0 0.5rem 0;
}

.pixel-memo-content :deep(a) {
  color: var(--pixel-gradient-start);
  text-decoration: underline;
  font-family: ui-monospace, monospace;
}

.pixel-memo-content :deep(a:hover) {
  color: var(--pixel-gradient-start);
}

.pixel-memo-content :deep(code) {
  background-color: var(--pixel-bg-tertiary);
  color: var(--pixel-highlight-green-text);
  padding: 0.125rem 0.25rem;
  border: 1px solid var(--pixel-border-primary);
  font-family: ui-monospace, monospace;
  font-size: 0.8rem;
}

.pixel-memo-content :deep(pre) {
  background-color: var(--pixel-bg-input);
  border: 2px solid var(--pixel-bg-secondary);
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.pixel-memo-content :deep(pre code) {
  background: none;
  border: none;
  padding: 0;
  color: var(--pixel-text-primary);
}

.pixel-memo-content :deep(blockquote) {
  border-left: 4px solid var(--pixel-highlight-teal);
  padding-left: 1rem;
  margin: 1rem 0;
  color: var(--pixel-text-tertiary);
  font-style: italic;
}

.pixel-memo-content :deep(ul),
.pixel-memo-content :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.pixel-memo-content :deep(li) {
  margin: 0.25rem 0;
  color: var(--pixel-text-primary);
}

.pixel-memo-content :deep(img) {
  max-width: 100%;
  max-height: 400px;
  height: auto;
  border: 2px solid var(--pixel-border-primary);
  object-fit: contain;
}

@media (min-width: 768px) {
  .pixel-memo-content {
    font-size: 1rem;
  }

  .pixel-memo-content :deep(img) {
    max-height: 500px;
  }
}

@media (max-width: 767px) {
  .pixel-memo-content :deep(img) {
    max-height: 300px;
  }
}
</style>
