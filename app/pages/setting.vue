<template>
  <div class="setting-page">
    <div>个人设置</div>
    <UserAvatar :user-info="user" :preview-url="preview_src" size="xlarge" class="cursor-pointer"></UserAvatar>
    <!-- <FileUpload name="demo[]" customUpload auto accept="image/*" :maxFileSize="1000000" @select="onFileSelect">
      <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
        <UserAvatar :user-info="user" :preview-url="preview_src" @click="chooseCallback()" size="xlarge"
          class="cursor-pointer"></UserAvatar>
        <Button label="就是它了" @click="upload" size="small" severity="primary" />
      </template>
<template #empty>
      </template>
</FileUpload> -->
    <Button label="退出登录" @click="logOut"></Button>
  </div>
</template>
<script lang="ts" setup>
const preview_src = ref<string | null>(null);
const filename = ref('')
const toast = useToast()
const { disposeError } = useErrorDispose()
const { user, setUser, clearUser } = useUser();
const config = useRuntimeConfig()
let cur_file: File | null = null
function onFileSelect(event: any) {
  const file = event.files[0];
  filename.value = file.name;
  cur_file = file
  const reader = new FileReader();

  reader.onload = async (e) => {
    preview_src.value = e.target?.result as string;
  };

  reader.readAsDataURL(file);
}
// skip
const upload = async () => {
  const data: any = await useUpload(cur_file as File).catch(err => {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || '上传失败', life: 3000 });
  })
  console.log(`data`, data)
  const cos_url = data.Location;
  const public_url = config.public.imgHost + cos_url.split('.com')[1]
  console.log(`上传结果`, public_url)
  preview_src.value = public_url

  const { data: updateUser, error }: { data: any, error: any } = await $http.post('/api/v1/user/update', { id: user.value?.id, avatar_url: public_url })

  if (error?.value) {
    disposeError(error)
  } else {
    setUser(updateUser.value.data);
    toast.add({ severity: 'success', summary: 'Success', detail: '头像更新成功', life: 3000 });
  }
};

const onUpload = () => {
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

const logOut = async () => {
  clearUser()
  await $http.post('/api/v1/user/logout')
  await navigateTo('/')
}

useHead({
  title: '设置｜早早集市',
  meta: [
    {
      name: 'description',
      content: '早早集市｜博客站｜前端｜全栈｜前端架构｜Node｜Nuxt｜Hono｜Bun| 副业',
    },
    {
      name: 'keywords',
      content: '早早集市,博客站,前端,前端工程化,前端架构,Node,Nuxt,Hono,副业',
    },
  ],
})
</script>
<style lang="less" scoped></style>