export function useTransition() {
  const animateEnter = (el: HTMLElement, completeCallback: Function) => {
    animate(el, {
      opacity: '1',
      duration: 100,
      delay: 200,
      ease: 'inOut',
      onComplete: () => {
        completeCallback && completeCallback()
      }
    })
  }
  const animateBeforeEnter = (el: HTMLElement) => {
    el.style.opacity = '0'
  }

  const animateLeave = (el: HTMLElement, done: any) => {
    animate(el, {
      scale: [1, 1.1, 1],
      opacity: '0',
      duration: 200,
      delay: 300,
      ease: 'inOut',
      onComplete: () => {
        done && done()
      }
    })
  }


  return {
    animateBeforeEnter,
    animateLeave,
    animateEnter
  }
}