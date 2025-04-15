<template>
  <Avatar shape="circle" v-if="imgUrl">
    <AvatarImage :src="imgUrl" alt="@unovue" />
    <AvatarFallback>IMG</AvatarFallback>
  </Avatar>
  <!-- <Avatar :label="userInfo?.username[0]?.toUpperCase() || 'B'" shape="circle" v-else>
  </Avatar> -->
</template>
<script lang="ts" setup>
import type { User } from '@prisma/client'

const props = defineProps<{
  userInfo?: User,
  previewUrl?: string
}>()

const imgUrl = computed( () => {
  return props.previewUrl || props.userInfo?.avatar_url
})
</script>
<style lang="less" scoped></style>