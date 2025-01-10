<template>
  <NuxtLoadingIndicator color="black" />
  <NuxtLayout class="bg-grid-dashed">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// useHead({
//   script: [
//     {
//       src: 'https://www.googletagmanager.com/gtag/js?id=G-6WVZHT91DH',
//       async: true,
//     },
//     {
//       innerHTML: `
//         window.dataLayer = window.dataLayer || [];
//         function gtag(){dataLayer.push(arguments);}
//         gtag('js', new Date());
//         gtag('config', 'G-6WVZHT91DH');
//       `,
//       type: 'text/javascript'
//     }
//   ],

// });

const { setUser } = useUser();

onErrorCaptured( (err) => {
  console.error('Error captured:', err)
  return false // 阻止错误继续传播
})

onMounted(() => {
  const userData = localStorage.getItem('blog_user')
  if (userData) setUser(JSON.parse(userData));
})
</script>
