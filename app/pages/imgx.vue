<script setup lang="ts">
// 使用 clean 布局，禁用 SSR
definePageMeta({
  layout: 'clean',
  ssr: false,
})

useHead({
  title: 'IMGX - 图片拼图编辑器',
})

// 图片适配模式
type ImageFitMode = 'cover' | 'contain' | 'fill'

// 网格单元格接口
interface GridCell {
  id: string
  image?: string
  title: string
  borderRadius: number
  width: number
  height: number
  x: number
  y: number
  imageFit: ImageFitMode
}

// 预设模板
interface GridTemplate {
  name: string
  description: string
  cells: Omit<GridCell, 'id' | 'image' | 'title'>[]
}

// 分割类型
type SplitType = 'horizontal' | 'vertical' | 'quad'

// 预设模板数据（基础布局，不包含间距）
const templates: GridTemplate[] = [
  {
    name: '单图',
    description: '单张图片展示',
    cells: [{ borderRadius: 8, width: 100, height: 100, x: 0, y: 0, imageFit: 'cover' }],
  },
  {
    name: '双图横排',
    description: '两张图片水平排列',
    cells: [
      { borderRadius: 8, width: 50, height: 100, x: 0, y: 0, imageFit: 'cover' },
      { borderRadius: 8, width: 50, height: 100, x: 50, y: 0, imageFit: 'cover' },
    ],
  },
  {
    name: '双图竖排',
    description: '两张图片垂直排列',
    cells: [
      { borderRadius: 8, width: 100, height: 50, x: 0, y: 0, imageFit: 'cover' },
      { borderRadius: 8, width: 100, height: 50, x: 0, y: 50, imageFit: 'cover' },
    ],
  },
  {
    name: '三图排列',
    description: '一大两小布局',
    cells: [
      { borderRadius: 8, width: 66, height: 100, x: 0, y: 0, imageFit: 'cover' },
      { borderRadius: 8, width: 34, height: 50, x: 66, y: 0, imageFit: 'cover' },
      { borderRadius: 8, width: 34, height: 50, x: 66, y: 50, imageFit: 'cover' },
    ],
  },
  {
    name: '四宫格',
    description: '四张图片网格排列',
    cells: [
      { borderRadius: 8, width: 50, height: 50, x: 0, y: 0, imageFit: 'cover' },
      { borderRadius: 8, width: 50, height: 50, x: 50, y: 0, imageFit: 'cover' },
      { borderRadius: 8, width: 50, height: 50, x: 0, y: 50, imageFit: 'cover' },
      { borderRadius: 8, width: 50, height: 50, x: 50, y: 50, imageFit: 'cover' },
    ],
  },
]

// 响应式数据
const cells = ref<GridCell[]>([])
const selectedCellId = ref<string>('')
const containerRef = ref<HTMLElement>()
const showSplitMenu = ref(false)
const splitMenuPosition = ref({ x: 0, y: 0 })

// 清除格子图片
const clearCellImage = (cellId: string) => {
  const cell = cells.value.find(cell => cell.id === cellId)
  if (cell) {
    cell.image = ''
  }
}

// 从剪贴板粘贴图片
const handlePasteFromClipboard = async () => {
  try {
    const clipboardItems = await navigator.clipboard.read()

    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (type.startsWith('image/')) {
          const blob = await clipboardItem.getType(type)
          const imageUrl = URL.createObjectURL(blob)

          // 优先选择当前选中的格子，如果没有图片的话
          let targetCell = cells.value.find(cell => cell.id === selectedCellId.value && !cell.image)

          // 如果选中的格子已有图片，找第一个没有图片的格子
          if (!targetCell) {
            targetCell = cells.value.find(cell => !cell.image)
          }

          if (targetCell) {
            targetCell.image = imageUrl
            selectedCellId.value = targetCell.id
          }
          return
        }
      }
    }
  }
  catch (err) {
    console.error('粘贴图片失败:', err)
  }
}

// 处理键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'v') {
    e.preventDefault()
    handlePasteFromClipboard()
  }

  // ESC 键取消选择
  if (e.key === 'Escape') {
    selectedCellId.value = ''
    showSplitMenu.value = false
  }

  // Delete 键删除格子图片
  if (e.key === 'Delete' && selectedCellId.value) {
    clearCellImage(selectedCellId.value)
  }
}

// 处理粘贴事件
const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()
  handlePasteFromClipboard()
}

// 当前使用的模板
// const currentTemplate = ref<GridTemplate | null>(null)

// 初始化网格
const initializeGrid = (template: GridTemplate) => {
  cells.value = template.cells.map((cell, index) => ({
    ...cell,
    id: `cell-${Date.now()}-${index}`,
    image: '',
    title: '',
  }))
  selectedCellId.value = cells.value[0]?.id || ''
}

// 选择格子
const selectCell = (cellId: string) => {
  selectedCellId.value = cellId
  showSplitMenu.value = false
}

// 显示分割菜单
const showSplitMenuAt = (event: MouseEvent, cellId: string) => {
  event.preventDefault()
  selectedCellId.value = cellId
  splitMenuPosition.value = { x: event.clientX, y: event.clientY }
  showSplitMenu.value = true
}

// 分割格子
const splitCell = (cellId: string, splitType: SplitType = 'horizontal') => {
  const cellIndex = cells.value.findIndex(cell => cell.id === cellId)
  if (cellIndex === -1)
    return

  const cell = cells.value[cellIndex] as GridCell
  const newCells: GridCell[] = []
  const gap = 2 // 固定间距为2%

  switch (splitType) {
    case 'horizontal': {
      // 水平分割（上下两个格子）
      const availableHeight = cell.height - gap
      const cellHeight = availableHeight / 2

      const newCell1: GridCell = {
        id: `cell-${Date.now()}-1`,
        borderRadius: cell.borderRadius,
        width: cell.width,
        height: cellHeight,
        x: cell.x,
        y: cell.y,
        imageFit: cell.imageFit,
        image: cell.image || '',
        title: cell.title,
      }

      const newCell2: GridCell = {
        id: `cell-${Date.now()}-2`,
        borderRadius: cell.borderRadius,
        width: cell.width,
        height: cellHeight,
        x: cell.x,
        y: cell.y + cellHeight + gap,
        imageFit: cell.imageFit,
        image: '',
        title: '',
      }

      newCells.push(newCell1, newCell2)
      break
    }

    case 'vertical': {
      // 垂直分割（左右两个格子）
      const availableWidth = cell.width - gap
      const cellWidth = availableWidth / 2

      const newCell1: GridCell = {
        id: `cell-${Date.now()}-1`,
        borderRadius: cell.borderRadius,
        width: cellWidth,
        height: cell.height,
        x: cell.x,
        y: cell.y,
        imageFit: cell.imageFit,
        image: cell.image || '',
        title: cell.title,
      }

      const newCell2: GridCell = {
        id: `cell-${Date.now()}-2`,
        borderRadius: cell.borderRadius,
        width: cellWidth,
        height: cell.height,
        x: cell.x + cellWidth + gap,
        y: cell.y,
        imageFit: cell.imageFit,
        image: '',
        title: '',
      }

      newCells.push(newCell1, newCell2)
      break
    }

    case 'quad': {
      // 四分割
      const availableWidth = cell.width - gap
      const availableHeight = cell.height - gap
      const cellWidth = availableWidth / 2
      const cellHeight = availableHeight / 2

      // 左上
      const newCell1: GridCell = {
        id: `cell-${Date.now()}-1`,
        borderRadius: cell.borderRadius,
        width: cellWidth,
        height: cellHeight,
        x: cell.x,
        y: cell.y,
        imageFit: cell.imageFit,
        image: cell.image || '',
        title: cell.title,
      }

      // 右上
      const newCell2: GridCell = {
        id: `cell-${Date.now()}-2`,
        borderRadius: cell.borderRadius,
        width: cellWidth,
        height: cellHeight,
        x: cell.x + cellWidth + gap,
        y: cell.y,
        imageFit: cell.imageFit,
        image: '',
        title: '',
      }

      // 左下
      const newCell3: GridCell = {
        id: `cell-${Date.now()}-3`,
        borderRadius: cell.borderRadius,
        width: cellWidth,
        height: cellHeight,
        x: cell.x,
        y: cell.y + cellHeight + gap,
        imageFit: cell.imageFit,
        image: '',
        title: '',
      }

      // 右下
      const newCell4: GridCell = {
        id: `cell-${Date.now()}-4`,
        borderRadius: cell.borderRadius,
        width: cellWidth,
        height: cellHeight,
        x: cell.x + cellWidth + gap,
        y: cell.y + cellHeight + gap,
        imageFit: cell.imageFit,
        image: '',
        title: '',
      }

      newCells.push(newCell1, newCell2, newCell3, newCell4)
      break
    }
  }

  // 替换原格子
  cells.value.splice(cellIndex, 1, ...newCells)
  selectedCellId.value = newCells[0]?.id || ''
  showSplitMenu.value = false
}

// 删除格子
const deleteCell = (cellId: string) => {
  if (cells.value.length <= 1)
    return // 至少保留一个格子

  const index = cells.value.findIndex(cell => cell.id === cellId)
  if (index > -1) {
    cells.value.splice(index, 1)
    if (selectedCellId.value === cellId) {
      selectedCellId.value = cells.value[0]?.id || ''
    }
  }
}

// 更新格子标题
const updateCellTitle = (cellId: string, title: string) => {
  const cell = cells.value.find(cell => cell.id === cellId)
  if (cell) {
    cell.title = title
  }
}

// 更新格子圆角
const updateCellBorderRadius = (cellId: string, borderRadius: number) => {
  const cell = cells.value.find(cell => cell.id === cellId)
  if (cell) {
    cell.borderRadius = borderRadius
  }
}

// 更新图片适配模式
const updateImageFit = (cellId: string, imageFit: ImageFitMode) => {
  const cell = cells.value.find(cell => cell.id === cellId)
  if (cell) {
    cell.imageFit = imageFit
  }
}

// 上传图片
const handleImageUpload = (cellId: string, event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    const imageUrl = URL.createObjectURL(file)
    const cell = cells.value.find(cell => cell.id === cellId)
    if (cell) {
      cell.image = imageUrl
    }
  }
}

// 处理拖拽
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = (event: DragEvent, cellId: string) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file)
      const cell = cells.value.find(cell => cell.id === cellId)
      if (cell) {
        cell.image = imageUrl
        selectedCellId.value = cellId
      }
    }
  }
}

// 导出画布为图片
const exportCanvas = async () => {
  if (!containerRef.value)
    return

  try {
    // 创建一个临时的 canvas 来绘制图片
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx)
      return

    // 设置画布尺寸
    const containerRect = containerRef.value.getBoundingClientRect()
    canvas.width = containerRect.width
    canvas.height = containerRect.height

    // 填充背景色
    ctx.fillStyle = '#f3f4f6' // 对应 bg-gray-100
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制每个格子
    const drawPromises = cells.value.map(async (cell) => {
      const cellX = (cell.x / 100) * canvas.width
      const cellY = (cell.y / 100) * canvas.height
      const cellWidth = (cell.width / 100) * canvas.width
      const cellHeight = (cell.height / 100) * canvas.height

      // 绘制格子背景
      ctx.fillStyle = cell.image ? '#ffffff' : '#e5e7eb'
      ctx.fillRect(cellX, cellY, cellWidth, cellHeight)

      // 如果有图片，绘制图片
      if (cell.image) {
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            // 根据适配模式绘制图片
            let drawX = cellX
            let drawY = cellY
            let drawWidth = cellWidth
            let drawHeight = cellHeight

            const imgAspect = img.width / img.height
            const cellAspect = cellWidth / cellHeight

            if (cell.imageFit === 'cover') {
              if (imgAspect > cellAspect) {
                // 图片更宽，以高度为准
                drawWidth = cellHeight * imgAspect
                drawX = cellX - (drawWidth - cellWidth) / 2
              }
              else {
                // 图片更高，以宽度为准
                drawHeight = cellWidth / imgAspect
                drawY = cellY - (drawHeight - cellHeight) / 2
              }
            }
            else if (cell.imageFit === 'contain') {
              if (imgAspect > cellAspect) {
                // 图片更宽，以宽度为准
                drawHeight = cellWidth / imgAspect
                drawY = cellY + (cellHeight - drawHeight) / 2
              }
              else {
                // 图片更高，以高度为准
                drawWidth = cellHeight * imgAspect
                drawX = cellX + (cellWidth - drawWidth) / 2
              }
            }

            // 保存当前状态
            ctx.save()

            // 创建圆角裁剪路径
            if (cell.borderRadius > 0) {
              const radius = Math.min(cell.borderRadius, cellWidth / 2, cellHeight / 2)
              ctx.beginPath()
              ctx.roundRect(cellX, cellY, cellWidth, cellHeight, radius)
              ctx.clip()
            }

            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

            // 恢复状态
            ctx.restore()

            // 绘制标题
            if (cell.title) {
              const titleHeight = 24
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
              ctx.fillRect(cellX, cellY + cellHeight - titleHeight, cellWidth, titleHeight)

              ctx.fillStyle = '#ffffff'
              ctx.font = '12px sans-serif'
              ctx.textAlign = 'left'
              ctx.textBaseline = 'middle'
              ctx.fillText(cell.title, cellX + 8, cellY + cellHeight - titleHeight / 2)
            }

            resolve()
          }
          img.onerror = () => resolve()
          img.src = cell.image
        })
      }
      else {
        // 绘制占位符
        ctx.fillStyle = '#9ca3af'
        ctx.font = '16px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('📷', cellX + cellWidth / 2, cellY + cellHeight / 2 - 10)

        ctx.font = '10px sans-serif'
        ctx.fillText('拖拽图片', cellX + cellWidth / 2, cellY + cellHeight / 2 + 8)

        return Promise.resolve()
      }
    })

    // 等待所有图片绘制完成
    await Promise.all(drawPromises)

    // 导出图片
    const link = document.createElement('a')
    link.download = `imgx-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()

    // 显示成功提示
    console.log('图片导出成功！')
  }
  catch (err) {
    console.error('导出失败:', err)
    // alert('导出失败，请重试')
  }
}

// 获取选中的格子
const selectedCell = computed(() => {
  return cells.value.find(cell => cell.id === selectedCellId.value)
})

// 间距功能已移除，保持简单稳定的布局

// 页面加载时初始化
onMounted(() => {
  if (templates.length > 0) {
    initializeGrid(templates[0])
  }

  // 监听键盘事件
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('paste', handlePaste)

  // 点击其他地方关闭分割菜单
  document.addEventListener('click', () => {
    showSplitMenu.value = false
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('paste', handlePaste)
})
</script>

<template>
  <div class="h-screen bg-gray-50 p-3">
    <div class="h-full grid grid-cols-5 gap-3">
      <!-- 左侧控制面板 -->
      <div class="col-span-1 space-y-3 overflow-y-auto">
        <!-- 模板选择 -->
        <div class="bg-white rounded-lg p-3 shadow-sm">
          <h3 class="text-sm font-semibold mb-3">
            模板
          </h3>
          <div class="space-y-1">
            <button
              v-for="template in templates"
              :key="template.name"
              class="w-full text-left p-2 text-xs rounded border hover:bg-gray-50 transition-colors"
              @click="initializeGrid(template)"
            >
              <div class="font-medium">
                {{ template.name }}
              </div>
            </button>
          </div>
        </div>

        <!-- 格子设置 -->
        <div v-if="selectedCell" class="bg-white rounded-lg p-3 shadow-sm">
          <h3 class="text-sm font-semibold mb-3">
            格子设置
          </h3>

          <!-- 标题输入 -->
          <div class="mb-3">
            <label class="block text-xs font-medium mb-1">标题</label>
            <input
              :value="selectedCell.title"
              type="text"
              placeholder="图片说明..."
              class="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              @input="updateCellTitle(selectedCell.id, ($event.target as HTMLInputElement).value)"
            >
          </div>

          <!-- 圆角调整 -->
          <div class="mb-3">
            <label class="block text-xs font-medium mb-1">
              圆角: {{ selectedCell.borderRadius }}px
            </label>
            <input
              :value="selectedCell.borderRadius"
              type="range"
              min="0"
              max="50"
              class="w-full"
              @input="updateCellBorderRadius(selectedCell.id, Number(($event.target as HTMLInputElement).value))"
            >
          </div>

          <!-- 图片适配模式 -->
          <div v-if="selectedCell.image" class="mb-3">
            <label class="block text-xs font-medium mb-1">适配模式</label>
            <select
              :value="selectedCell.imageFit"
              class="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              @change="updateImageFit(selectedCell.id, ($event.target as HTMLSelectElement).value as ImageFitMode)"
            >
              <option value="cover">
                覆盖
              </option>
              <option value="contain">
                包含
              </option>
              <option value="fill">
                拉伸
              </option>
            </select>
          </div>

          <!-- 图片上传 -->
          <div class="mb-3">
            <label class="block text-xs font-medium mb-1">上传图片</label>
            <input
              type="file"
              accept="image/*"
              class="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700"
              @change="handleImageUpload(selectedCell.id, $event)"
            >
          </div>

          <!-- 格子操作 -->
          <div class="space-y-2">
            <div class="text-xs font-medium">
              操作
            </div>
            <div class="grid grid-cols-2 gap-1">
              <button
                class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                @click="splitCell(selectedCell.id, 'horizontal')"
              >
                水平分割
              </button>
              <button
                class="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                @click="splitCell(selectedCell.id, 'vertical')"
              >
                垂直分割
              </button>
              <button
                class="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                @click="splitCell(selectedCell.id, 'quad')"
              >
                四分割
              </button>
              <button
                v-if="selectedCell.image"
                class="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
                @click="clearCellImage(selectedCell.id)"
              >
                清除图片
              </button>
            </div>
            <button
              v-if="cells.length > 1"
              class="w-full px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              @click="deleteCell(selectedCell.id)"
            >
              删除格子
            </button>
          </div>
        </div>

        <!-- 全局操作 -->
        <div class="bg-white rounded-lg p-3 shadow-sm">
          <h3 class="text-sm font-semibold mb-3">
            全局操作
          </h3>

          <button
            class="w-full px-3 py-2 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
            @click="exportCanvas"
          >
            导出图片
          </button>
        </div>

        <!-- 使用提示 -->
        <div class="bg-white rounded-lg p-3 shadow-sm">
          <h3 class="text-sm font-semibold mb-2">
            快捷键
          </h3>
          <div class="text-xs text-gray-600 space-y-1">
            <div>Ctrl+V: 粘贴图片</div>
            <div>Delete: 清除图片</div>
            <div>ESC: 取消选择</div>
            <div>右键: 更多选项</div>
          </div>
        </div>
      </div>

      <!-- 右侧画布区域 -->
      <div class="col-span-4">
        <div class="bg-white rounded-lg p-4 shadow-sm h-full flex flex-col">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold">
              IMGX 画布
            </h3>
            <div class="text-xs text-gray-500">
              拖拽图片 | Ctrl+V 粘贴 | 右键分割
            </div>
          </div>

          <!-- 网格容器 -->
          <div class="flex-1 relative">
            <div
              ref="containerRef"
              class="w-full h-full bg-gray-100 rounded-lg overflow-hidden relative"
            >
              <!-- 格子 -->
              <div
                v-for="cell in cells"
                :key="cell.id"
                class="absolute cursor-pointer transition-all duration-200 border-2 overflow-hidden" :class="[
                  selectedCellId === cell.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400',
                ]"
                :style="{
                  left: `${cell.x}%`,
                  top: `${cell.y}%`,
                  width: `${cell.width}%`,
                  height: `${cell.height}%`,
                  borderRadius: `${cell.borderRadius}px`,
                }"
                @click="selectCell(cell.id)"
                @contextmenu="showSplitMenuAt($event, cell.id)"
                @dragover="handleDragOver"
                @drop="handleDrop($event, cell.id)"
              >
                <!-- 图片 -->
                <div
                  v-if="cell.image"
                  class="w-full h-full relative overflow-hidden"
                >
                  <img
                    :src="cell.image"
                    :alt="cell.title || '图片'"
                    class="w-full h-full" :class="[
                      cell.imageFit === 'cover' ? 'object-cover'
                      : cell.imageFit === 'contain' ? 'object-contain'
                        : 'object-fill',
                    ]"
                    :style="{ borderRadius: `${cell.borderRadius}px` }"
                  >
                </div>

                <!-- 占位符 -->
                <div
                  v-else
                  class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500"
                >
                  <div class="text-center p-2">
                    <div class="text-xl mb-1">
                      📷
                    </div>
                    <div class="text-xs">
                      拖拽图片
                    </div>
                    <div class="text-xs">
                      Ctrl+V
                    </div>
                  </div>
                </div>

                <!-- 标题栏 -->
                <div
                  v-if="cell.title"
                  class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 text-xs"
                  :style="{
                    borderBottomLeftRadius: `${cell.borderRadius}px`,
                    borderBottomRightRadius: `${cell.borderRadius}px`,
                  }"
                >
                  {{ cell.title }}
                </div>

                <!-- 选中指示器 -->
                <div
                  v-if="selectedCellId === cell.id"
                  class="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右键分割菜单 -->
    <div
      v-if="showSplitMenu"
      class="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
      :style="{ left: `${splitMenuPosition.x}px`, top: `${splitMenuPosition.y}px` }"
      @click.stop
    >
      <button
        class="w-full px-3 py-1 text-left hover:bg-gray-100 text-xs"
        @click="splitCell(selectedCellId, 'horizontal')"
      >
        水平分割
      </button>
      <button
        class="w-full px-3 py-1 text-left hover:bg-gray-100 text-xs"
        @click="splitCell(selectedCellId, 'vertical')"
      >
        垂直分割
      </button>
      <button
        class="w-full px-3 py-1 text-left hover:bg-gray-100 text-xs"
        @click="splitCell(selectedCellId, 'quad')"
      >
        四分割
      </button>
      <hr class="my-1">
      <button
        v-if="cells.find(c => c.id === selectedCellId)?.image"
        class="w-full px-3 py-1 text-left hover:bg-gray-100 text-xs text-orange-600"
        @click="clearCellImage(selectedCellId)"
      >
        清除图片
      </button>
      <button
        v-if="cells.length > 1"
        class="w-full px-3 py-1 text-left hover:bg-gray-100 text-xs text-red-600"
        @click="deleteCell(selectedCellId)"
      >
        删除格子
      </button>
    </div>
  </div>
</template>
