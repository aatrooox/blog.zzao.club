import VueViewer from 'v-viewer'
import VueMasonry from 'vue-masonry-css'

export default defineNuxtPlugin({
  name: 'v-viewer',
  async setup(nuxtApp) {
    console.log(`加载 v-viewer 插件 ...`, )
    nuxtApp.vueApp.use(VueViewer)
    nuxtApp.vueApp.use(VueMasonry)
  }
})