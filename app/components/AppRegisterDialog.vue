<template>
  <Drawer v-model:visible="registerVisible" header="注册博客" position="top" style="height: auto" class="!w-[90%] md:!w-1/2 lg:!w-1/3">
    <span class="text-surface-500 text-sm block mb-4">注册后会自动登录，<strong>第一个注册的用户为管理员</strong></span>
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">用户名</label>
      <InputText id="username" class="flex-auto" autocomplete="off" v-model="username" />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="password" class="font-semibold w-24">密码</label>
      <InputText id="password" class="flex-auto" autocomplete="off" type="password" v-model="password" toggleMask />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="password" class="font-semibold w-24">邮箱</label>
      <InputText id="password" class="flex-auto" autocomplete="off" v-model="email" placeholder="可选" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="取消" severity="secondary" @click="registerVisible = false"></Button>
      <Button type="button" label="确认" @click="submit"></Button>
    </div>
  </Drawer>
</template>
<script lang="ts" setup>
import { z } from 'zod'
import md5 from 'md5'

const emit = defineEmits(['registed'])
const toast = useToast()
const { validateEmail, validatePassword, validateUsername } = useRegisterValidator()
const props = defineProps({
  regist: {
    type: Function,
    required: true,
    default: () => { }
  }
})
const username = ref('')
const password = ref('')
const email = ref('')
const registerVisible = ref(false)

const submit = async () => {
  if (!username.value || !password.value) return

  if (email.value) {
    if (!validateEmail(email.value)) return toast.add({ severity: 'error', summary: '邮箱格式错误', detail: '请输入正确的邮箱格式', life: 3000 })
  }

  if (!validateUsername(username.value)) return toast.add({ severity: 'error', summary: '用户名格式错误(至少6位)', detail: '请输入正确的用户名格式', life: 3000 })

  if (!validatePassword(password.value)) return toast.add({ severity: 'error', summary: '密码格式错误(至少6位)', detail: '请输入正确的密码格式', life: 3000 })

  const data = {
    username: username.value,
    password: md5(password.value),
    email: email.value
  }
  await props.regist(data);
  emit('registed', data)
  registerVisible.value = false
}
const show = () => {
  registerVisible.value = true
}

defineExpose({ show })
</script>
<style lang="less" scoped></style>