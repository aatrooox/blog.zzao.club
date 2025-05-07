<template>
  <Drawer>
    <DrawerTrigger>登录</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>登录</DrawerTitle>
        <DrawerDescription>登录后可以参与更多互动</DrawerDescription>
      </DrawerHeader>
      <div class="form flex flex-col gap-4 px-4">
        <div class="flex items-center gap-2"><span class="inline-block w-20 text-right"> 用户名</span><Input
            v-model="username"></Input>
        </div>
        <div class="flex items-center gap-2"><span class="inline-block w-20 text-right"> 密码</span><Input
            v-model="password" type="password"></Input>
        </div>
      </div>
      <DrawerFooter class="flex flex-row justify-end">
        <DrawerClose>
          <Button @click="submit">登录</Button>
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
<script lang="ts" setup>
import md5 from 'md5'
const emit = defineEmits(['showRegisterDialog'])
const props = defineProps<{ login: (form: { username: string, password: string }) => {} }>()
const username = ref('')
const password = ref('')

const submit = () => {
  if (!username.value || !password.value) return
  props.login({
    username: username.value,
    password: md5(password.value)
  });
}

</script>
<style lang="less" scoped></style>