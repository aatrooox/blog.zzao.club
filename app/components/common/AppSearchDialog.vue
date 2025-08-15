<script lang="ts" setup>
import Fuse from 'fuse.js'

const visible = ref(false)
const queryText = ref('')
const fuse = ref()
const result = ref<any[]>([])

async function initSections() {
  const { data } = await useAsyncData('search-full-text', () => queryCollectionSearchSections('content'), { lazy: true })
  console.log(`data`, data.value)
  fuse.value = new Fuse(data.value as any, {
    ignoreLocation: true,
    includeMatches: true,
    threshold: 0.3,
    minMatchCharLength: 1,
    keys: ['title', 'description'],
  })
}

watch(queryText, () => {
  result.value = fuse.value.search(toValue(queryText)).slice(0, 10)
  console.log(`search....`, result.value)
})
function show() {
  visible.value = true
  initSections()
}

function routeTo(item) {
  navigateTo(item.item.id)
  visible.value = false
}

onUnmounted(() => {
  fuse.value = null
})

defineExpose({
  show,
})
</script>

<template>
  <Dialog v-model:visible="visible" header="全文搜索" modal class="w-[90%] md:w-[70%]">
    <div class="content py-4 pixel-card">
      <FloatLabel variant="on" class="w-full">
        <Input id="on_label" v-model="queryText" autocomplete="off" class="w-full" />
        <label for="on_label">搜索（文章）标题和简介</label>
      </FloatLabel>
      <div class="search-result">
        <div v-for="item in result" :key="item.id" class="hover:text-white hover:bg-zinc-800 cursor-pointer py-1 flex items-center" @click="routeTo(item)">
          <!-- <Button as="a" variant="link" :href="item.item.id" target="_blank" link :label="item.item.id.split('/')[item.item.id.split('/').length - 1]"></Button> -->
          <!-- <Button as="a" variant="link" :href="item.item.id" target="_blank" link :label="item.item.title"></Button> -->
          <Button variant="secondary" rounded>
            <Icon name="icon-park-outline:read-book" />
          </Button>
          <span>{{ item.item.title }}</span>
        </div>
      </div>
    </div>
  </Dialog>
</template>
