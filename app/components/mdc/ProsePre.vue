<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
})

const source = ref('')
const { copy, copied, isSupported } = useClipboard({ source })

const toast = useGlobalToast()
const preRef = ref()

const copyCode = async () => {
  try {
    let textToCopy = props.code

    // 如果没有传入code prop，则从pre元素中获取文本内容
    if (!textToCopy && preRef.value) {
      textToCopy = preRef.value.textContent
    }

    if (textToCopy) {
      copy(textToCopy)
    }
    else {
      toast.error('没有可复制的内容')
    }
  }
  catch (err) {
    console.error('复制失败:', err)
    toast.error('复制失败')
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between gap-1.5 border border-muted bg-default border-b-0 relative rounded-t-md px-4 py-3">
      <div class="flex items-center gap-1.5">
        <Icon :name="`vscode-icons:file-type-${language}`" />{{ filename }}
      </div>
      <ClientOnly>
        <button
          v-if="isSupported"
          class="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded border border-transparent hover:border-muted"
          title="复制代码"
          @click="copyCode"
        >
          <Icon :name=" copied ? 'lucide:check' : `lucide:copy`" />
        </button>
      </ClientOnly>
    </div>
    <pre ref="preRef" :class="$props.class">
      <slot />
    </pre>
  </div>
</template>

<style>
pre code .line {
  display: block;
}
</style>
