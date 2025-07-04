import { ref } from 'vue'

const showSearchDialog = ref(false)

export function useSearch() {
  function openSearchDialog() {
    showSearchDialog.value = true
  }
  function closeSearchDialog() {
    showSearchDialog.value = false
  }
  return {
    showSearchDialog,
    openSearchDialog,
    closeSearchDialog,
  }
}
