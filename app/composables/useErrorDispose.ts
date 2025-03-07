export default function useErrorDispose() {
  const toast = useToast();
  const userStore = useUserStore()
  const disposeError = (error: any) => {
    if (error && error.value) {
      console.log(`error`, error)
      toast.add({
        severity: 'error', 
        summary: 'Error',
        detail: error.value.data?.message || error.value.statusMessage,
        life: 3000
      })
      // userStore.logout()    
    }
  }

  return {
    disposeError
  }
}