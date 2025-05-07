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
      <DropdownMenuLabel>{{ (userStore.user as User).nickname || (userStore.user as User).username }}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="navigateTo('/settings')">
        <span>设置</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="logout">
        <span>退出登录</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<style scoped></style>