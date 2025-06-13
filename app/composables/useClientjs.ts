export function useClientjs() {
  const fingerprint = useState('blog/fingerprint', () => '')
  const { $clientjs } = useNuxtApp()
  const genFingerprint = () => {
    const id = $clientjs.getFingerprint()
    fingerprint.value = id
  }

  const getVisitorId = () => {
    if (!fingerprint.value) {
      genFingerprint()
    }

    return fingerprint.value
  }

  return {
    fingerprint,
    genFingerprint,
    getVisitorId,
  }
}
