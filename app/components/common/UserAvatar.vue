<script lang="ts" setup>
import type { User } from '~~/types/memo'

type UserInfo = User | {
  username: string
  nickname: string | null
  avatarUrl: string | null
}

const props = withDefaults(defineProps<{
  user?: UserInfo | null
  userInfo?: UserInfo | null
  previewUrl?: string
  size?: number
}>(), {
  size: 36,
})

const imgUrl = computed(() => {
  return props.previewUrl || props.user?.avatarUrl || props.userInfo?.avatarUrl
})

// 手动处理图片加载状态
const imageLoaded = ref(false)
const imageError = ref(false)

const handleImageLoad = () => {
  imageLoaded.value = true
  imageError.value = false
}

const handleImageError = () => {
  imageLoaded.value = false
  imageError.value = true
}

// 当 imgUrl 变化时重置状态
watch(imgUrl, () => {
  imageLoaded.value = false
  imageError.value = false
})

// 计算容器样式
const containerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

// 计算 fallback 图标大小
const iconSize = computed(() => {
  return Math.floor(props.size * 0.6) // 图标大小为容器的60%
})
</script>

<template>
  <div
    class="user-avatar-container relative overflow-hidden rounded-full bg-transparent"
    :style="containerStyle"
  >
    <!-- 头像图片 -->
    <NuxtImg
      v-if="imgUrl && !imageError"
      :src="imgUrl"
      :width="size"
      :height="size"
      :alt="user?.username || userInfo?.username || 'User Avatar'"
      class="absolute inset-0 w-full h-full object-cover rounded-full"
      @load="handleImageLoad"
      @error="handleImageError"
    />

    <!-- Fallback 图标 -->
    <div
      v-if="!imgUrl || imageError || !imageLoaded"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full"
    >
      <Icon
        name="pixelarticons:mood-happy"
        :size="`${iconSize}px`"
        class="text-gray-400"
      />
    </div>
  </div>
</template>

<style scoped>
.user-avatar-container {
  display: inline-block;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.user-avatar-container:hover {
  transform: scale(1.05);
}

/* 确保图片完全覆盖容器 */
:deep(img) {
  border-radius: inherit;
}
</style>
