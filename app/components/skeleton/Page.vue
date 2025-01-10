<template>
  <div class="card w-full">
    <div class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
      <div class="flex flex-col">
        <Skeleton width="100%" height="3rem" class="mb-2"></Skeleton>
        <Skeleton width="100%" height="1.5rem" class="mb-2"></Skeleton>
        <div class="flex gap-2">
          <Skeleton width="4rem" height="1rem" class="mb-2"></Skeleton>
          <Skeleton width="4rem" height="1rem" class="mb-2"></Skeleton>
        </div>
        <div class="flex gap-2">
          <Skeleton width="2rem" height="1rem" class="mb-2"></Skeleton>
          <Skeleton width="2rem" height="1rem" class="mb-2"></Skeleton>
        </div>
      </div>
    </div>
  </div>
</template>