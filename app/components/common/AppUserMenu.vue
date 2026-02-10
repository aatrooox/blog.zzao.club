<script lang="ts" setup>
import type { User } from '~~/types/memo'

const { $api } = useNuxtApp()
const userStore = useUser()
const { isSuperAdmin } = useUser()

async function logout() {
  await $api.post('/api/v1/user/logout')
  userStore.logout()
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <UserAvatar :user-info="(userStore.user.value as User)" />
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>
        {{ (userStore.user.value as User).nickname || (userStore.user.value as User).username }}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem v-if="isSuperAdmin" @click="navigateTo('/admin')">
        <span>管理后台</span>
      </DropdownMenuItem>
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
