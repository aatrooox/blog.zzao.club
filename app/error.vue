<script lang="ts" setup>
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const toast = useGlobalToast()
const errMsg = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return '没有找到这个页面'
    case 500:
      return '服务器错误'
    default:
      return '未知错误'
  }
})

// 如果是服务器错误，重定向到首页
watch(props.error?.statusCode, (code) => {
  if (code === 500) {
    toast.error('服务器开错啦，请稍后再试')
    clearError({ redirect: '/' })
  }
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout>
    <div class="error-page flex flex-col gap-4">
      <div class="text-5xl">
        {{ props.error?.statusCode }}
      </div>
      <div class="text-xl font-bold">
        {{ props.error.message || errMsg }}
      </div>
      <div class="btns flex gap-4">
        <Button variant="default" @click="handleError">
          返回首页
        </Button>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="less" scoped></style>
