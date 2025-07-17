<script lang="ts" setup>
const items = ref([
  {
    label: '首页',
    icon: 'twemoji:wedding',
    route: '/',
  },
  {
    label: '文章',
    icon: 'twemoji:page-facing-up',
    route: '/article',
  },
  {
    label: 'Memoz',
    icon: 'twemoji:page-facing-up',
    route: '/memo',
  },
  {
    label: 'IMGX',
    icon: 'twemoji:framed-picture',
    route: '/imgx',
  },
  {
    label: '友链',
    icon: 'twemoji:clinking-beer-mugs',
    route: '/links',
  },
  {
    label: '关于',
    icon: 'icon-park-outline:setting-two',
    route: '/about',
    // children: [
    //   {
    //     label: '关于本站',
    //     route: '/about'
    //   }
    // ]
  },
])
</script>

<template>
  <Drawer direction="left" class="md:hidden">
    <DrawerTrigger>
      <Button variant="ghost">
        <Icon name="solar:menu-dots-circle-linear" size="1.5em" />
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <ul class="pt-4">
        <li v-for="item in items" :key="item.label">
          <DrawerClose>
            <NuxtLink :to="item.route">
              <Button variant="link">
                {{ item.label }}
              </Button>
            </NuxtLink>
          </DrawerClose>
        </li>
      </ul>
      <!-- <DrawerFooter class="flex flex-row justify-end">
        <Button href="/api/v1/auth/github" as="a">
          Github
        </Button>
        <DrawerClose>
          <Button @click="submit">
            登录
          </Button>
        </DrawerClose>
        <DrawerClose>
          <Button>
            取消
          </Button>
        </DrawerClose>
      </DrawerFooter> -->
    </DrawerContent>
  </Drawer>
</template>

<style lang="less" scoped></style>
