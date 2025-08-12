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
    <DrawerContent class="pixel-drawer">
      <DrawerHeader class="pixel-drawer-header">
        <DrawerTitle class="pixel-drawer-title">正在编辑 Memo</DrawerTitle>
        <DrawerDescription />
      </DrawerHeader>
      <div class="pixel-drawer-content">
        <div class="pixel-tag-section">
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

<style scoped>
/* Pixel style for MemoEditDrawer */
.pixel-drawer {
  background-color: oklch(20% 0.05 250);
  border: 2px solid oklch(40% 0.1 250);
  border-radius: 0;
  font-family: ui-monospace, monospace;
  image-rendering: pixelated;
}

.pixel-drawer-header {
  background-color: oklch(25% 0.05 250);
  border-bottom: 2px solid oklch(40% 0.1 250);
  padding: 16px;
}

.pixel-drawer-title {
  color: oklch(90% 0.02 250);
  font-size: 18px;
  font-weight: bold;
  font-family: ui-monospace, monospace;
  text-shadow: 1px 1px 0 oklch(10% 0.05 250);
}

.pixel-drawer-content {
  padding: 16px;
  background-color: oklch(20% 0.05 250);
}

.pixel-tag-section {
  margin-bottom: 16px;
  padding: 12px;
  background-color: oklch(25% 0.05 250);
  border: 1px solid oklch(40% 0.1 250);
  border-radius: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pixel-drawer-header {
    padding: 12px;
  }

  .pixel-drawer-content {
    padding: 12px;
  }

  .pixel-drawer-title {
    font-size: 16px;
  }

  .pixel-tag-section {
    padding: 8px;
    margin-bottom: 12px;
  }
}
</style>
