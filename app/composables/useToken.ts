export default function useToken() {
  const token = useState('token', () => '')
  const localStorage = window?.localStorage || null

  const setToken = (value: string) => {
    localStorage?.setItem('blog_token', value)
    token.value = value
  }

  const clearToken = () => {
    localStorage?.removeItem('blog_token')
    token.value = ''
  }

  return {
    token,
    setToken,
    clearToken
  }
}