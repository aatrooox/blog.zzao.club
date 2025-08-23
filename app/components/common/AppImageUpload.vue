<script setup lang="ts">
interface UploadFile {
  id: string
  file: File
  url: string
  uploading: boolean
  uploaded: boolean
  error?: string
  progress: number
}

interface Props {
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // MB
  accept?: string
  disabled?: boolean
  modelValue?: string[]
  filePath?: string
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
  (e: 'uploadSuccess', urls: string[]): void
  (e: 'uploadError', error: string): void
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  maxFiles: 9,
  maxSize: 10, // 10MB
  accept: 'image/*',
  disabled: false,
  modelValue: () => [],
  filePath: 'images',
})

const emit = defineEmits<Emits>()

const toast = useGlobalToast()
const fileInputRef = ref<HTMLInputElement>()
const uploadFiles = ref<UploadFile[]>([])
const isDragging = ref(false)
const isInitialized = ref(false) // 标记是否已初始化

// 计算属性
const canAddMore = computed(() => {
  if (!props.multiple)
    return uploadFiles.value.length === 0
  return uploadFiles.value.length < props.maxFiles
})

// const isUploading = computed(() => {
//   return uploadFiles.value.some(file => file.uploading)
// })

const uploadedUrls = computed(() => {
  return uploadFiles.value
    .filter(file => file.uploaded)
    .map(file => file.url)
})

// 监听上传完成的文件，emit 给父组件
watch(uploadedUrls, (newUrls, oldUrls) => {
  emit('update:modelValue', newUrls)

  // 只有在初始化完成后，且 URL 数量增加时才触发 success 事件
  if (isInitialized.value && newUrls.length > (oldUrls?.length || 0)) {
    const newlyUploadedUrls = newUrls.slice(oldUrls?.length || 0)
    emit('uploadSuccess', newlyUploadedUrls)
  }
}, { deep: true })

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`
}

// 图片压缩函数
function compressImage(file: File, maxSizeMB: number = 10, quality: number = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      // 计算压缩后的尺寸
      let { width, height } = img
      const maxDimension = 1920 // 最大尺寸

      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width
        width = maxDimension
      }
      else if (height > maxDimension) {
        width = (width * maxDimension) / height
        height = maxDimension
      }

      canvas.width = width
      canvas.height = height

      // 绘制压缩后的图片
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })

            // 检查压缩后的大小
            const compressedSizeMB = compressedFile.size / (1024 * 1024)
            if (compressedSizeMB > maxSizeMB && quality > 0.1) {
              // 如果还是太大，继续压缩
              compressImage(compressedFile, maxSizeMB, quality - 0.1).then(resolve)
            }
            else {
              resolve(compressedFile)
            }
          }
          else {
            resolve(file)
          }
        },
        file.type,
        quality,
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

// 验证文件
function validateFile(file: File): string | null {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    return '只能上传图片文件'
  }

  // 检查文件大小 (10MB 硬限制)
  const maxHardLimit = 10 * 1024 * 1024
  if (file.size > maxHardLimit) {
    return '文件大小不能超过 10MB'
  }

  return null
}

// 添加文件到上传列表
async function addFiles(files: FileList | File[]) {
  const fileArray = Array.from(files)

  for (const file of fileArray) {
    // 验证文件
    const error = validateFile(file)
    if (error) {
      toast.error(`${file.name}: ${error}`)
      continue
    }

    // 检查是否超出数量限制
    if (!props.multiple && uploadFiles.value.length >= 1) {
      uploadFiles.value = [] // 单张上传时清空之前的
    }
    else if (props.multiple && uploadFiles.value.length >= props.maxFiles) {
      toast.error(`最多只能上传 ${props.maxFiles} 张图片`)
      break
    }

    // 压缩图片（如果需要）
    let processedFile = file
    const fileSizeMB = file.size / (1024 * 1024)

    if (fileSizeMB > props.maxSize) {
      toast.info(`${file.name} 大小为 ${fileSizeMB.toFixed(1)}MB，正在压缩...`)
      try {
        processedFile = await compressImage(file, props.maxSize)
        const compressedSizeMB = processedFile.size / (1024 * 1024)
        toast.success(`压缩完成，${fileSizeMB.toFixed(1)}MB → ${compressedSizeMB.toFixed(1)}MB`)
      }
      catch {
        toast.error(`${file.name} 压缩失败`)
        continue
      }
    }

    // 创建预览 URL
    const previewUrl = URL.createObjectURL(processedFile)

    const uploadFile: UploadFile = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file: processedFile,
      url: previewUrl,
      uploading: false,
      uploaded: false,
      progress: 0,
    }

    uploadFiles.value.push(uploadFile)

    // 立即开始上传
    uploadSingleFile(uploadFile)
  }
}

// 上传单个文件
async function uploadSingleFile(uploadFile: UploadFile) {
  // 找到 uploadFiles 数组中对应的响应式对象
  const fileIndex = uploadFiles.value.findIndex(f => f.id === uploadFile.id)
  if (fileIndex === -1)
    return

  const file = uploadFiles.value[fileIndex]!
  file.uploading = true
  file.progress = 0

  try {
    // 使用 useUpload 上传到 COS，传入进度回调
    const result = await useUpload(
      file.file,
      { name: props.filePath },
      (progress: number) => {
        // 更新上传进度
        file.progress = Math.round(progress * 100)
      },
    ) as any

    console.log(`result`, result)
    // 清理预览 URL
    URL.revokeObjectURL(file.url)
    // 处理域名，更换为 useRuntimeconfig imgHost
    result.Location = result.Location.replace('zzaoclub-1300515367.cos.ap-singapore.myqcloud.com', useRuntimeConfig().public.imgHost)
    // 更新文件信息
    file.url = result.Location
    file.uploaded = true
    file.uploading = false
    file.progress = 100

    // 只在真正上传完成时显示成功提示
    toast.success('图片上传成功')
  }
  catch (error) {
    console.error('上传失败:', error)
    file.error = error instanceof Error ? error.message : '上传失败'
    file.uploading = false
    file.progress = 0
    toast.error(`上传失败: ${file.error}`)
    emit('uploadError', file.error)
  }
}

// 移除文件
function removeFile(fileId: string) {
  const index = uploadFiles.value.findIndex(f => f.id === fileId)
  if (index > -1) {
    const file = uploadFiles.value[index] as any
    if (file.url && file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url)
    }
    uploadFiles.value.splice(index, 1)

    // 移除文件时也需要更新父组件的值
    const currentUrls = uploadedUrls.value
    emit('update:modelValue', currentUrls)
  }
}

// 重新上传
function retryUpload(fileId: string) {
  const file = uploadFiles.value.find(f => f.id === fileId)
  if (file && file.error) {
    file.error = undefined
    uploadSingleFile(file)
  }
}

// 文件选择
function onFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    addFiles(target.files)
    target.value = '' // 清空 input，允许重复选择同一文件
  }
}

// 拖拽处理
function onDragOver(event: DragEvent) {
  event.preventDefault()
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false

  if (event.dataTransfer?.files) {
    addFiles(event.dataTransfer.files)
  }
}

// 打开文件选择器
function openFileSelector() {
  if (!props.disabled && canAddMore.value) {
    fileInputRef.value?.click()
  }
}

onMounted(() => {
  if (props.modelValue && props.modelValue.length > 0) {
    uploadFiles.value = props.modelValue.map(url => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file: new File([], url), // 创建一个空文件对象
      url,
      uploading: false,
      uploaded: true,
      progress: 100,
    }))
  }
  else {
    uploadFiles.value = []
  }

  // 初始化完成后设置标记，允许触发 success 事件
  nextTick(() => {
    isInitialized.value = true
  })
})
// 清理预览 URL
onUnmounted(() => {
  uploadFiles.value.forEach((file) => {
    if (file.url && file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url)
    }
  })
})
</script>

<template>
  <div class="app-image-upload">
    <!-- 隐藏的文件输入框 -->
    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      :multiple="multiple"
      class="hidden"
      @change="onFileSelect"
    >

    <!-- 图片网格：横向滚动布局 -->
    <div class="flex gap-1 overflow-x-auto pb-2">
      <!-- 上传按钮 -->
      <div
        v-if="canAddMore"
        class="upload-btn flex-shrink-0 w-18 h-24 pixel-card !m-0 cursor-pointer transition-all duration-200 flex items-center justify-center"
        :class="{
          'border-accent-pixel-cyan border-solid': isDragging,
          'opacity-50 cursor-not-allowed': disabled,
          'hover:bg-bg-pixel-tertiary': !disabled,
        }"
        @click="openFileSelector"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
      >
        <Icon
          name="lucide:plus"
          class="w-6 h-6 text-accent-pixel-cyan"
          :class="{ 'animate-pulse': isDragging }"
        />
      </div>

      <!-- 图片列表 -->
      <TooltipProvider>
        <div
          v-for="file in uploadFiles"
          :key="file.id"
          class="image-item flex-shrink-0 relative"
        >
          <Tooltip>
            <TooltipTrigger as-child>
              <!-- 图片容器 -->
              <div class="w-18 h-24 pixel-card !p-0 !m-0 overflow-hidden relative">
                <!-- 图片 -->
                <img
                  :src="file.url"
                  :alt="file.file.name"
                  class="w-full h-full object-contain"
                >

                <!-- 上传状态遮罩 -->
                <div
                  v-if="file.uploading"
                  class="absolute inset-0 bg-bg-pixel-primary bg-opacity-90 flex flex-col items-center justify-center"
                >
                  <Icon name="lucide:loader-2" class="w-4 h-4 text-accent-pixel-cyan animate-spin mb-1" />
                  <div class="text-xs font-mono text-accent-pixel-cyan">
                    {{ file.progress }}%
                  </div>
                </div>

                <!-- 成功状态 -->
                <div
                  v-else-if="file.uploaded"
                  class="absolute top-1 right-1"
                >
                  <div class="w-2 h-2 bg-status-pixel-success rounded-full flex items-center justify-center" />
                </div>

                <!-- 错误状态 -->
                <div
                  v-else-if="file.error"
                  class="absolute inset-0 bg-status-pixel-error bg-opacity-90 flex items-center justify-center"
                >
                  <Icon name="lucide:alert-circle" class="w-4 h-4 text-white" />
                </div>

                <!-- 删除按钮 -->
                <button
                  class="absolute top-1 left-1 w-4 h-4 bg-bg-pixel-primary bg-opacity-80 text-status-pixel-error hover:bg-opacity-100 transition-all flex items-center justify-center text-xs"
                  @click="removeFile(file.id)"
                >
                  ×
                </button>
              </div>
            </TooltipTrigger>

            <TooltipContent>
              <div class="text-center">
                <div class="font-medium">
                  {{ file.file.name }}
                </div>
                <div class="text-xs opacity-80">
                  {{ formatFileSize(file.file.size) }}
                </div>
                <div v-if="file.error" class="text-xs text-red-400 mt-1">
                  错误: {{ file.error }}
                </div>
                <div v-else-if="file.uploading" class="text-xs text-blue-400 mt-1">
                  上传中: {{ file.progress }}%
                </div>
                <div v-else-if="file.uploaded" class="text-xs text-green-400 mt-1">
                  上传成功
                </div>
              </div>
            </TooltipContent>
          </Tooltip>

          <!-- 重试按钮（错误时显示） -->
          <button
            v-if="file.error"
            class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-accent-pixel-cyan bg-white hover:bg-opacity-80 transition-all rounded flex justify-center items-center p-1"
            @click="retryUpload(file.id)"
          >
            <Icon class="11" name="mdi:reload" />
          </button>
        </div>
      </TooltipProvider>
    </div>

    <!-- 提示信息 -->
    <!-- <div v-if="uploadFiles.length === 0" class="mt-2 text-center text-text-pixel-secondary text-sm">
      {{ multiple ? `最多上传 ${maxFiles} 张图片` : '上传 1 张图片' }}，
      单张最大 {{ maxSize }}MB
    </div> -->

    <!-- 上传统计 -->
    <!-- <div v-else class="mt-6 text-xs text-text-pixel-secondary font-mono">
      已选择 {{ uploadFiles.length }} 张图片
      <template v-if="multiple">
        （最多 {{ maxFiles }} 张）
      </template>
      <span v-if="isUploading" class="text-accent-pixel-cyan ml-2">
        · 正在上传...
      </span>
    </div> -->
  </div>
</template>

<style scoped>
.upload-btn {
  border: 2px dashed var(--pixel-border-primary);
  border-radius: 0;
}

.upload-btn:hover {
  border-color: var(--pixel-accent-cyan);
}

.image-item {
  position: relative;
}

/* 横向滚动条样式 */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: var(--pixel-bg-secondary);
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: var(--pixel-accent-cyan);
  border-radius: 0;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: var(--pixel-accent-cyan-border);
}
</style>
