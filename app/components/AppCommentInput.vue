<template>
  <FloatLabel variant="on">
    <Textarea class="w-full" id="over_label" autoResize v-model="comment" :rows="rows" style="resize: none;"
      @value-change="emit('value-change', comment)" maxlength="256" />
    <label for="on_label">{{ label }}</label>
  </FloatLabel>

  <div class="btns flex justify-between items-center">
    <div class="left flex items-center gap-2">
      <!-- <Button rounded text @click="toggle">
        <Icon name="icon-park-outline:face-with-smiling-open-eyes"></Icon>
      </Button> -->
      <span class="text-xs text-zinc-400">最多256字符</span>

      <span class="text-xs text-zinc-400">
        所有人可以回复
      </span>
      <!-- <Popover ref="emojiPopover">
        <EmojiPicker :native="true" :display-recent="true" :hide-search="true" :hide-group-icons="true"
          :theme="emojiTheme" @select="onSelectEmoji" ref="EmojiPickerRef"></EmojiPicker>
      </Popover> -->

    </div>
    <div class="right">
      <Button size="small" text @click="cancelSend">
        <Icon name="icon-park-outline:close-one"></Icon><span>取消</span>
      </Button>
      <Button size="small" text @click="sendComment">
        <Icon name="icon-park-outline:send"></Icon><span>发送</span>
      </Button>
    </div>
  </div>
</template>
<script lang="ts" setup>

const emit = defineEmits(['value-change', 'send', 'cancel'])
const { user } = useUser()
const emojiPopover = ref(null)
const color = useColorMode()
const EmojiPickerRef = ref()
const comment = ref<string>('')
// type 在哪里评论， target 评论的对象
const { type = 'memo', target = '' } = defineProps<{ type?: string, target?: string }>()

const emojiTheme = computed(() => {
  switch (color.preference) {
    case 'dark':
      return 'dark';
    case 'light':
      return 'light';
    case 'system':
      return 'auto';
  }
})
const label = computed(() => {
  // 发表评论时，显示 在发表 xxx 
  // 回复某条评论时，显示回复 xxx
  if (target) return subCommentLabel.value

  const name = user.value?.username || '游客'
  switch (type) {
    case 'memo':
      return `memo by ${name}`
    case 'blog':
      return `留言 by ${name}`
    case 'comment':
      return `评论 by ${name}`
    case 'reply':
      return `回复 by ${name}`
    default:
      return `memo by ${name}`
  }
})

const rows = ref<number>(3)
const cols = ref<number>(30)

const subCommentLabel = computed(() => {
  return `回复@${target || user.value?.username}`
})

const toggle = (event) => {
  (emojiPopover.value as any)?.toggle(event);
}

const onSelectEmoji = (emoji: any) => {
  console.log(`emoji`, emoji)
  comment.value += emoji.i
}

const clear = () => {
  comment.value = ''
}

const sendComment = () => {
  emit('send', comment.value)
  clear()
}

const cancelSend = () => {
  clear()
  emit('cancel')
}
defineExpose({ clear })
</script>
<style lang="less" scoped></style>