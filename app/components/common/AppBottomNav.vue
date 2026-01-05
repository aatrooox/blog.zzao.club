<script setup lang="ts">
const { navItems } = useAppNavigation()
// const { user, isLogin } = useUser()
const showLoginDialog = ref(false)
</script>

<template>
  <nav class="fixed bottom-4 left-4 right-4 z-50 h-16 backdrop-blur-xl shadow-lg md:hidden">
    <div class="flex justify-around items-center h-full px-2">
      <!-- User Avatar (Left) -->
      <!-- <div v-if="isLogin" class="flex items-center justify-center w-10 h-10" @click="navigateTo('/settings')">
        <UserAvatar :user="user" :size="32" />
      </div>
      <div v-else class="flex items-center justify-center w-10 h-10" @click="showLoginDialog = true">
        <Icon name="pixelarticons:user" class="w-6 h-6 text-zinc-400" />
      </div> -->

      <!-- Nav Items -->
      <NuxtLink
        v-for="nav in navItems"
        :key="nav.path"
        :to="nav.path"
        class="flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all duration-200"
        :class="[$route.path === nav.path ? 'text-primary' : 'text-zinc-400 hover:text-zinc-600']"
      >
        <Icon :name="nav.icon" class="w-6 h-6" />
        <!-- <span class="text-[10px] font-medium">{{ nav.name }}</span> -->
      </NuxtLink>
    </div>
  </nav>

  <AppLoginDialog v-model="showLoginDialog" />
</template>
