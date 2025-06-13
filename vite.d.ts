declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

declare module '#auth-utils' {
  interface User {
    // Add your own fields
    id: string | number
    login: string
    avatar_url: string
    email?: string
  }

  // interface UserSession {
  //   // Add your own fields
  // }

  // interface SecureSessionData {
  //   // Add your own fields
  // }
}
