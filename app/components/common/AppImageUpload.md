# AppImageUpload 组件使用说明

## 功能特性

- ✅ **单张/多张上传**: 支持单张和多张图片上传
- ✅ **拖拽上传**: 支持拖拽文件到上传区域
- ✅ **图片预览**: 实时预览选中的图片
- ✅ **智能压缩**: 超过指定大小自动压缩
- ✅ **进度显示**: 实时显示上传进度
- ✅ **错误处理**: 完善的错误提示和重试机制
- ✅ **类型验证**: 只允许上传图片文件
- ✅ **像素风格**: 使用项目的像素风格主题

## Props 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `multiple` | `boolean` | `false` | 是否支持多张上传 |
| `maxFiles` | `number` | `5` | 最大文件数量（仅多张上传时有效） |
| `maxSize` | `number` | `10` | 单张图片最大大小（MB，超过会自动压缩） |
| `accept` | `string` | `image/*` | 接受的文件类型 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `modelValue` | `string[]` | `[]` | v-model 绑定的图片 URL 数组 |

## Events 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:modelValue` | `urls: string[]` | 上传完成的图片 URL 数组 |
| `upload-success` | `urls: string[]` | 上传成功时触发 |
| `upload-error` | `error: string` | 上传失败时触发 |

## 使用示例

### 1. 基础单张上传

```vue
<template>
  <div>
    <AppImageUpload
      v-model="avatarUrl"
      @upload-success="onAvatarUpload"
    />
    
    <p v-if="avatarUrl.length">
      已上传: {{ avatarUrl[0] }}
    </p>
  </div>
</template>

<script setup>
const avatarUrl = ref([])

function onAvatarUpload(urls) {
  console.log('头像上传成功:', urls[0])
}
</script>
```

### 2. 多张图片上传

```vue
<template>
  <div>
    <AppImageUpload
      v-model="photoUrls"
      :multiple="true"
      :max-files="10"
      :max-size="5"
      @upload-success="onPhotosUpload"
      @upload-error="onUploadError"
    />
    
    <div v-if="photoUrls.length" class="mt-4">
      <h3>已上传 {{ photoUrls.length }} 张图片:</h3>
      <div class="grid grid-cols-4 gap-2 mt-2">
        <img
          v-for="url in photoUrls"
          :key="url"
          :src="url"
          class="w-20 h-20 object-cover pixel-border"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
const photoUrls = ref([])

function onPhotosUpload(urls) {
  console.log('图片上传成功:', urls)
}

function onUploadError(error) {
  console.error('上传失败:', error)
}
</script>
```

### 3. 在表单中使用

```vue
<template>
  <form @submit="onSubmit">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">头像</label>
        <AppImageUpload v-model="form.avatar" />
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2">相册图片</label>
        <AppImageUpload
          v-model="form.photos"
          :multiple="true"
          :max-files="20"
        />
      </div>
      
      <button type="submit" class="pixel-btn-primary">
        保存
      </button>
    </div>
  </form>
</template>

<script setup>
const form = reactive({
  avatar: [],
  photos: []
})

function onSubmit(event) {
  event.preventDefault()
  
  const data = {
    avatar: form.avatar[0] || null,
    photos: form.photos
  }
  
  console.log('提交数据:', data)
  // 发送到后端...
}
</script>
```

### 4. 在 Memo 组件中使用

```vue
<template>
  <div class="memo-editor">
    <textarea
      v-model="content"
      placeholder="写点什么..."
      class="pixel-textarea mb-4"
    />
    
    <AppImageUpload
      v-model="attachedImages"
      :multiple="true"
      :max-files="9"
      :max-size="8"
      @upload-success="onImagesAttached"
    />
    
    <button
      @click="saveMemo"
      :disabled="!content.trim()"
      class="pixel-btn-primary mt-4"
    >
      发布
    </button>
  </div>
</template>

<script setup>
const content = ref('')
const attachedImages = ref([])

function onImagesAttached(urls) {
  console.log('图片已添加到备忘录:', urls)
}

async function saveMemo() {
  const memoData = {
    content: content.value,
    photos: attachedImages.value
  }
  
  try {
    // 调用 API 保存备忘录
    await $fetch('/api/v1/memos', {
      method: 'POST',
      body: memoData
    })
    
    // 重置表单
    content.value = ''
    attachedImages.value = []
    
    console.log('备忘录保存成功')
  } catch (error) {
    console.error('保存失败:', error)
  }
}
</script>
```

## 技术特性

### 图片压缩算法

- 使用 Canvas API 进行客户端压缩
- 自动调整图片尺寸（最大 1920px）
- 渐进式质量压缩（从 0.8 降到 0.1）
- 确保压缩后文件小于设定的最大大小

### 文件验证

- 严格的文件类型检查（只允许图片）
- 硬性大小限制（50MB）
- 数量限制检查

### 错误处理

- 网络错误自动重试
- 详细的错误信息提示
- 失败文件可单独重新上传

### 性能优化

- 使用 `URL.createObjectURL` 进行本地预览
- 自动清理内存中的 Blob URL
- 异步压缩避免阻塞 UI

## 注意事项

1. **上传大小限制**: 组件会自动压缩超过 `maxSize` 的图片，但建议用户上传前就使用合适大小的图片
2. **文件格式**: 支持所有浏览器支持的图片格式（JPG、PNG、GIF、WebP 等）
3. **并发上传**: 多张图片会并发上传，提高效率
4. **内存管理**: 组件会自动清理预览图片的内存，避免内存泄漏
