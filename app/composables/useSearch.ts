import { ref } from 'vue'

// 全局唯一响应式变量
const showSearchDialog = ref(false)
const searchParams = ref<{ tag?: string, text?: string }>({})

function openSearchDialog(params?: { tag?: string, text?: string }) {
  if (params) searchParams.value = params
  showSearchDialog.value = true
}
function closeSearchDialog() {
  showSearchDialog.value = false
}

export function useSearch() {
  return { showSearchDialog, openSearchDialog, closeSearchDialog, searchParams }
}
