import type { Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted, ref } from 'vue'

// 注册 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger)

export interface UseStickyOptions {
  /** 吸顶时距离顶部的高度，默认 0px */
  topOffset?: number
  /** 吸顶时的固定宽度，如果不传则使用元素原始宽度 */
  fixedWidth?: number | string
  /** 动画过渡距离，默认 20px */
  animationDistance?: number
  /** 额外的触发偏移量，默认 0px */
  triggerOffset?: number
  /** 是否启用调试日志 */
  debug?: boolean
}

export interface UseStickyReturn {
  /** 是否处于吸顶状态 */
  isSticky: Ref<boolean>
  /** 手动刷新吸顶计算 */
  refresh: () => void
  /** 手动销毁吸顶效果 */
  destroy: () => void
}

/**
 * 吸顶组合式函数
 * @param elementRef 要吸顶的元素 ref
 * @param options 配置选项
 * @returns 返回吸顶状态和控制方法
 */
export function useSticky(
  elementRef: Ref<HTMLElement | null>,
  options: UseStickyOptions = {},
): UseStickyReturn {
  const {
    topOffset = 0,
    fixedWidth,
    animationDistance = 20,
    triggerOffset = 0,
    debug = false,
  } = options

  const isSticky = ref(false)
  let scrollTrigger: ScrollTrigger | null = null
  let originalStyles: Record<string, any> = {}

  const log = (...args: any[]) => {
    if (debug) {
      console.log('[useSticky]', ...args)
    }
  }

  const saveOriginalStyles = (element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element)
    originalStyles = {
      position: computedStyle.position,
      top: computedStyle.top,
      left: computedStyle.left,
      width: computedStyle.width,
      transform: computedStyle.transform,
      backdropFilter: computedStyle.backdropFilter,
      borderRadius: computedStyle.borderRadius,
      padding: computedStyle.padding,
      boxShadow: computedStyle.boxShadow,
      zIndex: computedStyle.zIndex,
      background: computedStyle.background,
    }
    log('保存原始样式:', originalStyles)
  }

  const restoreOriginalStyles = (element: HTMLElement) => {
    gsap.set(element, {
      position: 'relative',
      top: 'auto',
      left: 'auto',
      width: 'auto',
      transform: 'scale(1)',
      backdropFilter: 'none',
      borderRadius: '0px',
      padding: '0px',
      boxShadow: 'none',
      zIndex: 'auto',
      background: 'transparent',
    })
    log('恢复原始样式')
  }

  const destroy = () => {
    if (scrollTrigger) {
      scrollTrigger.kill()
      scrollTrigger = null
      log('销毁吸顶动画')
    }

    if (elementRef.value) {
      restoreOriginalStyles(elementRef.value)
      isSticky.value = false
    }
  }

  const createStickyAnimation = () => {
    if (!elementRef.value) {
      log('元素不存在，无法创建吸顶动画')
      return
    }

    // 获取元素的原始位置信息
    const element = elementRef.value
    const rect = element.getBoundingClientRect()
    const originalTop = element.offsetTop
    const originalLeft = rect.left
    const originalWidth = fixedWidth || rect.width
    const elementHeight = element.offsetHeight

    // 保存原始样式
    saveOriginalStyles(element)

    // 计算吸顶触发点
    const startStickyPoint = originalTop + elementHeight + triggerOffset
    const endStickyPoint = startStickyPoint + animationDistance

    log('吸顶参数:', {
      originalTop,
      originalLeft,
      originalWidth,
      elementHeight,
      startStickyPoint,
      endStickyPoint,
      topOffset,
    })

    // 创建 ScrollTrigger 动画
    scrollTrigger = ScrollTrigger.create({
      trigger: 'body',
      start: `${startStickyPoint}px top`,
      end: `${endStickyPoint}px top`,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress
        const scrollY = window.pageYOffset
        const shouldStick = scrollY >= startStickyPoint

        log('吸顶进度:', {
          progress,
          scrollY,
          startStickyPoint,
          shouldStick,
        })

        isSticky.value = shouldStick

        if (shouldStick) {
          // 吸顶状态
          gsap.set(element, {
            position: 'fixed',
            top: `${topOffset}px`,
            left: `${originalLeft}px`,
            width: typeof originalWidth === 'number' ? `${originalWidth}px` : originalWidth,
            transform: 'scale(1)',
            backdropFilter: `blur(${Math.min(progress * 8, 6)}px)`,
            borderRadius: `${Math.min(progress * 6, 4)}px`,
            padding: `${Math.min(progress * 8, 0)}px ${Math.min(progress * 16, 0)}px`,
            boxShadow: `0 2px 8px rgba(0, 0, 0, ${Math.min(progress * 0.15, 0.1)})`,
            zIndex: 50,
            background: 'rgba(255, 255, 255, 0.02)',
          })
        }
        else {
          // 原始状态
          isSticky.value = false
          restoreOriginalStyles(element)
        }
      },
      onEnter: () => log('进入吸顶区域'),
      onLeave: () => log('离开吸顶区域'),
      onEnterBack: () => log('返回吸顶区域'),
      onLeaveBack: () => log('离开吸顶区域（向上滚动）'),
    })

    log('吸顶动画创建成功')
  }

  const refresh = () => {
    destroy()
    setTimeout(() => {
      createStickyAnimation()
    }, 100)
  }

  onMounted(() => {
    // 延迟创建动画，确保元素已渲染
    setTimeout(() => {
      createStickyAnimation()
    }, 300)
  })

  onUnmounted(() => {
    destroy()
    ScrollTrigger.killAll()
  })

  return {
    isSticky,
    refresh,
    destroy,
  }
}
