<template>
  <Drawer v-model:visible="settingVisible" header="个人中心" position="right" style="width: 200px; height: 100%"
    class="!w-full md:!w-1/2 lg:!w-1/3">
    <span class="text-surface-500 dark:text-surface-400 block mb-8"></span>
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">用户名</label>
      <InputText id="username" :value="user?.username" disabled />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="password" class="font-semibold w-24">密码</label>
      <InputText id="password" autocomplete="off" type="password" :value="user?.password" toggleMask disabled />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="退出登录" @click="logOut"></Button>
    </div>
  </Drawer>
</template>
<script lang="ts" setup>
import md5 from 'md5'
const emit = defineEmits(['showRegisterDialog'])
const { user, clearUser } = useUser();
// const props = defineProps<{ login: (form: { username: string, password: string }) => {} }>()
const username = ref('')
const password = ref('')
const settingVisible = ref(false)

// const submit = () => {
//   if (!username.value || !password.value) return
//   props.login({
//     username: username.value,
//     password: md5(password.value)
//   });
//   settingVisible.value = false
// }
const show = () => {
  settingVisible.value = true
}

// const showRegisterDialog = () => {
//   settingVisible.value = false
//   emit('showRegisterDialog')
// }

const logOut = async () => {
  clearUser()
  settingVisible.value = false
  await $http.post('/api/v1/user/logout')
  await navigateTo('/')
}

defineExpose({ show })
</script>
<style lang="less" scoped></style>