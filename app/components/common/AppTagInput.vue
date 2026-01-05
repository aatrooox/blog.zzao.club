<script setup lang="ts">
import useTags from '~/composables/useTags'

const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const { tags: allTags, getTags } = useTags()
const myTags = ref<string[]>([...props.modelValue])
const currentInput = ref<string>('')
const showSuggestions = ref<boolean>(false)
const suggestions = ref<string[]>([])
const activeSuggestionIndex = ref<number>(-1)
const inputElement = ref<HTMLInputElement | null>(null)

watch(() => props.modelValue, (newValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(myTags.value)) {
    myTags.value = [...newValue]
  }
}, { deep: true })

onMounted(() => {
  getTags()
})

function resetActiveSuggestion(): void {
  activeSuggestionIndex.value = -1
}

function filterSuggestions(): void {
  if (currentInput.value.trim() === '') {
    suggestions.value = []
    showSuggestions.value = false
    return
  }
  suggestions.value = allTags.value
    .map(t => t.tagName)
    .filter(tag => tag.toLowerCase().includes(currentInput.value.toLowerCase()))
  showSuggestions.value = suggestions.value.length > 0
  resetActiveSuggestion()
}

function addTagFromInput(): void {
  const newTag = currentInput.value.trim()
  if (newTag && !myTags.value.includes(newTag)) {
    myTags.value.push(newTag)
    currentInput.value = ''
    publishChanges()
    showSuggestions.value = false
  }
  else if (newTag && myTags.value.includes(newTag)) {
    currentInput.value = ''
    showSuggestions.value = false
  }
}

function selectTag(tag: string): void {
  if (!myTags.value.includes(tag)) {
    myTags.value.push(tag)
    publishChanges()
  }
  currentInput.value = ''
  showSuggestions.value = false
  inputElement.value?.focus()
}

function handleInput(): void {
  filterSuggestions()
}

function handleFocus(): void {
  filterSuggestions()
}

function handleBlur(): void {
  // Delay hiding suggestions to allow click event on suggestions to fire
  setTimeout(() => {
    showSuggestions.value = false
  }, 150)
}

function handleKeydown(event: KeyboardEvent): void {
  if (!showSuggestions.value || suggestions.value.length === 0) {
    if (event.key === 'Enter') {
      handleEnter()
    }
    else if (event.key === 'Backspace') {
      handleBackspace()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      activeSuggestionIndex.value = (activeSuggestionIndex.value + 1) % suggestions.value.length
      break
    case 'ArrowUp':
      event.preventDefault()
      activeSuggestionIndex.value = (activeSuggestionIndex.value - 1 + suggestions.value.length) % suggestions.value.length
      break
    case 'ArrowRight':
      event.preventDefault()
      if (activeSuggestionIndex.value === -1) {
        activeSuggestionIndex.value = 0
      }
      else {
        activeSuggestionIndex.value = (activeSuggestionIndex.value + 1) % suggestions.value.length
      }
      break
    case 'ArrowLeft':
      event.preventDefault()
      if (activeSuggestionIndex.value === -1) {
        activeSuggestionIndex.value = suggestions.value.length - 1
      }
      else {
        activeSuggestionIndex.value = (activeSuggestionIndex.value - 1 + suggestions.value.length) % suggestions.value.length
      }
      break
    case 'Enter':
      event.preventDefault()
      if (activeSuggestionIndex.value !== -1 && suggestions.value[activeSuggestionIndex.value]) {
        selectTag(suggestions.value[activeSuggestionIndex.value]!)
      }
      else {
        addTagFromInput()
      }
      resetActiveSuggestion()
      break
    case 'Escape':
      showSuggestions.value = false
      resetActiveSuggestion()
      break
    case 'Backspace':
      handleBackspace()
      break
  }
}

function handleEnter(): void {
  addTagFromInput()
}

function handleBackspace(): void {
  if (currentInput.value === '' && myTags.value.length > 0) {
    myTags.value.pop()
    publishChanges()
  }
}

function publishChanges(): void {
  const newTags = [...myTags.value]
  emit('update:modelValue', newTags)
  emit('change', newTags)
}

function focusActualInput(): void {
  nextTick(() => {
    inputElement.value?.focus()
  })
}
</script>

<template>
  <div
    class="relative p-2 cursor-text bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-md w-full mb-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all"
    @click="focusActualInput"
  >
    <div class="flex flex-wrap items-center gap-1.5">
      <span
        v-for="(tag, index) in myTags"
        :key="index"
        class="px-2 py-0.5 text-sm text-primary bg-primary/10 rounded-full"
      >
        #{{ tag }}
      </span>
      <input
        ref="inputElement"
        v-model="currentInput"
        type="text"
        class="flex-grow border-none outline-none p-1 text-sm min-w-[100px] bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
        placeholder="输入标签..."
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      >
    </div>
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showSuggestions && suggestions.length > 0"
        class="absolute z-10 w-full left-0 mt-2 p-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
      >
        <ul class="flex flex-wrap gap-1.5">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="suggestion"
            class="px-2 py-1 text-sm cursor-pointer rounded-md transition-colors"
            :class="{
              'bg-primary text-white': index === activeSuggestionIndex,
              'bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600': index !== activeSuggestionIndex,
            }"
            @mousedown.prevent="selectTag(suggestion)"
          >
            {{ suggestion }}
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
</style>
