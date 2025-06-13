<script lang="ts" setup>
import type { User } from '@prisma/client'

const { $api } = useNuxtApp()
const userStore = useUserStore()
const tokenStore = useTokenStore()
const { clear } = useUserSession()
async function logout() {
  await $api.post('/api/v1/user/logout')
  userStore.logout()
  tokenStore.setToken('')
  clear()
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <UserAvatar :user-info="(userStore.user as User)" />
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>
        {{ (userStore.user as User).nickname || (userStore.user as User).username }}
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
