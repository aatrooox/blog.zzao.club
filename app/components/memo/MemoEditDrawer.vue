<script lang="ts" setup>
interface Props {
  open: boolean
  memo: any
}

interface Emits {
  'update:open': [value: boolean]
  'update': [data: { content: string, tags: string[] }]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { updateMemo } = useMemos()

// 编辑相关状态
const editTags = ref<string[]>([])
const isUpdating = ref(false)

// 监听memo变化，更新tags
watch(() => props.memo, (newMemo) => {
  if (newMemo && newMemo.tags) {
    // 从 tag 对象中提取 tag_name
    editTags.value = newMemo.tags.map((tagRelation: any) => tagRelation.tag.tag_name)
  }
  else {
    editTags.value = []
  }
}, { immediate: true, deep: true })

// 计算属性：是否打开
const isOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})

// 更新memo
async function handleUpdateMemo(data: any) {
  if (!props.memo)
    return

  try {
    isUpdating.value = true

    await updateMemo(props.memo.id, {
      content: data.content,
      tags: data.tags,
    })

    // 关闭抽屉
    isOpen.value = false

    // 触发更新事件
    emit('update', {
      content: data.content,
      tags: data.tags,
    })
  }
  catch (error) {
    console.error('更新失败:', error)
  }
  finally {
    isUpdating.value = false
  }
}

// 取消编辑
function handleCancel() {
  isOpen.value = false
}
</script>

<template>
  <Drawer v-model:open="isOpen">
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>正在编辑 Memo</DrawerTitle>
        <DrawerDescription />
      </DrawerHeader>
      <div class="px-4 pb-4">
        <div class="mb-4">
          <AppTagInput v-model="editTags" />
        </div>
        <AppCommentInput
          v-if="memo"
          :key="memo.id"
          :show-hello="false"
          :tags="editTags"
          :initial-value="memo.content"
          :disabled="isUpdating"
          placeholder="修改你的想法..."
          input-tip="修改你的 Memo 内容"
          :submit-btn-text="isUpdating ? '更新中...' : '更新'"
          @send="handleUpdateMemo"
          @cancel="handleCancel"
        />
      </div>
    </DrawerContent>
  </Drawer>
</template>
