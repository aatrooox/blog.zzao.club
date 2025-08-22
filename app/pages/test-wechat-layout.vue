<script setup lang="ts">
import type { BlogMemoWithUser } from '~~/types/memo.d'

// 模拟用户数据
const mockUserInfo = {
  username: 'testuser',
  nickname: '测试用户',
  avatarUrl: 'https://via.placeholder.com/64',
}

// 单张图片的 memo
const singlePhotoMemo: BlogMemoWithUser = {
  id: '1',
  content: '这是一个微信布局的测试，包含一张图片。内容相对较短，类似朋友圈的风格。',
  photos: ['https://picsum.photos/400/600'],
  user_info: mockUserInfo,
  tags: [],
  likes: [],
  _count: { comments: 0, likes: 0 },
  createTs: new Date(),
  updatedTs: new Date(),
  userId: '1',
  visible: 'public',
  defaltFloded: false,
  flodTip: null,
  from: null,
  courier: null,
}

// 四张图片的 memo
const fourPhotoMemo: BlogMemoWithUser = {
  id: '2',
  content: '分享四张美图，展示微信九宫格布局的效果。这种布局特别适合展示多张相关的图片。',
  photos: [
    'https://picsum.photos/400/400',
    'https://picsum.photos/401/401',
    'https://picsum.photos/402/402',
    'https://picsum.photos/403/403',
  ],
  user_info: mockUserInfo,
  tags: [],
  likes: [],
  _count: { comments: 0, likes: 0 },
  createTs: new Date(),
  updatedTs: new Date(),
  userId: '1',
  visible: 'public',
  defaltFloded: false,
  flodTip: null,
  from: null,
  courier: null,
}

// 三张图片的 memo
const threePhotoMemo: BlogMemoWithUser = {
  id: '3',
  content: '三张图片的横向排列测试，每个图片应该是正方形，整体宽度平分。',
  photos: [
    'https://picsum.photos/350/350',
    'https://picsum.photos/351/351',
    'https://picsum.photos/352/352',
  ],
  user_info: mockUserInfo,
  tags: [],
  likes: [],
  _count: { comments: 0, likes: 0 },
  createTs: new Date(),
  updatedTs: new Date(),
  userId: '1',
  visible: 'public',
  defaltFloded: false,
  flodTip: null,
  from: null,
  courier: null,
}

// 两张图片的 memo
const twoPhotoMemo: BlogMemoWithUser = {
  id: '2.5',
  content: '两张图片的横向排列测试。',
  photos: [
    'https://picsum.photos/380/380',
    'https://picsum.photos/381/381',
  ],
  user_info: mockUserInfo,
  tags: [],
  likes: [],
  _count: { comments: 0, likes: 0 },
  createTs: new Date(),
  updatedTs: new Date(),
  userId: '1',
  visible: 'public',
  defaltFloded: false,
  flodTip: null,
  from: null,
  courier: null,
}

// 九张图片的 memo
const ninePhotoMemo: BlogMemoWithUser = {
  id: '4',
  content: '完整的九宫格展示！这是微信朋友圈最经典的布局方式，九张图片整齐排列，视觉效果非常棒。',
  photos: [
    'https://picsum.photos/300/300',
    'https://picsum.photos/301/301',
    'https://picsum.photos/302/302',
    'https://picsum.photos/303/303',
    'https://picsum.photos/304/304',
    'https://picsum.photos/305/305',
    'https://picsum.photos/306/306',
    'https://picsum.photos/307/307',
    'https://picsum.photos/308/308',
  ],
  user_info: mockUserInfo,
  tags: [],
  likes: [],
  _count: { comments: 0, likes: 0 },
  createTs: new Date(),
  updatedTs: new Date(),
  userId: '1',
  visible: 'public',
  defaltFloded: false,
  flodTip: null,
  from: null,
  courier: null,
}

// 仅文字的 memo
const textOnlyMemo: BlogMemoWithUser = {
  id: '5',
  content: '这是一条纯文字的动态，没有图片。微信布局在这种情况下只显示文字内容，保持简洁的视觉效果。',
  photos: [],
  user_info: mockUserInfo,
  tags: [],
  likes: [],
  _count: { comments: 0, likes: 0 },
  createTs: new Date(),
  updatedTs: new Date(),
  userId: '1',
  visible: 'public',
  defaltFloded: false,
  flodTip: null,
  from: null,
  courier: null,
}
</script>

<template>
  <div class="container mx-auto p-6 space-y-8">
    <h1 class="text-2xl font-bold mb-6">
      MemoPanel 微信布局测试
    </h1>

    <!-- 测试单张图片 -->
    <div class="border p-4 rounded-lg">
      <h2 class="text-lg font-semibold mb-4">
        单张图片 + 内容
      </h2>
      <MemoPanel
        :memo="singlePhotoMemo"
        layout="wechat"
        :photo-width="400"
      />
    </div>

    <!-- 测试两张图片 -->
    <div class="border p-4 rounded-lg">
      <h2 class="text-lg font-semibold mb-4">
        两张图片 + 内容（横向排列）
      </h2>
      <MemoPanel
        :memo="twoPhotoMemo"
        layout="wechat"
        :photo-width="400"
      />
    </div>

    <!-- 测试多张图片 -->
    <div class="border p-4 rounded-lg">
      <h2 class="text-lg font-semibold mb-4">
        三张图片 + 内容（横向排列）
      </h2>
      <MemoPanel
        :memo="threePhotoMemo"
        layout="wechat"
        :photo-width="400"
      />
    </div>

    <!-- 测试四张图片 -->
    <div class="border p-4 rounded-lg">
      <h2 class="text-lg font-semibold mb-4">
        四张图片 + 内容
      </h2>
      <MemoPanel
        :memo="fourPhotoMemo"
        layout="wechat"
        :photo-width="400"
      />
    </div>

    <!-- 测试九张图片 -->
    <div class="border p-4 rounded-lg">
      <h2 class="text-lg font-semibold mb-4">
        九张图片 + 内容
      </h2>
      <MemoPanel
        :memo="ninePhotoMemo"
        layout="wechat"
        :photo-width="400"
      />
    </div>

    <!-- 测试仅内容 -->
    <div class="border p-4 rounded-lg">
      <h2 class="text-lg font-semibold mb-4">
        仅内容（无图片）
      </h2>
      <MemoPanel
        :memo="textOnlyMemo"
        layout="wechat"
      />
    </div>

    <!-- 对比：小红书布局 -->
    <div class="border p-4 rounded-lg">
      <h2 class="text-lg font-semibold mb-4">
        对比：小红书布局
      </h2>
      <MemoPanel
        :memo="fourPhotoMemo"
        layout="xiaohongshu"
        :photo-width="300"
      />
    </div>
  </div>
</template>
