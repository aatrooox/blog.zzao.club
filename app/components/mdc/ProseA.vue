<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  href: {
    type: String,
    default: '',
  },
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined>,
    default: undefined,
    required: false,
  },
})

const isExternal = computed(() => {
  const href = props.href || ''
  if (!href)
    return false
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:'))
    return false
  if (href.startsWith('/') && !href.startsWith('//'))
    return false
  try {
    if (import.meta.client && href.startsWith('//'))
      return true
    const url = new URL(href, import.meta.client ? window.location.origin : 'https://blog.nezus.cn')
    if (import.meta.client)
      return url.origin !== window.location.origin
    return !['blog.nezus.cn', 'zzao.club', 'www.zzao.club'].includes(url.hostname)
  }
  catch {
    return false
  }
})

const resolvedTarget = computed(() => {
  if (props.target !== undefined && props.target !== null)
    return props.target
  return isExternal.value ? '_blank' : undefined
})

const resolvedRel = computed(() => {
  return isExternal.value ? 'noopener noreferrer' : undefined
})
</script>

<template>
  <NuxtLink
    :href="props.href"
    :target="resolvedTarget"
    :rel="resolvedRel"
    class="article-link"
    :class="{ 'article-link-external': isExternal }"
    @click.stop
  >
    <slot />
    <Icon
      v-if="isExternal"
      name="lucide:external-link"
      class="article-link-icon"
      aria-hidden="true"
    />
  </NuxtLink>
</template>
