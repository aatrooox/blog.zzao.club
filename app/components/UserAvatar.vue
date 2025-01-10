<template>
  <Avatar shape="circle" v-if="previewUrl || userInfo?.avatar_url">
    <AppImg :src="previewUrl || userInfo?.avatar_url"></AppImg>
  </Avatar>
  <Avatar :label="userInfo?.username[0]?.toUpperCase() || 'B'" shape="circle" v-else>
  </Avatar>
</template>
<script lang="ts" setup>
interface User {
  id: number;
  username: string;
  avatar_url: string
}

defineProps<{
  userInfo?: User | null,
  previewUrl?: string | null
}>()
</script>
<style lang="less" scoped></style>