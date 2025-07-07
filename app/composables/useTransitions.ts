export function useStaggeredListTransition(className: string) {
  function onEnter(el: Element, done?: () => void) {
    animate(el, {
      duration: 100,
      ease: 'inOut',
      onComplete: () => {
        animate(className, {
          x: [
            { to: '30px', ease: 'outExpo', duration: 200 },
            { to: 0, ease: 'outBounce', duration: 200, delay: 150 },
          ],
          opacity: '1',
          duration: 300,
          delay: (_, i) => i * 50,
          ease: 'inOutCirc',
          onComplete: () => {
            done && done()
          },
        })
      },
    })
  }
  function onBeforeEnter(el: Element) {
    (el as HTMLElement).style.opacity = '0'
  }
  function onLeave(el: Element, done: () => void) {
    animate(el, {
      opacity: '0',
      duration: 200,
      delay: 300,
      ease: 'inOut',
      onComplete: () => {
        done()
      },
    })
  }
  function beforeLeave(el: Element) {
    const htmlEl = el as HTMLElement
    const { top, left, width, height } = htmlEl.getBoundingClientRect()
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    htmlEl.style.position = 'absolute'
    htmlEl.style.top = `${top + scrollTop}px`
    htmlEl.style.left = `${left}px`
    htmlEl.style.width = `${width}px`
    htmlEl.style.height = `${height}px`
    htmlEl.style.zIndex = '10'
  }
  function leave(el: Element, done: () => void) {
    const htmlEl = el as HTMLElement
    htmlEl.style.transition = 'all 0.35s cubic-bezier(0.4,0,0.2,1)'
    htmlEl.style.opacity = '0'
    htmlEl.style.transform = 'translateY(-24px) scale(0.98)'
    setTimeout(done, 350)
  }
  function afterLeave(el: Element) {
    const htmlEl = el as HTMLElement
    htmlEl.style.position = ''
    htmlEl.style.top = ''
    htmlEl.style.left = ''
    htmlEl.style.width = ''
    htmlEl.style.height = ''
    htmlEl.style.zIndex = ''
    htmlEl.style.transition = ''
    htmlEl.style.opacity = ''
    htmlEl.style.transform = ''
  }
  return { onEnter, onBeforeEnter, onLeave, beforeLeave, leave, afterLeave }
}
