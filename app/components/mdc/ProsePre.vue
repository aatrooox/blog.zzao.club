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

const vscodeIconMap = (lang: string | null) => {
  if (!lang)
    return 'rnc'

  const langMap: Record<string, string> = {
    // Common mappings
    text: 'rnc',
    txt: 'rnc',
    plaintext: 'rnc',

    // JavaScript/TypeScript
    javascript: 'js',
    js: 'js',
    typescript: 'ts',
    ts: 'ts',
    jsx: 'reactjs',
    tsx: 'reactts',

    // Web
    html: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    vue: 'vue',

    // Config formats
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'toml',
    xml: 'xml',

    // Shell/Scripts
    shell: 'shell',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    fish: 'shell',
    powershell: 'powershell',
    ps1: 'powershell',

    // Programming languages
    python: 'python',
    py: 'python',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    csharp: 'csharp',
    cs: 'csharp',
    go: 'go',
    rust: 'rust',
    rs: 'rust',
    php: 'php',
    ruby: 'ruby',
    rb: 'ruby',
    swift: 'swift',
    kotlin: 'kotlin',
    kt: 'kotlin',

    // Database
    sql: 'sql',
    mysql: 'mysql',
    postgresql: 'pgsql',
    postgres: 'pgsql',

    // Markup/Documentation
    markdown: 'markdown',
    md: 'markdown',
    mdx: 'mdx',

    // Others
    docker: 'docker',
    dockerfile: 'docker',
    git: 'git',
    graphql: 'graphql',
    prisma: 'prisma',
  }

  return langMap[lang.toLowerCase()] || 'text'
}
</script>

<template>
  <div data-article-pre class="group/code relative my-6 font-sans text-[0.95rem]">
    <div class="flex items-center justify-between gap-2 px-3 py-1.5 rounded-t-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-900/60 text-xs text-zinc-500">
      <div class="flex items-center gap-1.5 min-w-0 truncate">
        <Icon v-if="language" :name="`vscode-icons:file-type-${vscodeIconMap(language)}`" class="shrink-0" />
        <span class="truncate">{{ filename || language || 'code' }}</span>
      </div>
      <ClientOnly>
        <button
          v-if="isSupported"
          type="button"
          class="flex items-center gap-1 px-1.5 py-0.5 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors rounded cursor-pointer opacity-70 group-hover/code:opacity-100"
          title="复制代码"
          @click="copyCode"
        >
          <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" />
        </button>
      </ClientOnly>
    </div>
    <pre
      ref="preRef"
      :class="$props.class"
      class="mt-0! mb-0! rounded-t-none rounded-b-md border border-t-0 border-zinc-200 dark:border-zinc-700 py-3! px-4! overflow-x-auto leading-relaxed! bg-zinc-50/50 dark:bg-zinc-900/40 text-[0.9em]"
    ><slot /></pre>
  </div>
</template>
