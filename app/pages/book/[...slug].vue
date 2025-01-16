<template>
  <div class="book-page w-full flex flex-col box-border px-4">
    <BookMenuBar :name="bookName"></BookMenuBar>
    <div class="mobile-menu md:hidden">
      <Menubar :model="bookMenu">
        <template #item="{ item, props, hasSubmenu }">
          <a v-ripple v-if="item.isPage" v-bind="props.action" @click="onNodeSelect(item)">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
          <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
            <span v-if="item.children" class="pi pi-fw pi-angle-down" />
          </a>
        </template>
      </Menubar>
    </div>
    <div class="book-content flex w-full box-border">
      <div class="book-menu h-full sticky top-14 hidden md:block">
        <Tree v-model:selectionKeys="selectedKey" v-model:expandedKeys="expandedKeys" :value="bookMenu"
          selectionMode="single" @nodeSelect="onNodeSelect" @node-unselect="onNodeSelect"
          class="w-[100px] md:w-[250px] text-sm">
        </Tree>
      </div>
      <div class="page-content !w-full md:!w-[calc(100%-130px)] flex justify-center box-border">
        <article ref="curMdContentRef" v-if="page" class="mdc-prose prose !w-full !max-w-full">
          <div class="version-info" v-if="page?.versions">
            <Tag v-for="v of page?.versions" :key="v" :value="v" class="mr-2"></Tag>
          </div>
          <ContentRenderer :value="page?.body" class="!w-full md:!w-[calc(100%-130px)]"></ContentRenderer>
        </article>
        <!-- <ContentRenderer :value="page?.body"></ContentRenderer> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { hash } from 'ohash';
definePageMeta({
  layout: 'book'
})

const route = useRoute();
const toast = useToast();
// 0 表示书名
const slug = computed(() => route.params.slug || [])
const bookName = computed( () => {
  return (book.value ?? [])[0].children[0].title ?? '我的小册'
});
const content = ref('')
const selectedKey = ref();
const expandedKeys = ref({});
const { data: book } = await useAsyncData(hash(route.path + 'menu'), () => {
  console.log(`slug`, slug)
  return queryCollectionNavigation('book').where('path', 'LIKE', `%${slug.value[0]}%`)
})

const { data: page, error, refresh } = await useAsyncData(hash(route.path + 'page'), () => {
  // 删掉前缀
  return queryCollection('book').path(route.path).first()
}, { watch: [route.query]})

console.log('page', page.value, error.value)
console.log(`menu`, book.value)

const bookMenu = computed(() => {
  // 存在此小册
  if (book.value && book.value[0]) {
    if (book.value[0].children) {
      console.log(`bookMenu 00 0 00 0`, book.value[0].children[0])
      return transformTree(book.value[0].children[0].children)
    }
  }

  return []
})
interface TransformedNode {
  label: string;
  children?: any[];
  items?: any[];
  key: string;
  path: string;
  title: string;
  isPage: boolean;
}

function transformTree(nodes: any[], parentKey: string = ''): any[] {
  return nodes.map((node, index) => {
    const key = parentKey ? `${parentKey}-${index}` : `${index}`;
    const transformedNode: TransformedNode = {
      label: node.title,
      path: node.path,
      title: node.stem,
      key: key,
      isPage: node.page === undefined
    };

    if (node.children && node.children.length > 0) {
      transformedNode.children = transformTree(node.children, key);
      transformedNode.items = transformTree(node.children, key);
    }

    return transformedNode;
  });
}

const expandNode = (node) => {
  if (!!!expandedKeys.value[node.key]) {
    if (node.children && node.children.length) {
      expandedKeys.value[node.key] = true;

      for (let child of node.children) {
        expandNode(child);
      }
    }
  } else {
    closeNode(node)
  }
};

const expandAll = (nodes) => {
  console.log(`expand all`, )
    for (let node of nodes) {
        expandNode(node);
    }
    expandedKeys.value = { ...expandedKeys.value };
};

onMounted( () => {
  expandedKeys.value = {};
  expandAll(bookMenu.value);
  if (route.query.key) selectedKey.value = { [route.query.key as string]: true}
})

const closeNode = (node) => {
  expandedKeys.value[node.key] = false;
};

const onNodeSelect = (node) => {
  // toast.add({ severity: 'success', summary: `Node Selected：【${node.isPage}】`, detail: node.label, life: 3000 });
  if (node.isPage) {
    content.value = node.title;
    navigateTo(node.path + `?key=${node.key}`, { replace: true })
  } else {
    expandNode(node)
  }
};

</script>
<style lang="less" scoped></style>