declare module '#auth-utils' {
  interface User {
    id: string
    username: string
    email: string
    avatar_url: string
    login: string
    name?: string
    html_url?: string
  }
}

export {}
