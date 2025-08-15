<script lang="ts" setup>
import md5 from 'md5'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { login } = useAuth()
const username = ref('')
const password = ref('')
const isLoading = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

async function submit() {
  if (!username.value || !password.value) {
    return
  }

  isLoading.value = true
  try {
    await login({
      username: username.value,
      password: md5(password.value),
    })
    isOpen.value = false
    username.value = ''
    password.value = ''
  }
  catch (error) {
    console.error('登录失败:', error)
  }
  finally {
    isLoading.value = false
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    submit()
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click.self="isOpen = false"
  >
    <div class="pixel-login-dialog">
      <!-- 对话框头部 -->
      <div class="pixel-dialog-header">
        <h2 class="pixel-dialog-title">
          <Icon name="twemoji:locked-with-key" class="mr-2" />
          用户登录
        </h2>
        <button
          class="pixel-close-btn"
          @click="isOpen = false"
        >
          <Icon name="twemoji:cross-mark" />
        </button>
      </div>

      <!-- 对话框内容 -->
      <div class="pixel-dialog-content">
        <p class="pixel-dialog-desc">
          登录后可以参与更多互动 (未注册的用户会注册后自动登录)
        </p>

        <!-- 登录表单 -->
        <div class="pixel-form">
          <div class="pixel-form-group">
            <label class="pixel-form-label">
              <Icon name="twemoji:bust-in-silhouette" class="mr-2" />
              用户名
            </label>
            <input
              v-model="username"
              type="text"
              class="pixel-input"
              placeholder="请输入用户名"
              @keydown="handleKeydown"
            >
          </div>

          <div class="pixel-form-group">
            <label class="pixel-form-label">
              <Icon name="twemoji:locked" class="mr-2" />
              密码
            </label>
            <input
              v-model="password"
              type="password"
              class="pixel-input"
              placeholder="请输入密码"
              @keydown="handleKeydown"
            >
          </div>
        </div>

        <!-- 登录按钮 -->
        <div class="pixel-dialog-actions">
          <a
            href="/api/v1/auth/github"
            class="pixel-btn pixel-btn-secondary"
          >
            <Icon name="twemoji:cat-face" class="mr-2" />
            GitHub 登录
          </a>
          <button
            class="pixel-btn pixel-btn-primary"
            :disabled="isLoading || !username || !password"
            @click="submit"
          >
            <Icon v-if="isLoading" name="twemoji:clockwise-vertical-arrows" class="mr-2 animate-spin" />
            <Icon v-else name="twemoji:check-mark" class="mr-2" />
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';
/* 像素风格登录对话框 */
.pixel-login-dialog {
  @apply w-full max-w-md mx-4 bg-white rounded-lg border-4 border-gray-800 font-mono;
  box-shadow: 8px 8px 0px #000;
}

/* 对话框头部 */
.pixel-dialog-header {
  @apply flex items-center justify-between p-4 bg-gray-100 border-b-4 border-gray-800 rounded-t-md;
}

.pixel-dialog-title {
  @apply text-lg font-bold text-gray-800 flex items-center;
}

.pixel-close-btn {
  @apply w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 border-2 border-gray-800 rounded transition-all duration-200;
  box-shadow: 2px 2px 0px #000;
}

.pixel-close-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px #000;
}

/* 对话框内容 */
.pixel-dialog-content {
  @apply p-6;
}

.pixel-dialog-desc {
  @apply text-sm text-gray-600 mb-6 leading-relaxed;
}

/* 表单样式 */
.pixel-form {
  @apply space-y-4 mb-6;
}

.pixel-form-group {
  @apply space-y-2;
}

.pixel-form-label {
  @apply block text-sm font-bold text-gray-800 flex items-center;
}

.pixel-input {
  @apply w-full px-3 py-2 bg-white border-2 border-gray-800 rounded font-mono text-sm transition-all duration-200;
  box-shadow: 2px 2px 0px #000;
}

.pixel-input:focus {
  @apply outline-none border-blue-600;
  box-shadow: 2px 2px 0px #1d4ed8;
  transform: translate(-1px, -1px);
}

.pixel-input::placeholder {
  @apply text-gray-400;
}

/* 按钮样式 */
.pixel-dialog-actions {
  @apply flex gap-3 justify-end;
}

.pixel-btn {
  @apply px-4 py-2 font-bold text-sm border-2 border-gray-800 rounded transition-all duration-200 flex items-center font-mono;
  box-shadow: 2px 2px 0px #000;
}

.pixel-btn:hover:not(:disabled) {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px #000;
}

.pixel-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.pixel-btn-primary {
  @apply bg-blue-500 hover:bg-blue-600 text-white;
}

.pixel-btn-primary:hover:not(:disabled) {
  box-shadow: 3px 3px 0px #1d4ed8;
}

.pixel-btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800;
}

.pixel-btn-secondary:hover {
  box-shadow: 3px 3px 0px #374151;
}

/* 动画效果 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
