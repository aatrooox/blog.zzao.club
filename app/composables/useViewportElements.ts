import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'

export interface UseViewportElementsOptions {
  /** 根偏移量，正数表示提前触发，负数表示延迟触发 */
  rootMargin?: string
  /** 元素可见性阈值，0-1之间 */
  threshold?: number | number[]
  /** 是否启用调试日志 */
  debug?: boolean
  /** 容器元素，默认为视口 */
  root?: Element | null
}

export interface ViewportElement {
  /** 元素的 ID */
  id: string
  /** 元素本身 */
  element: Element
  /** 元素是否在视口中 */
  isVisible: boolean
  /** 元素在视口中的比例 */
  intersectionRatio: number
}

export interface UseViewportElementsReturn {
  /** 当前在视口中的所有元素 */
  visibleElements: Ref<ViewportElement[]>
  /** 第一个在视口中的元素 */
  firstVisibleElement: Ref<ViewportElement | null>
  /** 第一个在视口中的元素的 ID */
  firstVisibleId: Ref<string | null>
  /** 所有在视口中的元素的 ID 列表 */
  visibleIds: Ref<string[]>
  /** 手动刷新检测 */
  refresh: () => void
  /** 手动销毁观察器 */
  destroy: () => void
}

/**
 * 检测视口中指定选择器的元素
 * @param selector CSS 选择器，如 '.heading', 'h2, h3', '[data-heading]'
 * @param options 配置选项
 * @returns 视口中的元素信息
 */
export function useViewportElements(
  selector: string,
  options: UseViewportElementsOptions = {},
): UseViewportElementsReturn {
  const {
    rootMargin = '0px 0px -80% 0px', // 当元素进入视口前20%时触发
    threshold = [0, 0.1, 0.25, 0.5, 0.75, 1], // 多个阈值，更精确的检测
    debug = false,
    root = null,
  } = options

  const visibleElements = ref<ViewportElement[]>([])
  const firstVisibleElement = ref<ViewportElement | null>(null)
  const firstVisibleId = ref<string | null>(null)
  const visibleIds = ref<string[]>([])

  let observer: IntersectionObserver | null = null
  let elements: Element[] = []

  const log = (...args: any[]) => {
    if (debug) {
      console.log('[useViewportElements]', ...args)
    }
  }

  const updateVisibleElements = () => {
    // 根据元素在页面中的位置排序
    const sortedVisible = visibleElements.value.sort((a, b) => {
      const rectA = a.element.getBoundingClientRect()
      const rectB = b.element.getBoundingClientRect()
      return rectA.top - rectB.top
    })

    visibleElements.value = sortedVisible
    firstVisibleElement.value = sortedVisible[0] || null
    firstVisibleId.value = sortedVisible[0]?.id || null
    visibleIds.value = sortedVisible.map(item => item.id)

    log('更新可见元素:', {
      visible: visibleIds.value,
      first: firstVisibleId.value,
    })
  }

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const element = entry.target
      const id = element.id || element.getAttribute('data-id') || ''

      if (!id) {
        log('警告: 元素没有 ID 属性', element)
        return
      }

      const existingIndex = visibleElements.value.findIndex(item => item.id === id)

      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        // 元素进入视口
        const viewportElement: ViewportElement = {
          id,
          element,
          isVisible: true,
          intersectionRatio: entry.intersectionRatio,
        }

        if (existingIndex >= 0) {
          // 更新现有元素
          visibleElements.value[existingIndex] = viewportElement
        }
        else {
          // 添加新元素
          visibleElements.value.push(viewportElement)
        }

        log('元素进入视口:', id, `比例: ${entry.intersectionRatio.toFixed(2)}`)
      }
      else {
        // 元素离开视口
        if (existingIndex >= 0) {
          visibleElements.value.splice(existingIndex, 1)
          log('元素离开视口:', id)
        }
      }
    })

    updateVisibleElements()
  }

  const findElements = () => {
    const foundElements = Array.from(document.querySelectorAll(selector))
    log('找到元素:', foundElements.length, '个')

    // 过滤掉没有 ID 的元素
    elements = foundElements.filter((element) => {
      const hasId = element.id || element.getAttribute('data-id')
      if (!hasId) {
        log('警告: 跳过没有 ID 的元素', element)
      }
      return hasId
    })

    log('有效元素:', elements.length, '个')
    return elements
  }

  const createObserver = () => {
    if (observer) {
      observer.disconnect()
    }

    observer = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin,
      threshold,
    })

    const elementsToObserve = findElements()
    elementsToObserve.forEach((element) => {
      observer!.observe(element)
    })

    log('开始观察元素:', elementsToObserve.length, '个')
  }

  const refresh = () => {
    log('手动刷新检测')
    createObserver()
  }

  const destroy = () => {
    if (observer) {
      observer.disconnect()
      observer = null
      log('销毁观察器')
    }
    visibleElements.value = []
    firstVisibleElement.value = null
    firstVisibleId.value = null
    visibleIds.value = []
  }

  onMounted(() => {
    // 延迟创建观察器，确保 DOM 已渲染
    setTimeout(() => {
      createObserver()
    }, 100)
  })

  onUnmounted(() => {
    destroy()
  })

  return {
    visibleElements,
    firstVisibleElement,
    firstVisibleId,
    visibleIds,
    refresh,
    destroy,
  }
}

/**
 * 专门用于标题元素的组合式函数
 * @param options 配置选项
 * @returns 视口中的标题信息
 */
export function useViewportHeadings(options: UseViewportElementsOptions = {}) {
  return useViewportElements('.heading', {
    rootMargin: '0px 0px -70% 0px', // 标题进入视口前30%时触发
    ...options,
  })
}

/**
 * 专门用于指定类名元素的组合式函数
 * @param className 类名
 * @param options 配置选项
 * @returns 视口中的元素信息
 */
export function useViewportElementsByClass(
  className: string,
  options: UseViewportElementsOptions = {},
) {
  return useViewportElements(`.${className}`, options)
}
