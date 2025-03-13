// 声明全局变量 umami
interface UmamiTrackEvent {
  (eventName: string, eventData?: Record<string, any>): void;
}

interface Umami {
  track: UmamiTrackEvent;
  // 添加 umami 的其他方法和属性
}

declare global {
  interface Window {
    umami: Umami;
  }
  
  // 也可以直接作为全局变量使用
  const umami: Umami;
}

// 这个导出是必要的，使这个文件被视为一个模块
export {};