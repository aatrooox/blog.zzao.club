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
  <div class="pixel-code-block">
    <div class="pixel-code-header">
      <div class="flex items-center gap-1.5 font-mono text-sm">
        <Icon :name="`vscode-icons:file-type-${language}`" />{{ filename }}
      </div>
      <ClientOnly>
        <button
          v-if="isSupported"
          class="pixel-btn-copy"
          title="复制代码"
          @click="copyCode"
        >
          <Icon :name=" copied ? 'lucide:check' : `lucide:copy`" />
        </button>
      </ClientOnly>
    </div>
    <pre ref="preRef" class="pixel-code-content" :class="$props.class">
      <slot />
    </pre>
  </div>
</template>

<style>
pre code .line {
  display: block;
}

.pixel-code-block {
  background: var(--pixel-bg-card);
  border: 2px solid var(--pixel-border-primary);
  border-radius: 8px;
  box-shadow:
    2px 2px 0 var(--pixel-border-primary),
    4px 4px 0 var(--pixel-bg-tertiary);
  margin: 16px 0;
  overflow: hidden;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.pixel-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--pixel-bg-code);
  border-bottom: 2px solid var(--pixel-border-primary);
  color: var(--pixel-text-muted);
  font-family: ui-monospace, monospace;
}

.pixel-btn-copy {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--pixel-bg-tertiary);
  color: var(--pixel-text-code);
  border: 2px solid var(--pixel-border-secondary);
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pixel-btn-copy:hover {
  background: var(--pixel-bg-quaternary);
  color: var(--pixel-text-muted);
  transform: translateY(-1px);
  box-shadow: 1px 1px 0 var(--pixel-border-secondary);
}

.pixel-btn-copy:active {
  transform: translateY(1px);
  box-shadow: none;
}

.pixel-code-content {
  padding: 16px;
  margin: 0;
  background: transparent;
  color: var(--pixel-text-secondary);
  font-family: ui-monospace, monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
}
</style>
