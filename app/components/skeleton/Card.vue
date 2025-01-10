<template>
  <div class="card">
    <div class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
      <div class="flex mb-4">
        <Skeleton shape="circle" size="3rem" class="mr-2"></Skeleton>
        <div class="flex items-center">
          <Skeleton width="10rem" class="mb-2"></Skeleton>
        </div>
      </div>
      <Skeleton width="100%" height="60px"></Skeleton>
      <div class="flex justify-between mt-4">
        <Skeleton width="4rem" height="2rem"></Skeleton>
        <Skeleton width="4rem" height="2rem"></Skeleton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

</script>
<style lang="less" scoped></style>