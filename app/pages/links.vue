<script lang="ts" setup>
definePageMeta({ layout: 'content' })

useHead({
  title: '友链｜早早集市',
  meta: [
    {
      name: 'description',
      content: '早早集市友情链接，点击和我互换友链吧',
    },
  ],
  link: [
    { rel: 'canonical', href: 'https://zzao.club/links' },
  ],
})

const { links } = useAppConfig()
</script>

<template>
  <div class="site-content">
    <SiteHeader variant="links" />

    <section>
      <div class="font-sans flex items-center justify-between gap-3 mb-5">
        <h2 class="text-xs font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
          友情链接
        </h2>
        <span class="text-xs tabular-nums text-zinc-400">
          {{ links?.length ?? 0 }}
        </span>
      </div>

      <div v-if="!links?.length" class="py-12 text-center text-sm text-zinc-400">
        暂无友链
      </div>

      <ul v-else class="divide-y divide-zinc-100 dark:divide-zinc-800/80">
        <li v-for="link of links" :key="link.url">
          <NuxtLink
            :href="link.url"
            target="_blank"
            class="group flex items-center gap-3.5 py-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 -mx-2 px-2 rounded-md transition-colors"
          >
            <AppImg
              :src="link.logo || `${link.url}/favicon.ico`"
              :alt="link.name"
              class="w-9 h-9 shrink-0 rounded-full object-cover"
            />
            <div class="min-w-0 flex-1">
              <h3 class="text-[15px] md:text-base font-medium text-[var(--article-text)] group-hover:text-primary transition-colors truncate leading-snug">
                {{ link.name }}
              </h3>
              <p
                v-if="link.desc"
                class="mt-0.5 text-xs text-[var(--article-muted)] line-clamp-1"
              >
                {{ link.desc }}
              </p>
            </div>
            <Icon
              name="lucide:arrow-up-right"
              class="w-4 h-4 shrink-0 text-zinc-300 dark:text-zinc-600 group-hover:text-primary transition-colors"
            />
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>
