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
  <div>
    <div class="flex items-center justify-between gap-1.5 border-1 border-zinc-400 bg-zinc-100/10  relative px-4 py-1 rounded-tl-sm rounded-tr-lg">
      <div class="flex items-center gap-1.5 text-sm">
        <Icon :name="`vscode-icons:file-type-${vscodeIconMap(language)}`" />{{ filename }}
      </div>
      <ClientOnly>
        <button
          v-if="isSupported"
          class="flex items-center gap-1 px-2 py-1 text-xs text-text-primary hover:text-foreground transition-colors rounded border border-transparent hover:border-border-primary"
          title="复制代码"
          @click="copyCode"
        >
          <Icon :name=" copied ? 'lucide:check' : `lucide:copy`" />
        </button>
      </ClientOnly>
    </div>
    <pre ref="preRef" :class="$props.class" class="mt-0! rounded-none border-zinc-400 border border-t-0 py-0! overflow-x-auto leading-snug! rounded-bl-lg rounded-br-lg"><slot /></pre>
  </div>
</template>
