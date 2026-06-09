<script setup lang="ts">
const navBarStore = useNavBar()

interface MenuItem {
  label: string
  icon: string
  route?: string
  href?: string
  children?: MenuItem[]
}
const items = ref<MenuItem[]>([
  {
    label: '首页',
    icon: 'twemoji:wedding',
    route: '/',
  },
  {
    label: '文章',
    icon: 'twemoji:page-facing-up',
    route: '/article',
  },
  {
    label: 'IMGX',
    icon: 'twemoji:framed-picture',
    route: '/imgx',
  },
  {
    label: '友链',
    icon: 'twemoji:clinking-beer-mugs',
    route: '/links',
  },
  {
    label: '关于',
    icon: 'icon-park-outline:setting-two',
    route: '/about',
  },
])
</script>

<template>
  <div
    class="sticky top-0 w-full z-[49] mb-4 md:mb-8 transition-all duration-200"
    :style="{
      top: navBarStore.navBar.value?.isHidden ? '0px' : '-100px',
    }"
  >
    <div class="pixel-bg pixel-border-bottom pixel-shadow-md pixel-font">
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3 md:gap-4">
            <NuxtLink to="/" class="flex items-center gap-2 md:gap-3 group">
              <div class="w-8 h-8 md:w-10 md:h-10 pixel-btn-primary flex items-center justify-center group-hover:pixel-btn-secondary transition-all duration-200">
                <Icon name="twemoji:wedding" class="text-white text-sm md:text-lg" />
              </div>
              <span class="text-lg md:text-xl pixel-title pixel-text hidden sm:block group-hover:text-[var(--pixel-gradient-start)] transition-colors duration-200">早早集市</span>
            </NuxtLink>
          </div>

          <nav class="hidden md:flex items-center gap-2">
            <div v-for="menu in items" :key="menu.label" class="relative">
              <NuxtLink
                v-slot="{ isActive, navigate }"
                :to="menu.route"
                custom
                class="cursor-pointer"
              >
                <button
                  class="px-4 py-2 pixel-border pixel-font font-bold text-sm transition-all duration-200 hover:scale-105"
                  :class="[
                    isActive
                      ? 'pixel-btn-primary'
                      : 'pixel-btn-secondary hover:pixel-btn-primary',
                  ]"
                  @click="navigate"
                >
                  <div class="flex items-center gap-2">
                    <span>{{ menu.label }}</span>
                  </div>
                </button>
              </NuxtLink>
            </div>
          </nav>

          <ClientOnly>
            <nav class="block md:hidden">
              <AppNavDrawer />
            </nav>
          </ClientOnly>
        </div>
      </div>
    </div>

    <div class="h-1 bg-gradient-to-r from-[var(--pixel-gradient-start)] via-[var(--pixel-gradient-mid)] to-[var(--pixel-gradient-end)]">
      <div class="max-w-7xl mx-auto px-4 md:px-8 h-full" />
    </div>
  </div>
</template>
