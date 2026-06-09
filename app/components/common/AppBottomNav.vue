<script setup lang="ts">
const { navItems } = useAppNavigation()
</script>

<template>
  <nav class="fixed bottom-4 left-4 right-4 z-50 h-16 backdrop-blur-xl shadow-lg md:hidden">
    <div class="flex justify-around items-center h-full px-2">
      <NuxtLink
        v-for="nav in navItems"
        :key="nav.path"
        :to="nav.path"
        class="flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all duration-200"
        :class="[$route.path === nav.path ? 'text-primary' : 'text-zinc-400 hover:text-zinc-600']"
      >
        <Icon :name="nav.icon" class="w-6 h-6" />
      </NuxtLink>
    </div>
  </nav>
</template>
