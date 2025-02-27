export default function useErrorDispose() {
  const toast = useToast();
  const { clearUser } = useUser()
  const disposeError = (error: any) => {
    if (error && error.value) {
      toast.add({
        severity: 'error', 
        summary: 'Error',
        detail: error.value.data?.message || error.value.statusMessage,
        life: 3000
      })
      clearUser()    
    }
  }

  return {
    disposeError
  }
}