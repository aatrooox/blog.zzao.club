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
    class="pixel-tag-input"
    @click="focusActualInput"
  >
    <div class="flex flex-wrap items-center gap-1.5">
      <span
        v-for="(tag, index) in myTags"
        :key="index"
        class="pixel-tag"
      >
        #{{ tag }}
      </span>
      <input
        ref="inputElement"
        v-model="currentInput"
        type="text"
        class="pixel-input"
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
        class="pixel-suggestions"
      >
        <ul class="flex flex-wrap gap-1.5">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="suggestion"
            class="pixel-suggestion-item"
            :class="{
              'pixel-suggestion-active': index === activeSuggestionIndex,
              'pixel-suggestion-normal': index !== activeSuggestionIndex,
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
/* Pixel style tag input */
.pixel-tag-input {
  position: relative;
  padding: 0.5rem;
  cursor: text;
  background-color: var(--pixel-bg-card);
  border: 2px solid var(--pixel-border-input);
  width: 100%;
  box-sizing: border-box;
  font-family: ui-monospace, monospace;
  margin-bottom: 0.5rem;
}

.pixel-input {
  flex-grow: 1;
  border: none;
  outline: none;
  padding: 0.25rem 0.125rem;
  font-size: 1rem;
  min-width: 100px;
  background: transparent;
  color: var(--pixel-text-primary);
  font-family: ui-monospace, monospace;
}

.pixel-input::placeholder {
  color: var(--pixel-text-disabled);
}

.pixel-suggestions {
  position: absolute;
  z-index: 10;
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.5rem;
  background-color: var(--pixel-bg-secondary);
  border: 2px solid var(--pixel-border-primary);
  box-shadow: 2px 2px 0 var(--pixel-shadow-secondary);
  font-size: 0.875rem;
}

.pixel-suggestion-item {
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-family: ui-monospace, monospace;
  font-weight: bold;
  transition: all 0.1s ease;
}

.pixel-suggestion-active {
  background-color: var(--pixel-accent-cyan);
  color: var(--pixel-highlight-teal-text);
  border: 2px solid var(--pixel-highlight-teal-border);
}

.pixel-suggestion-normal {
  background-color: var(--pixel-bg-tertiary);
  color: var(--pixel-text-primary);
  border: 2px solid var(--pixel-shadow-primary);
}

.pixel-suggestion-normal:hover {
  background-color: var(--pixel-bg-quaternary);
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0 var(--pixel-shadow-secondary);
}
</style>
