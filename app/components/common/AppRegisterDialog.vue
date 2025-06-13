<script lang="ts" setup>
import md5 from 'md5'

const props = defineProps({
  regist: {
    type: Function,
    required: false,
    default: () => { },
  },
})
const emit = defineEmits(['registed'])
const toast = useGlobalToast()
const { validateEmail, validatePassword, validateUsername } = useRegisterValidator()
const username = ref('')
const password = ref('')
const email = ref('')
const registerVisible = ref(false)

async function submit() {
  if (!username.value || !password.value)
    return

  if (email.value) {
    if (!validateEmail(email.value))
      return toast.add({ type: 'error', message: '邮箱格式错误' })
  }

  if (!validateUsername(username.value))
    return toast.add({ type: 'error', message: '用户名格式错误(至少6位)' })

  if (!validatePassword(password.value))
    return toast.add({ type: 'error', message: '密码格式错误(至少6位)' })

  const data = {
    username: username.value,
    password: md5(password.value),
    email: email.value,
  }
  await props.regist(data)
  emit('registed', data)
  registerVisible.value = false
}
function show() {
  registerVisible.value = true
}

defineExpose({ show })
</script>

<template>
  <Drawer
    v-model:visible="registerVisible" header="注册博客" position="top" style="height: auto"
    class="!w-[90%] md:!w-1/2 lg:!w-1/3"
  >
    <span class="text-surface-500 text-sm block mb-4">注册后会自动登录，<strong>第一个注册的用户为管理员</strong></span>
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">用户名</label>
      <Input id="username" v-model="username" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="password" class="font-semibold w-24">密码</label>
      <Input id="password" v-model="password" class="flex-auto" autocomplete="off" type="password" toggle-mask />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="password" class="font-semibold w-24">邮箱</label>
      <Input id="password" v-model="email" class="flex-auto" autocomplete="off" placeholder="可选" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="取消" variant="secondary" @click="registerVisible = false" />
      <Button type="button" label="确认" @click="submit" />
    </div>
  </Drawer>
</template>

<style lang="less" scoped></style>
