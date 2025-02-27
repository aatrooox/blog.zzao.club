interface User {
  id: number
  username: string
  password: string
  email: string
  role: string
  avatar_url: string
}
const localStorage = window?.localStorage || null
export default function useUser() {
  const user: Ref<User | null> = useState('user', () => null)

  const setUser = (value: any) => {
    localStorage?.setItem('blog_user', JSON.stringify(value))
    user.value = value
  }

  const clearUser = () => {
    localStorage?.removeItem('blog_user')
    user.value = null
  }

  const isLogin = computed(() => {
    return !!user.value
  })

  return {
    isLogin,
    user,
    setUser,
    clearUser
  }
}