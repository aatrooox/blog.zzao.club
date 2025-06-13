import { ClientJS } from 'clientjs'

export default defineNuxtPlugin({
  name: 'clientjs',
  async setup() {
    console.log(`加载 clientjs ...`)
    const clientjs = new ClientJS()

    return {
      provide: {
        clientjs,
      },
    }
  },
})
