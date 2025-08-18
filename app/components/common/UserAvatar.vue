<script lang="ts" setup>
import type { User } from '~~/types/memo'

type UserInfo = User | {
  username: string
  nickname: string | null
  avatarUrl: string | null
}

const props = defineProps<{
  user?: UserInfo | null
  userInfo?: UserInfo | null
  previewUrl?: string
}>()
// const fallbackText = computed(() => 'Z')

const imgUrl = computed(() => {
  return props.previewUrl || props.user?.avatarUrl || props.userInfo?.avatarUrl
})
</script>

<template>
  <Avatar shape="circle" class="w-9 h-9 bg-transparent">
    <AvatarImage :src="imgUrl ?? ''" alt="@unovue" />
    <AvatarFallback>
      <Icon name="pixelarticons:mood-happy" size="4em" />
    </AvatarFallback>
  </Avatar>
  <!-- <Avatar :label="userInfo?.username[0]?.toUpperCase() || 'B'" shape="circle" v-else>
  </Avatar> -->
</template>

<style lang="less" scoped></style>
