<script lang="ts" setup>

</script>

<template>
  <div class="btn-svg-wrap">
    <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
      <rect class="outline" height="100%" width="100%" />
      <slot />
    </svg>
  </div>
</template>

<style>
.btn-svg-wrap .outline {
  stroke-dasharray: 100 500;
  stroke-dashoffset: 225;
  transition: all 0.5s ease-in-out;
}

.btn-svg-wrap:hover .outline {
  stroke-dasharray: 600 0;
  stroke-dashoffset: 475;
}
</style>
