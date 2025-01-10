export default function useLoadedOnce() {
  const loadedOnecFetchs = useState<string[]>('loadedOnceFetchs', () => [])

  const addLoadedFetch = (fullPath: string) => {
    loadedOnecFetchs.value.push(fullPath)
  }

  const clearLoadedFetch = () => {
    loadedOnecFetchs.value = []
  }

  const isLoaded = (fullPath: string) => {
    return loadedOnecFetchs.value.includes(fullPath)
  }

  return {
    addLoadedFetch,
    clearLoadedFetch,
    isLoaded,
  }
}