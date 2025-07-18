<script setup lang="ts">
// 使用 clean 布局，禁用 SSR
definePageMeta({
  layout: 'clean',
  ssr: false,
})

useHead({
  title: 'IMGX - 图片拼图编辑器',
  meta: [
    {
      name: 'description',
      content: '免费图片拼接、免费图片切割、免费拼接长图、免费生成文字图',
    },
  ],
})

// 图片适配模式
type ImageFitMode = 'cover' | 'contain' | 'fill'

// 网格单元格接口
interface GridCell {
  id: string
  image?: string
  title?: string
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
  {
    name: '九宫格',
    description: '九张图片网格排列',
    cells: [
      // 第一行
      { borderRadius: 8, width: 33.33, height: 33.33, x: 0, y: 0, imageFit: 'cover' },
      { borderRadius: 8, width: 33.33, height: 33.33, x: 33.33, y: 0, imageFit: 'cover' },
      { borderRadius: 8, width: 33.34, height: 33.33, x: 66.66, y: 0, imageFit: 'cover' },
      // 第二行
      { borderRadius: 8, width: 33.33, height: 33.33, x: 0, y: 33.33, imageFit: 'cover' },
      { borderRadius: 8, width: 33.33, height: 33.33, x: 33.33, y: 33.33, imageFit: 'cover' },
      { borderRadius: 8, width: 33.34, height: 33.33, x: 66.66, y: 33.33, imageFit: 'cover' },
      // 第三行
      { borderRadius: 8, width: 33.33, height: 33.34, x: 0, y: 66.66, imageFit: 'cover' },
      { borderRadius: 8, width: 33.33, height: 33.34, x: 33.33, y: 66.66, imageFit: 'cover' },
      { borderRadius: 8, width: 33.34, height: 33.34, x: 66.66, y: 66.66, imageFit: 'cover' },
    ],
  },
]

// 宽高比选项
interface AspectRatioOption {
  name: string
  ratio: number // 宽度/高度
  description: string
}

const aspectRatioOptions: AspectRatioOption[] = [
  { name: '1:1', ratio: 1, description: '正方形' },
  { name: '2.35:1', ratio: 2.35, description: '电影比例' },
  { name: '3:4', ratio: 3 / 4, description: '竖屏' },
  { name: '4:3', ratio: 4 / 3, description: '传统横屏' },
  { name: '16:9', ratio: 16 / 9, description: '宽屏' },
  { name: '9:16', ratio: 9 / 16, description: '竖屏' },
]

// 工作模式
type WorkMode = 'puzzle' | 'split' | 'long'

interface WorkModeOption {
  key: WorkMode
  name: string
  description: string
  disabled?: boolean
}

const workModeOptions: WorkModeOption[] = [
  { key: 'puzzle', name: '拼图', description: '手动拼接多张图片' },
  { key: 'split', name: '分图', description: '自动分割单张图片' },
  { key: 'long', name: '长图', description: '制作长图拼接', disabled: true },
]

// 响应式数据
const cells = ref<GridCell[]>([])
const selectedCellId = ref<string>('')
const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLElement>()
const showSplitMenu = ref(false)
const splitMenuPosition = ref({ x: 0, y: 0 })
const globalGap = ref(4) // 全局内间距，单位为像素
const globalBorderRadius = ref(8) // 全局圆角大小
const isGlobalBorderRadius = ref(false) // 是否启用全局圆角模式
const selectedAspectRatio = ref<AspectRatioOption>(aspectRatioOptions[0] as AspectRatioOption) // 默认1:1
const currentWorkMode = ref<WorkMode>('puzzle') // 默认拼图模式

// 清除格子图片
const clearCellImage = (cellId: string) => {
  const cell = cells.value.find(cell => cell.id === cellId)
  if (cell) {
    cell.image = ''
  }
}

// 图片分割功能
const splitImageToGrid = async (imageUrl: string) => {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // 创建临时canvas来分割图片
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve()
        return
      }

      // 设置canvas尺寸为原图尺寸
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // 根据网格分割图片
      cells.value.forEach((cell) => {
        // 计算每个格子在原图中的位置和尺寸
        const sourceX = (cell.x / 100) * img.width
        const sourceY = (cell.y / 100) * img.height
        const sourceWidth = (cell.width / 100) * img.width
        const sourceHeight = (cell.height / 100) * img.height

        // 创建新的canvas来存储分割后的图片片段
        const cellCanvas = document.createElement('canvas')
        const cellCtx = cellCanvas.getContext('2d')
        if (!cellCtx)
          return

        cellCanvas.width = sourceWidth
        cellCanvas.height = sourceHeight

        // 从原图中提取对应区域
        cellCtx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          sourceWidth,
          sourceHeight,
        )

        // 将分割后的图片设置到对应格子
        cell.image = cellCanvas.toDataURL('image/png')
      })

      resolve()
    }
    img.onerror = () => resolve()
    img.src = imageUrl
  })
}

// 处理图片输入（支持分割模式）
const handleImageInput = async (imageUrl: string) => {
  if (currentWorkMode.value === 'split') {
    // 分图模式：自动分割图片到所有格子
    await splitImageToGrid(imageUrl)
  }
  else {
    // 拼图模式：优先放到选中的格子，如果没有选中则放到第一个空格子，如果没有空格子则放到第一个格子
    let targetCell = cells.value.find(cell => cell.id === selectedCellId.value)

    // 如果没有选中的格子，优先找空格子
    if (!targetCell) {
      targetCell = cells.value.find(cell => !cell.image)
    }

    // 如果没有空格子，就用第一个格子
    if (!targetCell) {
      targetCell = cells.value[0]
    }

    if (targetCell) {
      targetCell.image = imageUrl
      selectedCellId.value = targetCell.id
    }
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
          await handleImageInput(imageUrl)
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

  // 获取屏幕尺寸
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  // 估算菜单尺寸（基于按钮数量和大小）
  const menuWidth = 400 // 估算菜单宽度
  const menuHeight = 60 // 估算菜单高度

  let x = event.clientX
  let y = event.clientY

  // 水平位置调整：如果鼠标在屏幕右侧，菜单出现在左侧
  if (event.clientX + menuWidth > screenWidth) {
    x = event.clientX - menuWidth
  }

  // 垂直位置调整：如果鼠标在屏幕底部，菜单出现在上方
  if (event.clientY + menuHeight > screenHeight) {
    y = event.clientY - menuHeight
  }

  // 确保菜单不会超出屏幕边界
  x = Math.max(0, Math.min(x, screenWidth - menuWidth))
  y = Math.max(0, Math.min(y, screenHeight - menuHeight))

  splitMenuPosition.value = { x, y }
  showSplitMenu.value = true
}

// 分割格子
const splitCell = (cellId: string, splitType: SplitType = 'horizontal') => {
  const cellIndex = cells.value.findIndex(cell => cell.id === cellId)
  if (cellIndex === -1)
    return

  const cell = cells.value[cellIndex] as GridCell
  const newCells: GridCell[] = []
  const gap = 0 // 分割时不使用间距，间距通过CSS padding实现

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

// 横向扩展格子 - 简化算法，更准确的空白检测
// const expandCellHorizontally = (cellId: string) => {
//   const cell = cells.value.find(c => c.id === cellId)
//   if (!cell)
//     return

//   console.log(`开始横向扩展格子 ${cellId}:`, {
//     x: cell.x,
//     y: cell.y,
//     width: cell.width,
//     height: cell.height,
//   })

//   // 当前格子的右边界
//   const rightBoundary = cell.x + cell.width

//   // 找到所有可能阻挡扩展的格子
//   const blockingCells: Array<{ cell: GridCell, distance: number }> = []

//   for (const otherCell of cells.value) {
//     if (otherCell.id === cellId)
//       continue

//     // 检查是否在垂直方向上有重叠（即在同一水平带上）
//     const verticalOverlap = !(
//       otherCell.y >= cell.y + cell.height
//       || otherCell.y + otherCell.height <= cell.y
//     )

//     // 如果有垂直重叠且在右侧，则可能阻挡扩展
//     if (verticalOverlap && otherCell.x >= rightBoundary) {
//       blockingCells.push({
//         cell: otherCell,
//         distance: otherCell.x - rightBoundary,
//       })
//     }
//   }

//   // 找到最近的阻挡格子
//   let maxExpandWidth = 100 - rightBoundary // 默认扩展到画布右边界

//   if (blockingCells.length > 0) {
//     // 按距离排序，找到最近的阻挡格子
//     blockingCells.sort((a, b) => a.distance - b.distance)
//     const nearestBlocking = blockingCells[0]
//     maxExpandWidth = Math.min(maxExpandWidth, nearestBlocking.distance)
//   }

//   console.log(`检测结果:`, {
//     rightBoundary,
//     blockingCells: blockingCells.length,
//     maxExpandWidth,
//     canvasRightBoundary: 100,
//   })

//   // 如果有可扩展空间（至少0.1%），执行扩展
//   if (maxExpandWidth > 0.1) {
//     const oldWidth = cell.width
//     cell.width += maxExpandWidth
//     console.log(`格子 ${cellId} 横向扩展成功: ${oldWidth}% → ${cell.width}% (扩展了${maxExpandWidth}%)`)
//   }
//   else {
//     console.log(`格子 ${cellId} 无法横向扩展，可用空间: ${maxExpandWidth}%`)
//   }
// }

// 纵向扩展格子 - 简化算法，更准确的空白检测
// const expandCellVertically = (cellId: string) => {
//   const cell = cells.value.find(c => c.id === cellId)
//   if (!cell)
//     return

//   console.log(`开始纵向扩展格子 ${cellId}:`, {
//     x: cell.x,
//     y: cell.y,
//     width: cell.width,
//     height: cell.height,
//   })

//   // 当前格子的下边界
//   const bottomBoundary = cell.y + cell.height

//   // 找到所有可能阻挡扩展的格子
//   const blockingCells: Array<{ cell: GridCell, distance: number }> = []

//   for (const otherCell of cells.value) {
//     if (otherCell.id === cellId)
//       continue

//     // 检查是否在水平方向上有重叠（即在同一垂直带上）
//     const horizontalOverlap = !(
//       otherCell.x >= cell.x + cell.width
//       || otherCell.x + otherCell.width <= cell.x
//     )

//     // 如果有水平重叠且在下方，则可能阻挡扩展
//     if (horizontalOverlap && otherCell.y >= bottomBoundary) {
//       blockingCells.push({
//         cell: otherCell,
//         distance: otherCell.y - bottomBoundary,
//       })
//     }
//   }

//   // 找到最近的阻挡格子
//   let maxExpandHeight = 100 - bottomBoundary // 默认扩展到画布下边界

//   if (blockingCells.length > 0) {
//     // 按距离排序，找到最近的阻挡格子
//     blockingCells.sort((a, b) => a.distance - b.distance)
//     const nearestBlocking = blockingCells[0]
//     maxExpandHeight = Math.min(maxExpandHeight, nearestBlocking.distance)
//   }

//   console.log(`检测结果:`, {
//     bottomBoundary,
//     blockingCells: blockingCells.length,
//     maxExpandHeight,
//     canvasBottomBoundary: 100,
//   })

//   // 如果有可扩展空间（至少0.1%），执行扩展
//   if (maxExpandHeight > 0.1) {
//     const oldHeight = cell.height
//     cell.height += maxExpandHeight
//     console.log(`格子 ${cellId} 纵向扩展成功: ${oldHeight}% → ${cell.height}% (扩展了${maxExpandHeight}%)`)
//   }
//   else {
//     console.log(`格子 ${cellId} 无法纵向扩展，可用空间: ${maxExpandHeight}%`)
//   }
// }

// 向右扩展格子
const expandCellRight = (cellId: string) => {
  const cell = cells.value.find(c => c.id === cellId)
  if (!cell)
    return

  console.log(`开始向右扩展格子 ${cellId}:`, { x: cell.x, y: cell.y, width: cell.width, height: cell.height })

  const rightBoundary = cell.x + cell.width
  const blockingCells: Array<{ cell: GridCell, distance: number }> = []

  for (const otherCell of cells.value) {
    if (otherCell.id === cellId)
      continue

    const verticalOverlap = !(otherCell.y >= cell.y + cell.height || otherCell.y + otherCell.height <= cell.y)

    if (verticalOverlap && otherCell.x >= rightBoundary) {
      blockingCells.push({ cell: otherCell, distance: otherCell.x - rightBoundary })
    }
  }

  let maxExpandWidth = 100 - rightBoundary
  if (blockingCells.length > 0) {
    blockingCells.sort((a, b) => a.distance - b.distance)
    maxExpandWidth = Math.min(maxExpandWidth, blockingCells[0]!.distance)
  }

  if (maxExpandWidth > 0.1) {
    const oldWidth = cell.width
    cell.width += maxExpandWidth
    console.log(`格子 ${cellId} 向右扩展成功: ${oldWidth}% → ${cell.width}%`)
  }
  else {
    console.log(`格子 ${cellId} 无法向右扩展，可用空间: ${maxExpandWidth}%`)
  }
}

// 向左扩展格子
const expandCellLeft = (cellId: string) => {
  const cell = cells.value.find(c => c.id === cellId)
  if (!cell)
    return

  console.log(`开始向左扩展格子 ${cellId}:`, { x: cell.x, y: cell.y, width: cell.width, height: cell.height })

  const leftBoundary = cell.x
  const blockingCells: Array<{ cell: GridCell, distance: number }> = []

  for (const otherCell of cells.value) {
    if (otherCell.id === cellId)
      continue

    const verticalOverlap = !(otherCell.y >= cell.y + cell.height || otherCell.y + otherCell.height <= cell.y)

    if (verticalOverlap && otherCell.x + otherCell.width <= leftBoundary) {
      blockingCells.push({ cell: otherCell, distance: leftBoundary - (otherCell.x + otherCell.width) })
    }
  }

  let maxExpandWidth = leftBoundary // 默认扩展到画布左边界
  if (blockingCells.length > 0) {
    blockingCells.sort((a, b) => a.distance - b.distance)
    maxExpandWidth = Math.min(maxExpandWidth, blockingCells[0]!.distance)
  }

  if (maxExpandWidth > 0.1) {
    const oldWidth = cell.width
    const oldX = cell.x
    cell.width += maxExpandWidth
    cell.x -= maxExpandWidth
    console.log(`格子 ${cellId} 向左扩展成功: 位置 ${oldX}% → ${cell.x}%, 宽度 ${oldWidth}% → ${cell.width}%`)
  }
  else {
    console.log(`格子 ${cellId} 无法向左扩展，可用空间: ${maxExpandWidth}%`)
  }
}

// 向下扩展格子
const expandCellDown = (cellId: string) => {
  const cell = cells.value.find(c => c.id === cellId)
  if (!cell)
    return

  console.log(`开始向下扩展格子 ${cellId}:`, { x: cell.x, y: cell.y, width: cell.width, height: cell.height })

  const bottomBoundary = cell.y + cell.height
  const blockingCells: Array<{ cell: GridCell, distance: number }> = []

  for (const otherCell of cells.value) {
    if (otherCell.id === cellId)
      continue

    const horizontalOverlap = !(otherCell.x >= cell.x + cell.width || otherCell.x + otherCell.width <= cell.x)

    if (horizontalOverlap && otherCell.y >= bottomBoundary) {
      blockingCells.push({ cell: otherCell, distance: otherCell.y - bottomBoundary })
    }
  }

  let maxExpandHeight = 100 - bottomBoundary
  if (blockingCells.length > 0) {
    blockingCells.sort((a, b) => a.distance - b.distance)
    maxExpandHeight = Math.min(maxExpandHeight, blockingCells[0]!.distance)
  }

  if (maxExpandHeight > 0.1) {
    const oldHeight = cell.height
    cell.height += maxExpandHeight
    console.log(`格子 ${cellId} 向下扩展成功: ${oldHeight}% → ${cell.height}%`)
  }
  else {
    console.log(`格子 ${cellId} 无法向下扩展，可用空间: ${maxExpandHeight}%`)
  }
}

// 向上扩展格子
const expandCellUp = (cellId: string) => {
  const cell = cells.value.find(c => c.id === cellId)
  if (!cell)
    return

  console.log(`开始向上扩展格子 ${cellId}:`, { x: cell.x, y: cell.y, width: cell.width, height: cell.height })

  const topBoundary = cell.y
  const blockingCells: Array<{ cell: GridCell, distance: number }> = []

  for (const otherCell of cells.value) {
    if (otherCell.id === cellId)
      continue

    const horizontalOverlap = !(otherCell.x >= cell.x + cell.width || otherCell.x + otherCell.width <= cell.x)

    if (horizontalOverlap && otherCell.y + otherCell.height <= topBoundary) {
      blockingCells.push({ cell: otherCell, distance: topBoundary - (otherCell.y + otherCell.height) })
    }
  }

  let maxExpandHeight = topBoundary // 默认扩展到画布上边界
  if (blockingCells.length > 0) {
    blockingCells.sort((a, b) => a.distance - b.distance)
    maxExpandHeight = Math.min(maxExpandHeight, blockingCells[0]!.distance)
  }

  if (maxExpandHeight > 0.1) {
    const oldHeight = cell.height
    const oldY = cell.y
    cell.height += maxExpandHeight
    cell.y -= maxExpandHeight
    console.log(`格子 ${cellId} 向上扩展成功: 位置 ${oldY}% → ${cell.y}%, 高度 ${oldHeight}% → ${cell.height}%`)
  }
  else {
    console.log(`格子 ${cellId} 无法向上扩展，可用空间: ${maxExpandHeight}%`)
  }
}

// 更新格子标题
const updateCellTitle = (cellId: string, title: string) => {
  const cell = cells.value.find(cell => cell.id === cellId)
  if (cell) {
    cell.title = title
  }
}

// 更新全局圆角
const updateGlobalBorderRadius = (borderRadius: number) => {
  globalBorderRadius.value = borderRadius
  if (isGlobalBorderRadius.value) {
    // 全局模式：更新所有格子的圆角
    cells.value.forEach((cell) => {
      cell.borderRadius = borderRadius
    })
  }
  else {
    // 单个模式：只更新选中的格子
    if (selectedCellId.value) {
      const cell = cells.value.find(cell => cell.id === selectedCellId.value)
      if (cell) {
        cell.borderRadius = borderRadius
      }
    }
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
const handleImageUpload = async (cellId: string, event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    const imageUrl = URL.createObjectURL(file)

    if (currentWorkMode.value === 'split') {
      // 分图模式：自动分割图片到所有格子
      await splitImageToGrid(imageUrl)
    }
    else {
      // 拼图模式：放到指定格子
      const cell = cells.value.find(cell => cell.id === cellId)
      if (cell) {
        cell.image = imageUrl
      }
    }
  }
}

// 处理拖拽
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = async (event: DragEvent, cellId: string) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file)

      if (currentWorkMode.value === 'split') {
        // 分图模式：自动分割图片到所有格子
        await splitImageToGrid(imageUrl)
      }
      else {
        // 拼图模式：放到指定格子
        const cell = cells.value.find(cell => cell.id === cellId)
        if (cell) {
          cell.image = imageUrl
          selectedCellId.value = cellId
        }
      }
    }
  }
}

// 计算画布尺寸（基于宽高比）
const canvasDimensions = computed(() => {
  if (!containerRef.value) {
    return { width: 600, height: 600 }
  }

  const containerRect = containerRef.value.getBoundingClientRect()
  const containerWidth = containerRect.width - 32 // 减去padding
  const containerHeight = containerRect.height - 80 // 减去标题和padding

  const targetRatio = selectedAspectRatio.value.ratio

  let canvasWidth: number
  let canvasHeight: number

  // 根据容器尺寸和目标宽高比计算最佳画布尺寸
  if (containerWidth / containerHeight > targetRatio) {
    // 容器更宽，以高度为准
    canvasHeight = containerHeight
    canvasWidth = canvasHeight * targetRatio
  }
  else {
    // 容器更高，以宽度为准
    canvasWidth = containerWidth
    canvasHeight = canvasWidth / targetRatio
  }

  return {
    width: Math.floor(canvasWidth),
    height: Math.floor(canvasHeight),
  }
})

// 导出画布为图片
const exportCanvas = async () => {
  if (!canvasRef.value)
    return

  try {
    // 创建一个临时的 canvas 来绘制图片
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx)
      return

    // 使用计算出的画布尺寸，保持宽高比
    canvas.width = canvasDimensions.value.width
    canvas.height = canvasDimensions.value.height

    // 不填充背景色，保持画布透明

    // 绘制每个格子
    const drawPromises = cells.value.map(async (cell) => {
      const cellX = (cell.x / 100) * canvas.width
      const cellY = (cell.y / 100) * canvas.height
      const cellWidth = (cell.width / 100) * canvas.width
      const cellHeight = (cell.height / 100) * canvas.height

      // 导出时需要应用与页面相同的padding效果，保持视觉一致
      const padding = globalGap.value

      // 计算实际的内容区域，确保不会出现负值
      // 限制padding不能超过格子尺寸的一半，避免内容区域过小
      const maxPadding = Math.min(padding, Math.min(cellWidth, cellHeight) / 2 - 1)
      const safePadding = Math.max(0, maxPadding)

      const contentX = cellX + safePadding
      const contentY = cellY + safePadding
      const contentWidth = Math.max(1, cellWidth - safePadding * 2)
      const contentHeight = Math.max(1, cellHeight - safePadding * 2)

      // 确保内容区域有足够的大小进行绘制
      if (contentWidth < 1 || contentHeight < 1) {
        console.warn(`格子 ${cell.id} 内容区域太小，跳过绘制:`, {
          contentWidth,
          contentHeight,
          safePadding,
          cellSize: `${cellWidth}x${cellHeight}`,
        })
        return Promise.resolve()
      }

      // 只有当格子有图片时才绘制内容
      if (cell.image) {
        // 不绘制背景，保持透明
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            // 根据适配模式绘制图片（在内容区域内）
            let drawX = contentX
            let drawY = contentY
            let drawWidth = contentWidth
            let drawHeight = contentHeight

            const imgAspect = img.width / img.height
            const contentAspect = contentWidth / contentHeight

            if (cell.imageFit === 'cover') {
              if (imgAspect > contentAspect) {
                // 图片更宽，以高度为准
                drawWidth = contentHeight * imgAspect
                drawX = contentX - (drawWidth - contentWidth) / 2
              }
              else {
                // 图片更高，以宽度为准
                drawHeight = contentWidth / imgAspect
                drawY = contentY - (drawHeight - contentHeight) / 2
              }
            }
            else if (cell.imageFit === 'contain') {
              if (imgAspect > contentAspect) {
                // 图片更宽，以宽度为准
                drawHeight = contentWidth / imgAspect
                drawY = contentY + (contentHeight - drawHeight) / 2
              }
              else {
                // 图片更高，以高度为准
                drawWidth = contentHeight * imgAspect
                drawX = contentX + (contentWidth - drawWidth) / 2
              }
            }

            // 保存当前状态
            ctx.save()

            // 启用抗锯齿以获得更平滑的圆角
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'

            // 创建圆角裁剪路径（基于内容区域）
            if (cell.borderRadius > 0) {
              // 使用更宽松的圆角限制，保持与页面显示一致
              const maxRadius = Math.min(contentWidth / 2, contentHeight / 2)
              const radius = Math.min(cell.borderRadius, maxRadius)

              ctx.beginPath()
              // 手动绘制圆角矩形路径以获得更好的控制
              ctx.moveTo(contentX + radius, contentY)
              ctx.lineTo(contentX + contentWidth - radius, contentY)
              ctx.quadraticCurveTo(contentX + contentWidth, contentY, contentX + contentWidth, contentY + radius)
              ctx.lineTo(contentX + contentWidth, contentY + contentHeight - radius)
              ctx.quadraticCurveTo(contentX + contentWidth, contentY + contentHeight, contentX + contentWidth - radius, contentY + contentHeight)
              ctx.lineTo(contentX + radius, contentY + contentHeight)
              ctx.quadraticCurveTo(contentX, contentY + contentHeight, contentX, contentY + contentHeight - radius)
              ctx.lineTo(contentX, contentY + radius)
              ctx.quadraticCurveTo(contentX, contentY, contentX + radius, contentY)
              ctx.closePath()
              ctx.clip()
            }

            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

            // 恢复状态
            ctx.restore()

            // 绘制标题（在内容区域底部）- 固定高度32px，支持两行文本
            if (cell.title) {
              const titleHeight = 32 // 固定高度32px，与模板中的h-8一致
              const padding = 8
              const lineHeight = 14
              const fontSize = 12

              // 绘制标题背景
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
              ctx.fillRect(contentX, contentY + contentHeight - titleHeight, contentWidth, titleHeight)

              // 设置文字样式
              ctx.fillStyle = '#ffffff'
              ctx.font = `${fontSize}px sans-serif`
              ctx.textAlign = 'left'
              ctx.textBaseline = 'top'

              // 文本换行处理 - 最多两行
              const maxWidth = contentWidth - padding * 2
              const words = cell.title.split('')
              const lines: string[] = []
              let currentLine = ''

              // 简单的字符换行逻辑
              for (const char of words) {
                const testLine = currentLine + char
                const metrics = ctx.measureText(testLine)

                if (metrics.width > maxWidth && currentLine !== '') {
                  lines.push(currentLine)
                  currentLine = char
                  if (lines.length >= 2)
                    break // 最多两行
                }
                else {
                  currentLine = testLine
                }
              }

              if (currentLine && lines.length < 2) {
                lines.push(currentLine)
              }

              // 绘制文本行
              const startY = contentY + contentHeight - titleHeight + (titleHeight - lines.length * lineHeight) / 2
              lines.forEach((line, index) => {
                ctx.fillText(line, contentX + padding, startY + index * lineHeight)
              })
            }

            resolve()
          }
          img.onerror = () => resolve()
          img.src = cell.image as string
        })
      }
      else {
        // 空格子保持透明，不绘制任何内容
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
    console.log('图片导出成功！', {
      canvasSize: `${canvas.width}x${canvas.height}`,
      cellsCount: cells.value.length,
      cellsWithImages: cells.value.filter(c => c.image).length,
      globalGap: globalGap.value,
    })
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

// 计算圆角的最大值
const maxBorderRadius = computed(() => {
  // 圆角最大值应该是整个画布的最长边的一半，这样用户可以设置某个格子为圆形
  const canvasLongestEdge = Math.max(canvasDimensions.value.width, canvasDimensions.value.height)
  const maxRadius = canvasLongestEdge / 2

  // 直接返回像素值，确保用户可以设置为完美圆形
  return Math.max(8, Math.floor(maxRadius))
})

// 间距功能已移除，保持简单稳定的布局

// 页面加载时初始化
onMounted(() => {
  if (templates.length > 0) {
    initializeGrid(templates[0] as GridTemplate)
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
        <!-- 宽高比选择 -->
        <div class="bg-white rounded-lg p-3 shadow-sm">
          <h3 class="text-sm font-semibold mb-3">
            画布比例 （{{ canvasDimensions.width }}×{{ canvasDimensions.height }}px）
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="option in aspectRatioOptions"
              :key="option.name"
              class="flex flex-col items-center p-2 text-xs rounded border transition-colors"
              :class="[
                selectedAspectRatio.name === option.name
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
              ]"
              @click="selectedAspectRatio = option"
            >
              <div class="font-medium">
                {{ option.name }}
              </div>
            </button>
          </div>
        </div>

        <!-- 模板选择 -->
        <div class="bg-white rounded-lg p-3 shadow-sm">
          <!-- <h3 class="text-sm font-semibold mb-3">
            模板
          </h3> -->
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="template in templates"
              :key="template.name"
              class="flex flex-col items-center p-2 text-xs rounded border hover:bg-gray-50 transition-colors group"
              @click="initializeGrid(template)"
            >
              <!-- 模板图标 -->
              <div class="w-12 h-12 mb-2 relative bg-gray-100 rounded border">
                <div
                  v-for="cell in template.cells"
                  :key="`${cell.x}-${cell.y}`"
                  class="absolute bg-blue-200 group-hover:bg-blue-300 transition-colors rounded-sm"
                  :style="{
                    left: `${cell.x}%`,
                    top: `${cell.y}%`,
                    width: `${cell.width}%`,
                    height: `${cell.height}%`,
                    transform: 'scale(0.9)',
                    transformOrigin: 'center',
                  }"
                />
              </div>
              <!-- 模板名称 -->
              <!-- <div class="font-medium text-center leading-tight">
                {{ template.name }}
              </div> -->
            </button>
          </div>
        </div>

        <!-- 格子设置 -->
        <div v-if="selectedCell" class="bg-white rounded-lg p-3 shadow-sm">
          <!-- <h3 class="text-sm font-semibold mb-3">
            格子设置
          </h3> -->

          <!-- 标题输入 -->
          <div class="mb-3">
            <!-- <label class="block text-xs font-medium mb-1">标题</label> -->
            <input
              :value="selectedCell.title"
              type="text"
              placeholder="图片说明..."
              class="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              @input="updateCellTitle(selectedCell.id, ($event.target as HTMLInputElement).value)"
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
        </div>

        <!-- 全局设置 -->
        <div class="bg-white rounded-lg p-3 shadow-sm">
          <!-- <h3 class="text-sm font-semibold mb-3">
            全局设置
          </h3> -->

          <!-- 间距调整 -->
          <div class="mb-3">
            <label class="block text-xs font-medium mb-1">
              格子间距: {{ globalGap }}px
            </label>
            <input
              v-model="globalGap"
              type="range"
              min="0"
              max="20"
              step="1"
              class="w-full"
            >
          </div>

          <!-- 全局圆角设置 -->
          <div class="mb-3">
            <div class="flex items-center mb-2">
              <input
                id="globalBorderRadius"
                v-model="isGlobalBorderRadius"
                type="checkbox"
                class="mr-2"
              >
              <label for="globalBorderRadius" class="text-xs font-medium">
                全局圆角: {{ globalBorderRadius }}px
              </label>
            </div>
            <input
              v-model="globalBorderRadius"
              type="range"
              min="0"
              :max="maxBorderRadius"
              step="1"
              class="w-full"
              @input="updateGlobalBorderRadius(Number(($event.target as HTMLInputElement).value))"
            >
            <div class="text-xs text-gray-500 mt-1">
              {{ isGlobalBorderRadius ? '调整所有格子圆角' : '仅调整选中格子圆角' }}
            </div>
          </div>

          <button
            class="w-full px-3 py-2 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
            @click="exportCanvas"
          >
            导出图片
          </button>
        </div>
      </div>

      <!-- 右侧画布区域 -->
      <div class="col-span-4">
        <div class="bg-white rounded-lg p-4 shadow-sm h-full flex flex-col">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-4">
              <h3 class="text-lg font-semibold">
                IMGX
              </h3>
              <!-- 模式切换 -->
              <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  v-for="mode in workModeOptions"
                  :key="mode.key"
                  class="px-3 py-1 text-xs rounded transition-colors"
                  :class="[
                    currentWorkMode === mode.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900',
                  ]"
                  :disabled="!!mode.disabled"
                  @click="currentWorkMode = mode.key"
                >
                  {{ mode.name }}
                </button>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-xs text-red-500">
                {{ currentWorkMode === 'puzzle' ? '支持直接 Ctrl+V 粘贴 | 右键呼出操作面板'
                  : currentWorkMode === 'split' ? '上传图片自动分割到网格，分割后可以再切换回继续拼图' : '制作长图拼接' }}
              </div>
            </div>
          </div>

          <!-- 网格容器 -->
          <div ref="containerRef" class="flex-1 relative flex items-center justify-center">
            <div
              ref="canvasRef"
              class="bg-gray-100 rounded-lg overflow-hidden relative shadow-lg"
              :style="{
                width: `${canvasDimensions.width}px`,
                height: `${canvasDimensions.height}px`,
              }"
            >
              <!-- 格子容器 -->
              <div
                v-for="cell in cells"
                :key="cell.id"
                class="absolute cursor-pointer transition-all duration-200"
                :style="{
                  left: `${cell.x}%`,
                  top: `${cell.y}%`,
                  width: `${cell.width}%`,
                  height: `${cell.height}%`,
                  padding: `${globalGap}px`,
                }"
                @click="selectCell(cell.id)"
                @contextmenu="showSplitMenuAt($event, cell.id)"
                @dragover="handleDragOver"
                @drop="handleDrop($event, cell.id)"
              >
                <!-- 格子内容 -->
                <div
                  class="w-full h-full border-2 overflow-hidden relative" :class="[
                    selectedCellId === cell.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400',
                  ]"
                  :style="{
                    borderRadius: `${cell.borderRadius}px`,
                  }"
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
                    class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 text-xs h-8 flex items-center overflow-hidden"
                    :style="{
                      borderBottomLeftRadius: `${cell.borderRadius}px`,
                      borderBottomRightRadius: `${cell.borderRadius}px`,
                    }"
                  >
                    <div class="line-clamp-2 leading-tight">
                      {{ cell.title }}
                    </div>
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
    </div>

    <!-- 右键操作菜单 -->
    <div
      v-if="showSplitMenu"
      class="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50"
      :style="{ left: `${splitMenuPosition.x}px`, top: `${splitMenuPosition.y}px` }"
      @click.stop
    >
      <div class="flex items-center gap-1">
        <!-- 分割操作 -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="p-2 h-auto"
                @click="splitCell(selectedCellId, 'horizontal'); showSplitMenu = false"
              >
                <Icon name="fluent:split-horizontal-28-filled" size="1.5em" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>上下分割</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="p-2 h-auto"
                @click="splitCell(selectedCellId, 'vertical'); showSplitMenu = false"
              >
                <Icon name="fluent:split-vertical-28-filled" size="1.5em" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>左右分割</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="p-2 h-auto"
                @click="splitCell(selectedCellId, 'quad'); showSplitMenu = false"
              >
                <Icon name="fluent:layout-cell-four-24-filled" size="2em" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>四等分</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <!-- 分割线 -->
        <Separator orientation="vertical" class="!h-4 mx-1" />

        <!-- 扩展操作 -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="p-2 h-auto"
                @click="expandCellLeft(selectedCellId); showSplitMenu = false"
              >
                <Icon name="fluent:panel-left-contract-24-filled" size="2em" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>向左扩展</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="p-2 h-auto"
                @click="expandCellRight(selectedCellId); showSplitMenu = false"
              >
                <Icon name="fluent:panel-right-contract-24-filled" size="2em" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>向右扩展</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="p-2 h-auto"
                @click="expandCellUp(selectedCellId); showSplitMenu = false"
              >
                <Icon name="fluent:panel-top-contract-20-filled" size="2em" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>向上扩展</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="p-2 h-auto"
                @click="expandCellDown(selectedCellId); showSplitMenu = false"
              >
                <Icon name="fluent:panel-bottom-contract-20-filled" size="2em" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>向下扩展</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <!-- 分割线 -->
        <Separator orientation="vertical" class="!h-4 mx-1" />

        <!-- 管理操作 -->
        <TooltipProvider v-if="cells.find(c => c.id === selectedCellId)?.image">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="p-2 h-auto text-orange-600 hover:text-orange-700"
                @click="clearCellImage(selectedCellId); showSplitMenu = false"
              >
                <Icon name="fluent:image-arrow-counterclockwise-24-filled" size="2em" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>清除图片</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider v-if="cells.length > 1">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="p-2 h-auto text-red-600 hover:text-red-700"
                @click="deleteCell(selectedCellId); showSplitMenu = false"
              >
                <Icon name="fluent:delete-12-filled" size="2em" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>删除格子</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </div>
</template>
