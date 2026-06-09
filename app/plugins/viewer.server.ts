export default defineNuxtPlugin({
  name: 'v-viewer-server-stub',
  setup(nuxtApp) {
    nuxtApp.vueApp.directive('viewer', {
      getSSRProps() {
        return {}
      },
    })
  },
})
