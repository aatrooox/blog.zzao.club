<script lang="ts" setup>
import { gsap } from 'gsap'

definePageMeta({
  layout: 'clean',
})

const appConfig = useAppConfig()
const products = appConfig.products

const containerRef = ref(null)

onMounted(() => {
  const ctx = gsap.context(() => {
    gsap.from('.product-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
    })

    gsap.from('.page-title', {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
  }, containerRef.value)

  return () => ctx.revert()
})
</script>

<template>
  <div ref="containerRef" class="min-h-screen bg-background relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
    <!-- 背景装饰 -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
    <div class="absolute bottom-0 right-0 w-[800px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="text-center mb-20 page-title">
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          早早集市2元超市
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          探索我随手打造的工具与应用，但愿能提升您的效率与体验。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink
          v-for="product in products"
          :key="product.slug"
          :to="product.link"
          class="product-card group"
        >
          <Card class="h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-border/40 bg-card/30 backdrop-blur-md hover:bg-card/50 hover:border-primary/20">
            <CardHeader>
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-white/5">
                <Icon :name="product.icon" class="w-7 h-7 text-primary/80 group-hover:text-primary transition-colors" />
              </div>
              <CardTitle class="text-2xl font-bold tracking-tight">
                {{ product.name }}
              </CardTitle>
              <CardDescription class="text-base mt-3 line-clamp-2 leading-relaxed">
                {{ product.description }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex flex-wrap gap-2">
                <Badge v-for="feature in product.features" :key="feature" variant="secondary" class="bg-secondary/30 hover:bg-secondary/50 transition-colors border-transparent">
                  {{ feature }}
                </Badge>
              </div>
            </CardContent>
            <CardFooter class="text-primary font-medium flex items-center gap-2 group-hover:translate-x-1 transition-transform mt-auto pt-6">
              了解更多 <Icon name="lucide:arrow-right" class="w-4 h-4" />
            </CardFooter>
          </Card>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
