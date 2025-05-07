<template>
  <div class="content-wrapper transition-all duration-1000">
    <!-- 内容区域 -->
    <div ref="contentRef" :style="contentStyle" class="content transition-all duration-1000">
      <slot />
    </div>

    <!-- 展开/收起按钮 -->
    <Button v-if="isOverflowed" class="toggle-button" size="sm" rounded @click="toggleExpanded">
      <Icon :name="`${expanded ? 'icon-park-outline:double-up' : 'icon-park-outline:double-down'}`"></Icon>
    </Button>
  </div>
</template>
<script lang="ts" setup>
const { maxHeight = 200, showAll = false } = defineProps<{ maxHeight?: number, showAll?: boolean }>()
const contentRef = ref(null); // 内容区域的引用
const expanded = ref(false); // 是否展开
const isOverflowed = ref(false); // 内容是否溢出

const contentStyle = computed(() => ({
  maxHeight: showAll ? 'auto' : expanded.value ? 'none' : `${maxHeight}px`,
  overflow: (expanded.value || showAll) ? 'visible' : 'hidden',
}));

const toggleExpanded = () => {
  // 不再展开，直接进入详情页
  // expanded.value = !expanded.value;
};

const checkOverflow = () => {
  if (showAll) { isOverflowed.value = false; return }
  if (contentRef.value) {
    isOverflowed.value = (contentRef.value as any).scrollHeight > (maxHeight + 10);
  }
};

onMounted(() => {
  setTimeout(() => {
    nextTick(checkOverflow)
  }, 100);
});
// onUpdated(() => nextTick(checkOverflow));
// onActivated(() => nextTick(checkOverflow));
</script>
<style lang="less" scoped></style>