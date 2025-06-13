<script lang="ts" setup>
import md5 from 'md5'

const props = defineProps<{ login: (form: { username: string, password: string }) => object }>()
defineEmits(['showRegisterDialog'])
const username = ref('')
const password = ref('')

function submit() {
  if (!username.value || !password.value)
    return
  props.login({
    username: username.value,
    password: md5(password.value),
  })
}
</script>

<template>
  <Drawer>
    <DrawerTrigger>
      <Button variant="ghost">
        <Icon name="solar:user-cross-line-duotone" size="1.5em" />
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>登录</DrawerTitle>
        <DrawerDescription>登录后可以参与更多互动 (未注册的用户会注册后自动登录) </DrawerDescription>
      </DrawerHeader>
      <div class="form flex flex-col gap-4 px-4">
        <div class="flex items-center gap-2">
          <span class="inline-block w-20 text-right"> 用户名</span><Input
            v-model="username"
          />
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-block w-20 text-right"> 密码</span><Input
            v-model="password" type="password"
          />
        </div>
      </div>
      <DrawerFooter class="flex flex-row justify-end">
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
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

<style lang="less" scoped></style>
