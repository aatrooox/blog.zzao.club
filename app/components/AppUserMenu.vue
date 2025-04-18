<script lang="ts" setup>
import type { User } from '@prisma/client'
const { $api } = useNuxtApp()
const userStore = useUserStore()
const tokenStore = useTokenStore()
const logout = async () => {
  await $api.post('/api/v1/user/logout')
  userStore.logout();
  tokenStore.setToken('')
}

</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <UserAvatar :userInfo="(userStore.user as User)"></UserAvatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuItem @click="logout">
        <span>退出登录</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<style scoped></style>