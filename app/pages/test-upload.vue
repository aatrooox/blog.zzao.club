<script setup lang="ts">
interface UploadLog {
  time: string
  type: 'success' | 'error' | 'info'
  message: string
}

// 响应式数据
const singleImage = ref<string[]>([])
const multipleImages = ref<string[]>([])
const formData = reactive({
  avatar: [] as string[],
  photos: [] as string[],
  description: '',
})
const submittedData = ref<any>(null)
const uploadLogs = ref<UploadLog[]>([])

// 添加日志
function addLog(type: UploadLog['type'], message: string) {
  const time = new Date().toLocaleTimeString()
  uploadLogs.value.unshift({ time, type, message })

  // 限制日志数量
  if (uploadLogs.value.length > 50) {
    uploadLogs.value = uploadLogs.value.slice(0, 50)
  }
}

// 事件处理
function onSingleUpload(urls: string[]) {
  addLog('success', `单张上传成功: ${urls[0]}`)
}

function onMultipleUpload(urls: string[]) {
  addLog('success', `多张上传成功: 共 ${urls.length} 张图片`)
}

function onAvatarUpload(urls: string[]) {
  addLog('info', `头像上传完成: ${urls[0]}`)
}

function onUploadError(error: string) {
  addLog('error', `上传失败: ${error}`)
}

function removeImage(index: number) {
  multipleImages.value.splice(index, 1)
  addLog('info', `移除了第 ${index + 1} 张图片`)
}

function submitForm() {
  const data = {
    avatar: formData.avatar[0] || null,
    photos: formData.photos,
    description: formData.description,
    timestamp: new Date().toISOString(),
  }

  submittedData.value = data
  addLog('success', `表单提交成功，包含 ${formData.photos.length} 张照片`)

  // 可以在这里发送到后端
  console.log('提交的表单数据:', data)
}

function clearLogs() {
  uploadLogs.value = []
}

// 页面 SEO
useHead({
  title: '图片上传组件测试',
  meta: [
    { name: 'description', content: '测试 AppImageUpload 组件的各种使用场景' },
  ],
})
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-8 pixel-title">
      图片上传组件测试
    </h1>

    <div class="space-y-8">
      <!-- 单张上传测试 -->
      <section class="pixel-card">
        <h2 class="text-lg font-semibold mb-4 pixel-title">
          单张图片上传
        </h2>
        <AppImageUpload
          v-model="singleImage"
          @upload-success="onSingleUpload"
          @upload-error="onUploadError"
        />
        <div v-if="singleImage.length" class="mt-4">
          <p class="text-sm text-text-pixel-secondary mb-2">
            上传结果:
          </p>
          <img
            :src="singleImage[0]"
            alt="上传的图片"
            class="w-32 h-32 object-cover pixel-border"
          >
          <p class="text-xs mt-2 text-text-pixel-disabled break-all">
            {{ singleImage[0] }}
          </p>
        </div>
      </section>

      <!-- 多张上传测试 -->
      <section class="pixel-card">
        <h2 class="text-lg font-semibold mb-4 pixel-title">
          多张图片上传
        </h2>
        <AppImageUpload
          v-model="multipleImages"
          :multiple="true"
          :max-files="6"
          :max-size="5"
          @upload-success="onMultipleUpload"
          @upload-error="onUploadError"
        />
        <div v-if="multipleImages.length" class="mt-4">
          <p class="text-sm text-text-pixel-secondary mb-2">
            已上传 {{ multipleImages.length }} 张图片:
          </p>
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="(url, index) in multipleImages"
              :key="url"
              class="relative"
            >
              <img
                :src="url"
                :alt="`图片 ${index + 1}`"
                class="w-full h-24 object-cover pixel-border"
              >
              <button
                class="absolute top-1 right-1 bg-status-pixel-error text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                @click="removeImage(index)"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 表单场景测试 -->
      <section class="pixel-card">
        <h2 class="text-lg font-semibold mb-4 pixel-title">
          表单场景测试
        </h2>
        <form class="space-y-4" @submit.prevent="submitForm">
          <div>
            <label class="block text-sm font-medium mb-2 pixel-text">
              用户头像
            </label>
            <AppImageUpload
              v-model="formData.avatar"
              @upload-success="onAvatarUpload"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 pixel-text">
              相册照片
            </label>
            <AppImageUpload
              v-model="formData.photos"
              :multiple="true"
              :max-files="10"
              :max-size="8"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 pixel-text">
              描述
            </label>
            <textarea
              v-model="formData.description"
              placeholder="请输入描述..."
              class="pixel-textarea w-full"
              rows="3"
            />
          </div>

          <button
            type="submit"
            class="pixel-btn-primary"
            :disabled="!formData.description.trim()"
          >
            提交表单
          </button>
        </form>

        <!-- 表单数据预览 -->
        <div v-if="submittedData" class="mt-6 p-4 bg-bg-pixel-tertiary rounded">
          <h3 class="text-sm font-semibold mb-2 pixel-title">
            提交的数据:
          </h3>
          <pre class="text-xs text-text-pixel-secondary overflow-auto">{{ JSON.stringify(submittedData, null, 2) }}</pre>
        </div>
      </section>

      <!-- 上传日志 -->
      <section class="pixel-card">
        <h2 class="text-lg font-semibold mb-4 pixel-title">
          上传日志
        </h2>
        <div class="space-y-2 max-h-40 overflow-y-auto">
          <div
            v-for="(log, index) in uploadLogs"
            :key="index"
            class="text-xs p-2 bg-bg-pixel-secondary rounded"
            :class="{
              'text-status-pixel-success': log.type === 'success',
              'text-status-pixel-error': log.type === 'error',
              'text-text-pixel-secondary': log.type === 'info',
            }"
          >
            [{{ log.time }}] {{ log.message }}
          </div>
        </div>
        <button
          class="pixel-btn text-xs mt-2"
          :disabled="uploadLogs.length === 0"
          @click="clearLogs"
        >
          清空日志
        </button>
      </section>
    </div>
  </div>
</template>
