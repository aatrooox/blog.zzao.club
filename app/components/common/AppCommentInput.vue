<script lang="ts" setup>
import type { CommentData } from '@nuxtjs/mdc'

// 是否显示标签列表
// 当前输入的标签在输入内容的位置
// const searchTagIndex = ref<number[]>([]);
//
// const inputTag = ref<string>('')
// type 在哪里评论， target 评论的对象
const {
  // type = 'comment',
  // target = '',
  showHello = true,
  submitBtnText = '发送',
  cancelBtnText = '取消',
  inputTip = '最多256字符，所有人可以回复',
  placeholder = '说点什么吧！',
  initialValue = '',
  tags = [],
} = defineProps<{ type?: string, target?: string, showHello?: boolean, submitBtnText?: string, cancelBtnText?: string, inputTip?: string, placeholder?: string, initialValue?: string, tags?: string[] }>()
const emit = defineEmits(['valueChange', 'send', 'cancel'])
const userStore = useUserStore()
// const emojiPopover = ref(null)
// const color = useColorMode()
// const EmojiPickerRef = ref()
const commentInputRef = ref()
const comment = ref<string>('')
const visitorName = ref('')
const visitorEmail = ref('')
const visitorWebsite = ref('')
const allowEmailNotify = ref(false)

// const selectedCity = ref();
// const tags = ref();

// const label = computed(() => {
//   // 发表评论时，显示 在发表 xxx
//   // 回复某条评论时，显示回复 xxx
//   if (target) return subCommentLabel.value

//   const name = userStore?.user.username || '游客'
//   switch (type) {
//     case 'memo':
//       return `memo by ${name}`
//     case 'blog':
//       return `留言 by ${name}`
//     case 'comment':
//       return `评论 by ${name}`
//     case 'reply':
//       return `回复 by ${name}`
//     default:
//       return `评论 by ${name}`
//   }
// })

// const initTagList = async (tag: string) => {
//   // const { data } = await $http.get<any[]>('/api/v1/tag/list', { tag }, { key: 'tags - ' + inputTag.value, server: false })
//   // tags.value = data.value?.data;
// }

const rows = ref<number>(3)
// const cols = ref<number>(30)

// 从textarea中提取标签
// function extractTags(content: string) {
//   const tagRegex = /#([^\s#]+)/g
//   const tags = new Set() // 使用 Set 去重
//   let match

//   while (true) {
//     match = tagRegex.exec(content)
//     if (match === null) {
//       break
//     }
//     tags.add(match[1])
//   }

//   return Array.from(tags) // 将 Set 转换为数组
// }

// 移除 textarea 中的标签
// const removeTagsFromTextarea = (content: string) => {
//   return content.replace(/#([^\s#]+)/g, '').trim();
// }

// // 动态展示标签列表
// watch(comment, () => {
//   // 此时光标在哪里输入
//   const cursorIndex = commentInputRef.value.$el.selectionStart
//   // 此时输入的值是否是#
//   const isInputTag = comment.value[cursorIndex - 1] === '#';
//   const isSpace = comment.value[cursorIndex - 1] === ' ';
//   if (showTagList.value && isSpace) {
//     showTagList.value = false;
//     return;
//   }
//   // 如果是#则触发标签的列表查询, 后续的输入都视为标签内容, 直到出现空格为止
//   if (isInputTag) {
//     showTagList.value = true;
//     searchTagIndex.value[0] = cursorIndex
//   }
//   // 如果此时正在输入标签
//   if (showTagList.value) {
//     // 更新索引的截止位置
//     searchTagIndex.value[1] = cursorIndex;
//     // 如果输入时, 正在删除, 则不再查询
//     if (typeof searchTagIndex.value[1] === 'number' && typeof searchTagIndex.value[0] === 'number' && searchTagIndex.value[1] < searchTagIndex.value[0]) {
//       showTagList.value = false;
//       return;
//     }
//     inputTag.value = comment.value.substring(searchTagIndex.value[0] as number, searchTagIndex.value[1] as number);
//     initTagList(inputTag.value)
//   }
// })

// const subCommentLabel = computed(() => {
//   return `回复@${target || userStore?.user?.username}`
// })

// const toggle = (event: any) => {
//   (emojiPopover.value as any)?.toggle(event);
// }

// const onSelectEmoji = (emoji: any) => {
//   console.log(`emoji`, emoji)
//   comment.value += emoji.i
// }

function clear() {
  comment.value = ''
}

function sendComment() {
  const data: CommentData & { tags?: string[] } = {
    content: comment.value,
    visitor: {
      name: visitorName.value,
      email: visitorEmail.value,
      website: visitorWebsite.value,
      allowEmailNotify: allowEmailNotify.value,
    },
    tags,
  }
  // comment.value = removeTagsFromTextarea(comment.value);
  if (comment.value)
    emit('send', data)
}

function cancelSend() {
  clear()
  emit('cancel')
}

onMounted(() => {
  if (userStore.user?.username) {
    visitorName.value = userStore.user.username
  }
  // 设置初始值
  if (initialValue) {
    comment.value = initialValue
  }
})

defineExpose({ clear })
</script>

<template>
  <ClientOnly>
    <div class="pixel-comment-input">
      <div v-if="!userStore.isLogin" class="pixel-visitor-form">
        <Input v-model="visitorName" placeholder="名字" :disabled="userStore.isVisitor" class="pixel-input-field" />
        <Input v-model="visitorEmail" placeholder="邮箱" type="email" class="pixel-input-field" />
        <Input v-model="visitorWebsite" placeholder="你的主页" class="pixel-input-field" />
      </div>
      <div v-else-if="showHello" class="pixel-hello">
        Hi，{{ userStore.user.nickname || userStore.user.username }}。欢迎评论👏
      </div>
      <div v-show="!userStore.isLogin && visitorEmail" class="pixel-checkbox-container">
        <div class="flex items-center space-x-2">
          <Checkbox id="terms2" v-model="allowEmailNotify" disabled class="pixel-checkbox" />
          <label for="terms2" class="pixel-label">
            收到回复时邮件通知我
          </label>
        </div>
      </div>
      <Textarea
        id="over_label"
        ref="commentInputRef" v-model="comment" class="pixel-textarea" auto-resize :rows="rows"
        maxlength="512" :placeholder="placeholder" @value-change="emit('valueChange', comment)" @click.stop
      />
      <div class="pixel-buttons">
        <div class="pixel-tip">
          <span class="pixel-text">{{ inputTip }}</span>
        </div>
        <div class="pixel-button-group">
          <button class="pixel-button pixel-button-secondary" @click="cancelSend">
            <Icon name="icon-park-outline:close-one" /><span>{{ cancelBtnText }}</span>
          </button>
          <button class="pixel-button pixel-button-primary" @click="sendComment">
            <Icon name="icon-park-outline:send" /><span>{{ submitBtnText }}</span>
          </button>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
/* Pixel style comment input */
.pixel-comment-input {
  transition: all 0.3s ease-in-out;
  font-family: ui-monospace, monospace;
}

.pixel-visitor-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.pixel-input-field {
  background-color: var(--pixel-bg-card);
  border: 2px solid var(--pixel-border-input);
  color: var(--pixel-text-primary);
  font-family: ui-monospace, monospace;
  padding: 0.5rem;
  flex: 1;
  min-width: 120px;
}

.pixel-hello {
  font-size: 0.875rem;
  padding-bottom: 0.5rem;
  color: var(--pixel-accent-cyan);
  font-family: ui-monospace, monospace;
  font-weight: bold;
}

.pixel-checkbox-container {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.pixel-checkbox {
  border: 2px solid var(--pixel-border-primary);
}

.pixel-label {
  font-size: 0.875rem;
  line-height: 1;
  color: var(--pixel-text-primary);
  font-family: ui-monospace, monospace;
}

.pixel-textarea {
  width: 100%;
  background-color: var(--pixel-bg-card);
  border: 2px solid var(--pixel-border-input);
  color: var(--pixel-text-primary);
  font-family: ui-monospace, monospace;
  padding: 0.75rem;
  resize: vertical;
  min-height: 80px;
}

.pixel-textarea:focus {
  outline: none;
  border-color: var(--pixel-border-focus);
  box-shadow: 0 0 0 2px var(--pixel-accent-cyan-border);
}

.pixel-textarea::placeholder {
  color: var(--pixel-text-disabled);
}

.pixel-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
}

.pixel-tip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pixel-text {
  font-size: 0.75rem;
  color: var(--pixel-text-muted);
  font-family: ui-monospace, monospace;
}

.pixel-button-group {
  display: flex;
  gap: 0.5rem;
}

.pixel-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  font-family: ui-monospace, monospace;
  font-weight: bold;
  font-size: 0.875rem;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  background: none;
}

.pixel-button-primary {
  background-color: var(--pixel-accent-cyan);
  color: var(--pixel-highlight-green-text);
  border-color: var(--pixel-accent-cyan-border);
}

.pixel-button-primary:hover {
  background-color: var(--pixel-accent-cyan-hover);
  border-color: var(--pixel-accent-cyan-border);
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0 var(--pixel-accent-cyan-border);
}

.pixel-button-secondary {
  background-color: var(--pixel-bg-tertiary);
  color: var(--pixel-text-primary);
  border-color: var(--pixel-bg-primary);
}

.pixel-button-secondary:hover {
  background-color: var(--pixel-bg-quaternary);
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0 var(--pixel-shadow-secondary);
}

@media (max-width: 768px) {
  .pixel-visitor-form {
    flex-direction: column;
  }

  .pixel-buttons {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  .pixel-button-group {
    justify-content: center;
  }
}
</style>
