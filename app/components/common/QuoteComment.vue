<script lang="ts" setup>
import type { CommentData, Visitor } from '@@/types/blog'

const {
  content = '',
  articleId,
} = defineProps<{ content?: string, articleId: string }>()
const emit = defineEmits(['close', 'success'])
const { $api } = useNuxtApp()
const toast = useGlobalToast()
const userStore = useUserStore()
async function createQuoteComment(comment: CommentData) {
  if (!articleId) {
    toast.warn('文章不存在，无法注释')
    return
  }

  if (!userStore?.user?.id) {
    await createVistorID(comment.visitor as Visitor)
  }

  const res = await $api.post('/api/v1/explain', {
    content: comment.content, // 注解内容
    text: content, // 引用内容
    article_id: articleId,
  })

  if (!res.error) {
    toast.add({ type: 'success', message: '已添加注解' })
    umami.track('explain', { page: articleId, isOk: true })
    emit('success')
  }
}
</script>

<template>
  <div class="quote-comment">
    <div class="quote-content relative px-6 py-4 min-h-20">
      <Icon name="material-symbols:format-quote" size="4em" class="rotate-180 text-zinc-200 absolute -top-10 left-0" />
      <div class="font-bold text-lg">
        {{ content }}
      </div>
      <span class="tip absolute right-0 bottom-2 text-zinc-600 text-xs">引用原文</span>
    </div>
    <AppCommentInput :show-hello="false" input-tip="仅博主可编写注解" @cancel="emit('close')" @send="createQuoteComment" />
  </div>
</template>

<style scoped></style>
