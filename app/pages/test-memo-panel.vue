<script setup lang="ts">
import type { BlogMemoWithUser } from '~~/types/memo.d'

definePageMeta({
  layout: 'default',
})

// 测试数据
const testMemoWithPhotos: BlogMemoWithUser = {
  id: '1',
  content: '这是一个测试的小红书风格布局，展示图片轮播和内容的左右布局效果。内容可以包含 **Markdown** 格式的文本。\n\n## 标题示例\n\n- 列表项 1\n- 列表项 2\n- 列表项 3\n\n这里有一段较长的文本来测试右侧内容区域的显示效果。文本会自动换行，保持良好的阅读体验。',
  photos: [
    'https://picsum.photos/300/400?random=1',
    'https://picsum.photos/300/400?random=2',
    'https://picsum.photos/300/400?random=3',
  ],
  createTs: new Date(),
  updatedTs: new Date(),
  visible: 'public',
  defaltFloded: false,
  flodTip: null,
  userId: 'user-1',
  from: null,
  courier: null,
  user_info: {
    username: 'testuser',
    nickname: '测试用户',
    avatarUrl: 'https://picsum.photos/40/40?random=99',
  },
  tags: [
    { id: '1', tagName: '测试' },
    { id: '2', tagName: '小红书' },
    { id: '3', tagName: '布局' },
  ],
  likes: [],
  _count: {
    comments: 5,
    likes: 12,
  },
}

const testMemoPhotosOnly: BlogMemoWithUser = {
  id: '2',
  content: '',
  photos: [
    'https://picsum.photos/400/500?random=4',
    'https://picsum.photos/400/500?random=5',
  ],
  createTs: new Date(),
  updatedTs: new Date(),
  visible: 'public',
  defaltFloded: false,
  flodTip: null,
  userId: 'user-2',
  from: null,
  courier: null,
  user_info: {
    username: 'photouser',
    nickname: '图片用户',
    avatarUrl: 'https://picsum.photos/40/40?random=88',
  },
  tags: [],
  likes: [],
  _count: {
    comments: 2,
    likes: 8,
  },
}

const testMemoTextOnly: BlogMemoWithUser = {
  id: '3',
  content: '这是一个纯文本的 memo，没有图片。\n\n## 纯文本展示\n\n这种情况下会使用默认的布局模式，专注于文本内容的展示。\n\n```javascript\nconst example = "代码示例";\nconsole.log(example);\n```\n\n> 这是一个引用块\n\n文本内容可以很丰富，包含各种 Markdown 元素。',
  photos: [],
  createTs: new Date(),
  updatedTs: new Date(),
  visible: 'public',
  defaltFloded: false,
  flodTip: null,
  userId: 'user-3',
  from: null,
  courier: null,
  user_info: {
    username: 'textuser',
    nickname: '文字用户',
    avatarUrl: 'https://picsum.photos/40/40?random=77',
  },
  tags: [
    { id: '4', tagName: '文字' },
    { id: '5', tagName: 'Markdown' },
  ],
  likes: [],
  _count: {
    comments: 1,
    likes: 3,
  },
}

const emptyMemo: BlogMemoWithUser = {
  id: '4',
  content: '',
  photos: [],
  createTs: new Date(),
  updatedTs: new Date(),
  visible: 'public',
  defaltFloded: false,
  flodTip: null,
  userId: 'user-4',
  from: null,
  courier: null,
  user_info: {
    username: 'emptyuser',
    nickname: '空用户',
    avatarUrl: 'https://picsum.photos/40/40?random=66',
  },
  tags: [],
  likes: [],
  _count: {
    comments: 0,
    likes: 0,
  },
}

// 设置SEO
useSeoMeta({
  title: 'MemoPanel 测试页面｜早早集市',
  description: '测试 MemoPanel 组件的不同布局模式',
})
</script>

<template>
  <div class="pixel-layout min-h-screen font-mono">
    <div class="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <!-- 页面标题 -->
      <div class="pixel-card p-6 mb-8">
        <h1 class="pixel-title text-3xl font-mono font-bold mb-4">
          MemoPanel 测试页面
        </h1>
        <p class="text-[var(--pixel-text-secondary)] font-mono">
          测试不同的 MemoPanel 布局模式和功能
        </p>
      </div>

      <!-- 测试用例 1: 小红书布局 - 图文混合 -->
      <div class="space-y-8">
        <div class="pixel-card p-6">
          <h2 class="pixel-title text-xl font-mono font-bold mb-4 text-[var(--pixel-highlight-teal-text)]">
            1. 小红书布局 - 图文混合（左图右文，默认尺寸）
          </h2>
          <MemoPanel :memo="testMemoWithPhotos" layout="xiaohongshu" :show-all="true" />
        </div>

        <!-- 测试用例 1.2: 小红书布局 - 小尺寸 -->
        <div class="pixel-card p-6">
          <h2 class="pixel-title text-xl font-mono font-bold mb-4 text-[var(--pixel-highlight-teal-text)]">
            1.2. 小红书布局 - 小尺寸（图片宽度240px，整体最大800px）
          </h2>
          <MemoPanel :memo="testMemoWithPhotos" layout="xiaohongshu" :photo-width="240" :max-width="800" :show-all="true" />
        </div>

        <!-- 测试用例 1.3: 小红书布局 - 大尺寸 -->
        <div class="pixel-card p-6">
          <h2 class="pixel-title text-xl font-mono font-bold mb-4 text-[var(--pixel-highlight-teal-text)]">
            1.3. 小红书布局 - 大尺寸（图片宽度400px，整体最大1400px）
          </h2>
          <MemoPanel :memo="testMemoWithPhotos" layout="xiaohongshu" :photo-width="400" :max-width="1400" :show-all="true" />
        </div>

        <!-- 测试用例 2: 显示模式测试 -->
        <div class="pixel-card p-6">
          <h2 class="pixel-title text-xl font-mono font-bold mb-4 text-[var(--pixel-highlight-teal-text)]">
            2. 显示模式测试
          </h2>

          <div class="space-y-6">
            <!-- 自动模式 -->
            <div>
              <h3 class="text-md font-semibold mb-2 text-[var(--pixel-highlight-green-text)]">
                2.1. 自动模式（default）
              </h3>
              <MemoPanel
                :memo="testMemoWithPhotos"
                display-mode="all"
                :max-width="600"
                :photo-width="300"
              />
            </div>

            <!-- 只显示图片 -->
            <div>
              <h3 class="text-md font-semibold mb-2 text-[var(--pixel-highlight-green-text)]">
                2.2. 只显示图片
              </h3>
              <MemoPanel
                :memo="testMemoWithPhotos"
                display-mode="photos-only"
                :max-width="400"
                :photo-width="300"
              />
            </div>

            <!-- 只显示内容 -->
            <div>
              <h3 class="text-md font-semibold mb-2 text-[var(--pixel-highlight-green-text)]">
                2.3. 只显示内容
              </h3>
              <MemoPanel
                :memo="testMemoWithPhotos"
                display-mode="content-only"
                :max-width="600"
              />
            </div>

            <!-- 空状态 -->
            <div>
              <h3 class="text-md font-semibold mb-2 text-[var(--pixel-highlight-green-text)]">
                2.4. 空状态
              </h3>
              <MemoPanel
                :memo="emptyMemo"
                display-mode="all"
                :max-width="400"
              />
            </div>
          </div>
        </div>

        <!-- 测试用例 3: 仅图片模式 -->
        <div class="pixel-card p-6">
          <h2 class="pixel-title text-xl font-mono font-bold mb-4 text-[var(--pixel-highlight-teal-text)]">
            3. 仅图片模式（图片轮播，默认尺寸）
          </h2>
          <MemoPanel :memo="testMemoPhotosOnly" :show-all="true" />
        </div>

        <!-- 测试用例 3.2: 仅图片模式 - 小尺寸 -->
        <div class="pixel-card p-6">
          <h2 class="pixel-title text-xl font-mono font-bold mb-4 text-[var(--pixel-highlight-teal-text)]">
            3.2. 仅图片模式 - 小尺寸（最大宽度300px）
          </h2>
          <MemoPanel :memo="testMemoPhotosOnly" :photo-width="300" :show-all="true" />
        </div>

        <!-- 测试用例 4: 纯文本模式 -->
        <div class="pixel-card p-6">
          <h2 class="pixel-title text-xl font-mono font-bold mb-4 text-[var(--pixel-highlight-teal-text)]">
            4. 纯文本模式（默认布局）
          </h2>
          <MemoPanel :memo="testMemoTextOnly" :show-all="true" />
        </div>

        <!-- 测试用例 5: 小红书布局但只有图片 -->
        <div class="pixel-card p-6">
          <h2 class="pixel-title text-xl font-mono font-bold mb-4 text-[var(--pixel-highlight-teal-text)]">
            5. 小红书布局 - 仅图片（紧凑尺寸，图片宽度200px）
          </h2>
          <MemoPanel :memo="testMemoPhotosOnly" layout="xiaohongshu" :photo-width="200" :max-width="600" :show-all="true" />
        </div>

        <!-- 测试用例 6: 列表/卡片场景模拟 -->
        <div class="pixel-card p-6">
          <h2 class="pixel-title text-xl font-mono font-bold mb-4 text-[var(--pixel-highlight-teal-text)]">
            6. 列表/卡片场景 - 紧凑布局（适合在列表中使用）
          </h2>
          <div class="space-y-4">
            <div class="p-4 border-2 border-dashed border-[var(--pixel-border-primary)] rounded">
              <MemoPanel :memo="testMemoWithPhotos" layout="xiaohongshu" :photo-width="180" :max-width="600" :show-all="true" />
            </div>
            <div class="p-4 border-2 border-dashed border-[var(--pixel-border-primary)] rounded">
              <MemoPanel :memo="testMemoPhotosOnly" :photo-width="250" :show-all="true" />
            </div>
          </div>
        </div>
      </div>

      <!-- 返回链接 -->
      <div class="mt-12 text-center">
        <NuxtLink
          to="/memo"
          class="pixel-btn font-mono font-bold px-6 py-3 hover:scale-105 transition-all duration-200"
        >
          返回 Memo 列表
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pixel-layout {
  background: var(--pixel-bg-primary);
  color: var(--pixel-text-primary);
  min-height: 100vh;
}

.pixel-card {
  background: var(--pixel-bg-secondary);
  border: 2px solid var(--pixel-border-primary);
  border-radius: 8px;
  box-shadow: var(--pixel-shadow);
}

.pixel-title {
  color: var(--pixel-text-primary);
}

.pixel-btn {
  background: var(--pixel-bg-primary);
  border: 2px solid var(--pixel-border-primary);
  color: var(--pixel-text-primary);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.pixel-btn:hover {
  background: var(--pixel-highlight-teal);
  color: var(--pixel-bg-primary);
}
</style>
