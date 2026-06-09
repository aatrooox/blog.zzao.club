<script setup lang="ts">
defineProps({
  maxWidthClass: {
    type: String,
    default: 'max-w-2xl',
  },
})

const { navItems } = useAppNavigation()
</script>

<template>
  <header class="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-zinc-100">
    <div class="mx-auto px-4 h-14 flex items-center justify-between" :class="[maxWidthClass]">
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <Icon name="pixelarticons:radio-signal" class="w-6 h-6 text-zinc-800 group-hover:text-primary transition-colors" />
        <span class="font-bold text-lg tracking-tight text-zinc-800 group-hover:text-primary transition-colors">早早集市</span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="nav in navItems"
          :key="nav.path"
          :to="nav.path"
          class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          :class="[$route.path === nav.path ? 'text-primary bg-primary/10' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50']"
        >
          {{ nav.name }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
