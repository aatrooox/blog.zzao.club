<template>
  <div class="categary box-border flex flex-wrap gap-2">
    <div class="booklist flex flex-wrap gap-8">
      <Card v-for="book in bookList" class="w-full md:w-[33%] xs:w-[50%]">
        <template #header>
          <img alt="user header" :src="book.cover || 'https://img.zzao.club/article/202412301500611.png'" />
        </template>
        <template #title>
          <div class="flex justify-between">
            <NuxtLink :to="book.firstPath">{{ book.title }}</NuxtLink>
            <Tag :value="book.status"></Tag>
          </div>
        </template>
        <template #subtitle> 共{{ book.articleCount }}篇文章</template>
        <template #content>
          <p class="m-0">
            本小册吸纳世间珍宝之精华，汇聚各方大能之心得，定能祝你早日结丹。
          </p>
        </template>
        <template #footer>

        </template>
      </Card>
    </div>
    <!-- <MDC :value="content" class="mdc-memo-prose prose"></MDC> -->
    <!-- {{ bookList }} -->
  </div>
</template>
<script lang="ts" setup>
useHead({
  title: '小册｜早早集市',
  meta: [
    {
      name: 'description',
      content: '全栈开发工具集，独立开发指南，Nuxt问题合集',
    },
    {
      name: 'keywords',
      content: '早早集市,博客站,前端,前端工程化,前端架构,Node,Nuxt,Hono,副业',
    },
  ],
})
const { setBook } = useBook();
const appConfig = useAppConfig();
const { data: bookConfig } = await useAsyncData('bookConfig', () => {
  return queryCollection('bookConfig').all()
})
// const bookConfig = await queryCollection('bookConfig').all()
const getBooksWithArticleCount = (books: any[]) => {
  const bookList = books.map(book => {
    let articleCount = 0;
    let bookHeadPath = ''
    // 递归函数：统计文章数量
    function countArticles(children) {
      children.forEach(child => {
        if (child.page === false) {
          // 如果是章节，继续递归
          if (child.children) {
            countArticles(child.children);
          }
        } else if (child.id) {
          if (!bookHeadPath) bookHeadPath = child.path
          // 如果是文章，增加计数
          if (child.title !== 'index') articleCount++;
        }
      });
    }

    // 开始统计当前书籍的文章数量
    if (book.children) {
      countArticles(book.children);
    }

    return {
      title: book.title,
      path: book.path,
      firstPath: bookHeadPath + '?key=0-0',
      cover: bookConfig.value?.find(item => item.name === book.title)?.cover,
      status: bookConfig.value?.find(item => item.name === book.title)?.status,
      articleCount: articleCount
    };
  });
  return bookList;
}

// 根据目录结构获取到文章列表，排序按文件名进行排序
const { data: books } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('book', ['date', 'path', 'id'])
})


const bookList = computed(() => {
  console.log(`books.value`, books.value)
  const bookList = (books.value ?? [])[0].children || []
  const result = getBooksWithArticleCount(bookList)
  console.log(`result`, result)
  setBook(Array.from(result));
  return result
})

// console.log(`books`, books.value)
</script>
<style lang="less" scoped></style>