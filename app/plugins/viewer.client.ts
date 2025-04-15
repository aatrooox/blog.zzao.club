import VueViewer from 'v-viewer'

export default defineNuxtPlugin({
  name: 'v-viewer',
  async setup(nuxtApp) {
    console.log(`加载 v-viewer 插件`, )
    nuxtApp.vueApp.use(VueViewer)
  }
})