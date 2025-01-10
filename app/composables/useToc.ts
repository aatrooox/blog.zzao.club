interface Toc {
  _path: string
  links: string[]
  [key: string]: any
}
export default function useToc() {
  const toc = useState('toc', () => ({}))

  const setToc = (toc: Toc) => {
    toc.value = toc
  }
  
  const clearToc = () => {
    toc.value = {}
  }
}