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
  return props.memo.content
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
  <div ref="memoWrap" class="min-h-[150px] flex flex-col">
    <!-- <AppOverflowContent :show-all="!!showAll">

      </AppOverflowContent> -->
    <MDC ref="contentRef" :value="parsedContent" tag="section" class="mdc-memo-prose prose flex-1" />
    <!-- <transition enter-active-class="transition-all transform ease-in-out duration-300 delay-900"
        enter-from-class="opacity-0 scale-90" enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all transform ease-in-out duration-300 delay-400"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-90">
        <div class="memo-active-info w-22 absolute -left-20 top-2 hidden sm:block" v-if="showInfo">
          <div class="" :style="{ color: textColor, fontSize: textFontSize }">{{ formatDate(props.memo.create_ts, '/',
            true) }}</div>
        </div>
      </transition> -->
  </div>
</template>
