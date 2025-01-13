<template>
  <NuxtLayout>
    <div class="error-page flex flex-col gap-4">
      <div class="text-5xl">{{ props.error?.statusCode }}</div>
      <div class="text-xl font-bold">{{ props.error.message || errMsg }}</div>
      <div class="btns flex gap-4">
        <Button @click="handleError" severity="success">返回到刚才的页面</Button>
        <Button @click="concatAuthor" :severity="copyed ? 'primary' : 'danger'">{{ copyed ? '已复制' : '加微信痛骂' }}</Button>
      </div>
    </div>

  </NuxtLayout>
</template>
<script lang="ts" setup>
import type { NuxtError } from '#app'
const copyed = ref(false)
const props = defineProps<{ error: NuxtError }>()

const concatAuthor = async () => {
  await navigator.clipboard.writeText(`523748995`);
  copyed.value = true
}
const errMsg = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return '没有找到这个页面，一定是作者偷懒了！'
    case 500:
      return '服务器错误'
    default:
      return '未知错误'
  }
})
const handleError = () => clearError({ redirect: '/' })

</script>
<style lang="less" scoped></style>