<template>
  <Drawer v-model:visible="loginVisible" header="登录博客" position="top" style="height: auto"
    class="!w-full md:!w-1/2 lg:!w-1/3">
    <span class="text-surface-500 dark:text-surface-400 block mb-8"></span>
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">用户名</label>
      <Input id="username" v-model="username" />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="password" class="font-semibold w-24">密码</label>
      <Input id="password" autocomplete="off" type="password" v-model="password" toggleMask />

      <!-- <Password inputClass="!w-[300px]" inputId="password" v-model="password"> 
        <template #header>
          <div class="font-semibold text-xm mb-4">至少六位</div>
      </template>
</Password> -->
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="去注册" variant="secondary" @click="showRegisterDialog"></Button>
      <Button type="button" label="登录" @click="submit"></Button>
    </div>
  </Drawer>
</template>
<script lang="ts" setup>
import md5 from 'md5'
const emit = defineEmits(['showRegisterDialog'])
const props = defineProps<{ login: (form: { username: string, password: string }) => {} }>()
const username = ref('')
const password = ref('')
const loginVisible = ref(false)

const submit = () => {
  if (!username.value || !password.value) return
  props.login({
    username: username.value,
    password: md5(password.value)
  });
  loginVisible.value = false
}
const show = () => {
  loginVisible.value = true
}

const showRegisterDialog = () => {
  loginVisible.value = false
  emit('showRegisterDialog')
}

defineExpose({ show })
</script>
<style lang="less" scoped></style>