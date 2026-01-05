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
const userStore = useUser()
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
  if (userStore.user.value?.username) {
    visitorName.value = userStore.user.value.username
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
    <div class="w-full">
      <div v-if="!userStore.isLogin" class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <Input v-model="visitorName" placeholder="名字" :disabled="userStore.isVisitor" class="w-full" />
        <Input v-model="visitorEmail" placeholder="邮箱" type="email" class="w-full" />
        <Input v-model="visitorWebsite" placeholder="你的主页" class="w-full" />
      </div>
      <div v-else-if="showHello" class="text-sm font-bold text-primary mb-2">
        Hi，{{ userStore.user.value.nickname || userStore.user.value.username }}。欢迎评论👏
      </div>
      <div v-show="!userStore.isLogin && visitorEmail" class="flex items-center gap-2 mb-2">
        <div class="flex items-center space-x-2">
          <Checkbox id="terms2" v-model="allowEmailNotify" disabled />
          <label for="terms2" class="text-sm text-gray-700 dark:text-gray-300">
            收到回复时邮件通知我
          </label>
        </div>
      </div>
      <Textarea
        id="over_label"
        ref="commentInputRef" v-model="comment" class="w-full min-h-[100px] p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" auto-resize :rows="rows"
        maxlength="512" :placeholder="placeholder" @value-change="emit('valueChange', comment)" @click.stop
      />
      <div class="flex flex-col md:flex-row justify-between items-center mt-2 gap-2">
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400">{{ inputTip }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors flex items-center gap-1" @click="cancelSend">
            <Icon name="icon-park-outline:close-one" /><span>{{ cancelBtnText }}</span>
          </button>
          <button class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors flex items-center gap-1" @click="sendComment">
            <Icon name="icon-park-outline:send" /><span>{{ submitBtnText }}</span>
          </button>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
</style>
