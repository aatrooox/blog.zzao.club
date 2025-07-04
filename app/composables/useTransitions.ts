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
  return { onEnter, onBeforeEnter, onLeave }
}
