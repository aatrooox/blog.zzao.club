export default function useBook() {
  const book = useState<any[]>('book', () => [])

  /**
   * 获取小册目录导航
   * @param name 小册名字
   */
  const getOneBook = (name: string) => {
    return book.value.find( item => {
      item.name === name
    })
  }

  const setBook = (book: any) => {
    // console.log(`set book`, book)
    book.value = book;
  }
  

  return {
    getOneBook,
    setBook
  }
}