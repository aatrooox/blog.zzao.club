<template>
  <Avatar shape="circle">
    <AvatarImage :src="imgUrl ?? ''" alt="@unovue" />
    <AvatarFallback> {{ (userInfo?.nickname?.[0] || userInfo?.username[0])?.toUpperCase() ?? 'Z' }} </AvatarFallback>
  </Avatar>
  <!-- <Avatar :label="userInfo?.username[0]?.toUpperCase() || 'B'" shape="circle" v-else>
  </Avatar> -->
</template>
<script lang="ts" setup>
import type { User } from '@prisma/client'

const props = defineProps<{
  userInfo?: User | null,
  previewUrl?: string
}>()

const imgUrl = computed(() => {
  return props.previewUrl || props.userInfo?.avatar_url
})
</script>
<style lang="less" scoped></style>