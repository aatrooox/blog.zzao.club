<script lang="ts" setup>
import type { User } from '@prisma/client'

const props = defineProps<{
  userInfo?: User | null
  previewUrl?: string
}>()
const fallbackText = computed(() => 'Z')

const imgUrl = computed(() => {
  return props.previewUrl || props.userInfo?.avatar_url
})
</script>

<template>
  <Avatar shape="circle" class="w-9 h-9">
    <AvatarImage :src="imgUrl ?? ''" alt="@unovue" />
    <AvatarFallback> {{ fallbackText }} </AvatarFallback>
  </Avatar>
  <!-- <Avatar :label="userInfo?.username[0]?.toUpperCase() || 'B'" shape="circle" v-else>
  </Avatar> -->
</template>

<style lang="less" scoped></style>
