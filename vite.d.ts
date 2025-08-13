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

// 声明全局变量 umami
interface UmamiTrackEvent {
  (eventName: string, eventData?: Record<string, any>): void
}

interface Umami {
  track: UmamiTrackEvent
  // 添加 umami 的其他方法和属性
}

declare global {
  interface Window {
    umami: Umami
  }

  // 也可以直接作为全局变量使用
  const umami: Umami
}

export default {}
