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
      { borderRadius: 8, width: 33.333333, height: 33.333333, x: 0, y: 0, imageFit: 'cover' },
      { borderRadius: 8, width: 33.333333, height: 33.333333, x: 33.333333, y: 0, imageFit: 'cover' },
      { borderRadius: 8, width: 33.333334, height: 33.333333, x: 66.666666, y: 0, imageFit: 'cover' },
      // 第二行
      { borderRadius: 8, width: 33.333333, height: 33.333333, x: 0, y: 33.333333, imageFit: 'cover' },
      { borderRadius: 8, width: 33.333333, height: 33.333333, x: 33.333333, y: 33.333333, imageFit: 'cover' },
      { borderRadius: 8, width: 33.333334, height: 33.333333, x: 66.666666, y: 33.333333, imageFit: 'cover' },
      // 第三行
      { borderRadius: 8, width: 33.333333, height: 33.333334, x: 0, y: 66.666666, imageFit: 'cover' },
      { borderRadius: 8, width: 33.333333, height: 33.333334, x: 33.333333, y: 66.666666, imageFit: 'cover' },
      { borderRadius: 8, width: 33.333334, height: 33.333334, x: 66.666666, y: 66.666666, imageFit: 'cover' },
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
  { key: 'long', name: '长图', description: '制作长图拼接' },
]

// 长图方向类型
type LongImageDirection = 'horizontal' | 'vertical'

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
const currentWorkMode = ref<WorkMode>('puzzle') // 当前工作模式
const longImageDirection = ref<LongImageDirection>('vertical') // 长图方向，默认纵向

// 清除格子图片
function clearCellImage(cellId: string) {
  const cell = cells.value.find(cell => cell.id === cellId)
  if (cell) {
    cell.image = ''
  }
}

// 添加新的长图格子
function addLongImageCell(imageUrl: string) {
  const currentCellCount = cells.value.length

  let newCell: GridCell

  if (longImageDirection.value === 'horizontal') {
    // 横向长图：向右添加，每个格子保持固定尺寸
    const cellWidth = 100 // 每个格子占100%宽度（在画布坐标系中）
    const cellHeight = 100 // 每个格子占100%高度

    newCell = {
      id: `cell-${Date.now()}-${currentCellCount}`,
      x: currentCellCount * cellWidth, // 新格子位置在右侧
      y: 0,
      width: cellWidth,
      height: cellHeight,
      borderRadius: 8,
      imageFit: 'cover' as ImageFitMode,
      image: imageUrl,
      title: '',
    }
  }
  else {
    // 纵向长图：向下添加，每个格子保持固定尺寸
    const cellWidth = 100 // 每个格子占100%宽度
    const cellHeight = 100 // 每个格子占100%高度（在画布坐标系中）

    newCell = {
      id: `cell-${Date.now()}-${currentCellCount}`,
      x: 0,
      y: currentCellCount * cellHeight, // 新格子位置在下方
      width: cellWidth,
      height: cellHeight,
      borderRadius: 8,
      imageFit: 'cover' as ImageFitMode,
      image: imageUrl,
      title: '',
    }
  }

  cells.value.push(newCell)
  selectedCellId.value = newCell.id
}

// 初始化长图模式
function initializeLongImage() {
  // 创建第一个空格子
  let cellWidth: number, cellHeight: number

  if (longImageDirection.value === 'horizontal') {
    // 横向长图：格子高度固定，宽度固定
    cellWidth = 100 // 占满宽度
    cellHeight = 100 // 占满高度
  }
  else {
    // 纵向长图：格子宽度固定，高度固定
    cellWidth = 100 // 占满宽度
    cellHeight = 100 // 占满高度
  }

  cells.value = [{
    id: `cell-${Date.now()}-0`,
    x: 0,
    y: 0,
    width: cellWidth,
    height: cellHeight,
    borderRadius: 8,
    imageFit: 'cover' as ImageFitMode,
    image: '',
    title: '',
  }]

  selectedCellId.value = cells.value[0]!.id
}

// 创建下一个长图格子（空格子）
function createNextLongImageCell() {
  const currentCellCount = cells.value.length

  let newCell: GridCell

  if (longImageDirection.value === 'horizontal') {
    // 横向长图：向右添加，每个格子保持固定尺寸
    const cellWidth = 100 // 每个格子占100%宽度（在画布坐标系中）
    const cellHeight = 100 // 每个格子占100%高度

    newCell = {
      id: `cell-${Date.now()}-${currentCellCount}`,
      x: currentCellCount * cellWidth, // 新格子位置在右侧
      y: 0,
      width: cellWidth,
      height: cellHeight,
      borderRadius: 8,
      imageFit: 'cover' as ImageFitMode,
      image: '',
      title: '',
    }
  }
  else {
    // 纵向长图：向下添加，每个格子保持固定尺寸
    const cellWidth = 100 // 每个格子占100%宽度
    const cellHeight = 100 // 每个格子占100%高度（在画布坐标系中）

    newCell = {
      id: `cell-${Date.now()}-${currentCellCount}`,
      x: 0,
      y: currentCellCount * cellHeight, // 新格子位置在下方
      width: cellWidth,
      height: cellHeight,
      borderRadius: 8,
      imageFit: 'cover' as ImageFitMode,
      image: '',
      title: '',
    }
  }

  cells.value.push(newCell)
  selectedCellId.value = newCell.id
}

// 处理长图模式的图片输入
async function handleLongImageInput(imageUrl: string) {
  // 找到第一个空格子（image为空字符串或undefined）
  const emptyCell = cells.value.find(cell => !cell.image || cell.image === '')

  if (emptyCell) {
    // 如果有空格子，直接填充
    emptyCell.image = imageUrl
    selectedCellId.value = emptyCell.id

    // 填充后，检查是否还有空格子，如果没有则创建一个新的空格子
    const hasEmptyCell = cells.value.some(cell => !cell.image || cell.image === '')
    if (!hasEmptyCell) {
      createNextLongImageCell()
    }
  }
  else {
    // 如果没有空格子，新增一个格子并填充图片
    addLongImageCell(imageUrl)
    // 添加新格子后，创建下一个空格子
    createNextLongImageCell()
  }
}

// 从长图模式切换到拼图模式时是否需要重置的标志
const needsResetFromLong = ref(false)

// 处理画布比例点击
function handleAspectRatioClick(option: AspectRatioOption) {
  selectedAspectRatio.value = option

  // 如果是从长图模式切换过来的，重置标志并重新初始化网格
  if (needsResetFromLong.value) {
    needsResetFromLong.value = false
    // 重置为默认模板
    if (templates.length > 0) {
      initializeGrid(templates[0] as GridTemplate)
    }
  }
  // 如果是在拼图模式下切换比例，也需要重新初始化网格以适应新的画布尺寸
  else if (currentWorkMode.value === 'puzzle') {
    // 保存当前选中的模板（如果有的话）
    const currentTemplate = templates.find(template =>
      template.cells.length === cells.value.length
      && template.cells.every((templateCell, index) => {
        const cell = cells.value[index]
        return cell
          && Math.abs(templateCell.x - cell.x) < 0.01
          && Math.abs(templateCell.y - cell.y) < 0.01
          && Math.abs(templateCell.width - cell.width) < 0.01
          && Math.abs(templateCell.height - cell.height) < 0.01
      }),
    )

    // 如果找到了匹配的模板，重新初始化；否则使用默认模板
    const templateToUse = currentTemplate || (templates.length > 0 ? templates[0] : null)
    if (templateToUse) {
      initializeGrid(templateToUse as GridTemplate)
    }
  }
}

// 处理模板点击
function handleTemplateClick(template: GridTemplate) {
  initializeGrid(template)

  // 如果是从长图模式切换过来的，重置标志
  if (needsResetFromLong.value) {
    needsResetFromLong.value = false
  }
}

// 监听工作模式变化
watch(currentWorkMode, (newMode, oldMode) => {
  if (newMode === 'long' && oldMode !== 'long') {
    // 切换到长图模式时，初始化长图布局
    initializeLongImage()
  }
  else if (oldMode === 'long' && newMode === 'puzzle') {
    // 从长图模式切换到拼图模式时，标记需要重置
    needsResetFromLong.value = true
  }
})

// 监听长图方向变化
watch(longImageDirection, (newDirection, oldDirection) => {
  if (currentWorkMode.value === 'long' && newDirection !== oldDirection) {
    // 长图模式下切换方向时，重新初始化布局
    initializeLongImage()
  }
})

// 图片分割功能
async function splitImageToGrid(imageUrl: string) {
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

// 处理图片输入（支持分割模式和长图模式）
async function handleImageInput(imageUrl: string) {
  console.log('imageUrl', imageUrl)
  if (currentWorkMode.value === 'split') {
    // 分图模式：自动分割图片到所有格子
    await splitImageToGrid(imageUrl)
  }
  else if (currentWorkMode.value === 'long') {
    // 长图模式：添加图片到长图序列
    await handleLongImageInput(imageUrl)
  }
  else {
    // 拼图模式：如果是从长图模式切换过来且用户还没有点击画布比例或模板，则重置布局
    if (needsResetFromLong.value) {
      // 重置为默认模板
      if (templates.length > 0) {
        initializeGrid(templates[0] as GridTemplate)
      }
      needsResetFromLong.value = false
    }

    // 优先放到选中的格子，如果没有选中则放到第一个空格子，如果没有空格子则放到第一个格子
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
async function handlePasteFromClipboard() {
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
function handleKeyDown(e: KeyboardEvent) {
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
function handlePaste(e: ClipboardEvent) {
  e.preventDefault()
  handlePasteFromClipboard()
}

// 当前使用的模板
// const currentTemplate = ref<GridTemplate | null>(null)

// 初始化网格
function initializeGrid(template: GridTemplate) {
  cells.value = template.cells.map((cell, index) => ({
    ...cell,
    id: `cell-${Date.now()}-${index}`,
    image: '',
    title: '',
  }))
  selectedCellId.value = cells.value[0]?.id || ''
}

// 选择格子
function selectCell(cellId: string) {
  selectedCellId.value = cellId
  showSplitMenu.value = false
}

// 显示分割菜单
function showSplitMenuAt(event: MouseEvent, cellId: string) {
  event.preventDefault()

  // 长图模式下不显示右键菜单
  if (currentWorkMode.value === 'long') {
    return
  }

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
function splitCell(cellId: string, splitType: SplitType = 'horizontal') {
  // 长图模式下不允许分割格子
  if (currentWorkMode.value === 'long') {
    return
  }

  // 如果是从长图模式切换过来且用户还没有点击画布比例或模板，则重置布局
  if (needsResetFromLong.value) {
    // 重置为默认模板
    if (templates.length > 0) {
      initializeGrid(templates[0] as GridTemplate)
    }
    needsResetFromLong.value = false
    // 重新获取cellId，因为布局已经重置
    cellId = cells.value[0]?.id || ''
  }

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
function deleteCell(cellId: string) {
  // 长图模式下不允许删除格子
  if (currentWorkMode.value === 'long') {
    return
  }

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

// 向右扩展格子
function expandCellRight(cellId: string) {
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
function expandCellLeft(cellId: string) {
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
function expandCellDown(cellId: string) {
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
function expandCellUp(cellId: string) {
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
function updateCellTitle(cellId: string, title: string) {
  const cell = cells.value.find(cell => cell.id === cellId)
  if (cell) {
    cell.title = title
  }
}

// 更新全局圆角
function updateGlobalBorderRadius(borderRadius: number) {
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
function updateImageFit(cellId: string, imageFit: ImageFitMode) {
  const cell = cells.value.find(cell => cell.id === cellId)
  if (cell) {
    cell.imageFit = imageFit
  }
}

// 上传图片
async function handleImageUpload(cellId: string, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    const imageUrl = URL.createObjectURL(file)

    if (currentWorkMode.value === 'split') {
      // 分图模式：自动分割图片到所有格子
      await splitImageToGrid(imageUrl)
    }
    else if (currentWorkMode.value === 'long') {
      // 长图模式：使用长图处理逻辑
      await handleLongImageInput(imageUrl)
    }
    else {
      // 拼图模式：放到指定格子
      const cell = cells.value.find(cell => cell.id === cellId)
      if (cell) {
        cell.image = imageUrl
      }
    }

    // 清空input的value，确保下次选择同一文件时也能触发change事件
    input.value = ''
  }
}

// 处理拖拽
function handleDragOver(event: DragEvent) {
  event.preventDefault()
}

async function handleDrop(event: DragEvent, cellId: string) {
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

// 计算单个格子的固定尺寸（长图模式专用）
const fixedCellSize = computed(() => {
  if (!containerRef.value || currentWorkMode.value !== 'long') {
    return { width: 300, height: 300 }
  }

  const containerRect = containerRef.value.getBoundingClientRect()
  const containerWidth = containerRect.width - 32 // 减去padding
  const containerHeight = containerRect.height - 80 // 减去标题和padding

  // 长图模式下使用用户选择的比例
  const targetRatio = selectedAspectRatio.value.ratio

  // 计算单个格子的固定尺寸（基于用户选择的比例）
  let cellWidth: number, cellHeight: number

  if (longImageDirection.value === 'horizontal') {
    // 横向长图：每个格子的高度固定，宽度按比例计算
    cellHeight = containerHeight * 0.9
    cellWidth = cellHeight * targetRatio

    // 确保格子宽度不超过容器宽度的90%
    if (cellWidth > containerWidth * 0.9) {
      cellWidth = containerWidth * 0.9
      cellHeight = cellWidth / targetRatio
    }
  }
  else {
    // 纵向长图：每个格子的宽度固定，高度按比例计算
    cellWidth = containerWidth * 0.9
    cellHeight = cellWidth / targetRatio

    // 确保格子高度不超过容器高度的90%
    if (cellHeight > containerHeight * 0.9) {
      cellHeight = containerHeight * 0.9
      cellWidth = cellHeight * targetRatio
    }
  }

  return {
    width: Math.floor(cellWidth),
    height: Math.floor(cellHeight),
  }
})

// 计算画布尺寸（基于宽高比）
const canvasDimensions = computed(() => {
  if (!containerRef.value) {
    return { width: 600, height: 600 }
  }

  const containerRect = containerRef.value.getBoundingClientRect()
  const containerWidth = containerRect.width - 32 // 减去padding
  const containerHeight = containerRect.height - 80 // 减去标题和padding

  // 长图模式下的特殊处理
  if (currentWorkMode.value === 'long') {
    // 使用固定的格子尺寸和格子数量来计算画布尺寸
    const cellCount = Math.max(1, cells.value.length) // 至少显示一个格子
    const cellSize = fixedCellSize.value

    if (longImageDirection.value === 'horizontal') {
      // 横向长图：格子尺寸固定，画布宽度根据所有格子数量扩展
      return {
        width: cellSize.width * cellCount,
        height: cellSize.height,
      }
    }
    else {
      // 纵向长图：格子尺寸固定，画布高度根据所有格子数量扩展
      return {
        width: cellSize.width,
        height: cellSize.height * cellCount,
      }
    }
  }

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
async function exportCanvas() {
  if (!canvasRef.value)
    return

  try {
    // 创建一个临时的 canvas 来绘制图片
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx)
      return

    // 为了确保导出尺寸与预览一致，在导出时重新计算尺寸
    let exportCanvasWidth: number, exportCanvasHeight: number
    let exportCellSize: { width: number, height: number }

    if (currentWorkMode.value === 'long') {
      // 长图模式：使用固定的基准尺寸来计算，避免依赖容器实时尺寸
      const targetRatio = selectedAspectRatio.value.ratio
      const baseDimension = 800 // 使用固定的基准尺寸

      if (longImageDirection.value === 'horizontal') {
        const cellHeight = baseDimension
        const cellWidth = cellHeight * targetRatio
        exportCellSize = { width: Math.floor(cellWidth), height: Math.floor(cellHeight) }

        // 只计算有图片的格子数量，避免包含空格子
        const cellCount = Math.max(1, cells.value.filter(cell => cell.image && cell.image.trim() !== '').length)
        exportCanvasWidth = exportCellSize.width * cellCount
        exportCanvasHeight = exportCellSize.height
      }
      else {
        const cellWidth = baseDimension
        const cellHeight = cellWidth / targetRatio
        exportCellSize = { width: Math.floor(cellWidth), height: Math.floor(cellHeight) }

        // 只计算有图片的格子数量，避免包含空格子
        const cellCount = Math.max(1, cells.value.filter(cell => cell.image && cell.image.trim() !== '').length)
        exportCanvasWidth = exportCellSize.width
        exportCanvasHeight = exportCellSize.height * cellCount
      }
    }
    else {
      // 拼图模式：使用固定的基准尺寸来计算，确保导出与预览一致
      const targetRatio = selectedAspectRatio.value.ratio
      const baseDimension = 800 // 使用固定的基准尺寸

      if (targetRatio >= 1) {
        // 横向或正方形：以宽度为基准
        exportCanvasWidth = baseDimension
        exportCanvasHeight = baseDimension / targetRatio
      }
      else {
        // 纵向：以高度为基准
        exportCanvasHeight = baseDimension
        exportCanvasWidth = baseDimension * targetRatio
      }

      exportCellSize = { width: 0, height: 0 } // 拼图模式不需要
    }

    canvas.width = exportCanvasWidth
    canvas.height = exportCanvasHeight

    // 不填充背景色，保持画布透明

    // 绘制每个格子
    const cellsWithImages = cells.value.filter(cell => cell.image && cell.image.trim() !== '')
    const drawPromises = cellsWithImages.map(async (cell, index) => {
      let cellX: number, cellY: number, cellWidth: number, cellHeight: number

      if (currentWorkMode.value === 'long') {
        // 长图模式：使用导出时计算的固定像素值
        cellWidth = exportCellSize.width
        cellHeight = exportCellSize.height

        if (longImageDirection.value === 'horizontal') {
          cellX = index * cellWidth
          cellY = 0
        }
        else {
          cellX = 0
          cellY = index * cellHeight
        }
      }
      else {
        // 拼图模式：使用百分比计算
        cellX = (cell.x / 100) * canvas.width
        cellY = (cell.y / 100) * canvas.height
        cellWidth = (cell.width / 100) * canvas.width
        cellHeight = (cell.height / 100) * canvas.height
      }

      // 导出时需要应用与页面相同的padding效果，保持视觉一致
      const padding = globalGap.value

      // 当间距为0时，直接使用0作为padding；否则进行安全计算
      let safePadding = 0
      if (padding > 0) {
        // 限制padding不能超过格子尺寸的一半，避免内容区域过小
        const maxPadding = Math.min(padding, Math.min(cellWidth, cellHeight) / 2 - 1)
        safePadding = Math.max(0, maxPadding)
      }

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
              const minDimension = Math.min(contentWidth, contentHeight)
              // 限制圆角半径不超过短边的一半，与CSS表现一致
              const radius = Math.min(cell.borderRadius, minDimension / 2)
              const isSquare = Math.abs(contentWidth - contentHeight) <= 2 // 允许2像素的误差

              ctx.beginPath()

              // 只有正方形且圆角值大于等于最小尺寸的一半时，才绘制完美圆形
              if (isSquare && radius >= minDimension / 2) {
                const centerX = contentX + contentWidth / 2
                const centerY = contentY + contentHeight / 2
                const circleRadius = minDimension / 2
                ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2)
              }
              else {
                // 使用 arcTo 方法绘制圆角矩形
                ctx.moveTo(contentX + radius, contentY)
                ctx.arcTo(contentX + contentWidth, contentY, contentX + contentWidth, contentY + radius, radius)
                ctx.arcTo(contentX + contentWidth, contentY + contentHeight, contentX + contentWidth - radius, contentY + contentHeight, radius)
                ctx.arcTo(contentX, contentY + contentHeight, contentX, contentY + contentHeight - radius, radius)
                ctx.arcTo(contentX, contentY, contentX + radius, contentY, radius)
              }

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
  <div class="h-screen bg-bg-paper font-cartoon p-4 md:p-6">
    <div class="h-[calc(100vh-0px)] md:h-[calc(100vh-0px)] grid grid-cols-5 gap-4 md:gap-6">
      <!-- 左侧控制面板 -->
      <div class="col-span-1 space-y-3 md:space-y-4 overflow-y-auto">
        <!-- 比例选择 -->
        <div class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-3 md:p-4">
          <h3 class="text-xs md:text-sm font-pixel text-bg-base mb-2 md:mb-3 flex items-center gap-2">
            <div class="w-2 h-2 bg-primary-600 rounded-sm" />
            {{ currentWorkMode === 'long' ? '格子比例' : '画布比例' }} （{{ canvasDimensions.width }}×{{ canvasDimensions.height }}px）
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="option in aspectRatioOptions"
              :key="option.name"
              class="flex flex-col items-center p-2 text-xs font-cartoon font-bold rounded-lg border-2 transition-all duration-200"
              :class="[
                selectedAspectRatio.name === option.name
                  ? 'bg-primary-600 text-white border-bg-base shadow-pixel'
                  : 'bg-white text-bg-base border-bg-base hover:bg-secondary-500 hover:text-bg-base hover:scale-105',
              ]"
              @click="handleAspectRatioClick(option)"
            >
              <div class="font-bold">
                {{ option.name }}
              </div>
            </button>
          </div>
        </div>

        <!-- 模板选择 -->
        <div v-if="currentWorkMode !== 'long'" class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-3 md:p-4">
          <h3 class="text-xs md:text-sm font-pixel text-bg-base mb-2 md:mb-3 flex items-center gap-2">
            <div class="w-2 h-2 bg-secondary-500 rounded-sm" />
            模板选择
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="template in templates"
              :key="template.name"
              class="flex flex-col items-center p-2 text-xs font-cartoon rounded-lg border-2 border-bg-base hover:bg-secondary-500 hover:scale-105 transition-all duration-200 group bg-white"
              @click="handleTemplateClick(template)"
            >
              <!-- 模板图标 -->
              <div class="w-12 h-12 mb-2 relative bg-gray-100 rounded-lg border-2 border-bg-base">
                <div
                  v-for="cell in template.cells"
                  :key="`${cell.x}-${cell.y}`"
                  class="absolute bg-primary-600 group-hover:bg-accent-400 transition-colors rounded-sm"
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
            </button>
          </div>
        </div>

        <!-- 格子设置 -->
        <div v-if="selectedCell" class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-3 md:p-4">
          <h3 class="text-xs md:text-sm font-pixel text-bg-base mb-2 md:mb-3 flex items-center gap-2">
            <div class="w-2 h-2 bg-accent-400 rounded-sm" />
            格子设置
          </h3>

          <!-- 标题输入 -->
          <div class="mb-3">
            <label class="block text-xs font-cartoon font-bold mb-1 text-bg-base">图片说明</label>
            <input
              :value="selectedCell.title"
              type="text"
              placeholder="输入图片说明..."
              class="w-full px-2 py-1 text-xs font-cartoon border-2 border-bg-base rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
              @input="updateCellTitle(selectedCell.id, ($event.target as HTMLInputElement).value)"
            >
          </div>

          <!-- 图片适配模式 -->
          <div v-if="selectedCell.image" class="mb-3">
            <label class="block text-xs font-cartoon font-bold mb-1 text-bg-base">适配模式</label>
            <select
              :value="selectedCell.imageFit"
              class="w-full px-2 py-1 text-xs font-cartoon border-2 border-bg-base rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
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
            <label class="block text-xs font-cartoon font-bold mb-1 text-bg-base">上传图片</label>
            <input
              type="file"
              accept="image/*"
              class="w-full text-xs text-gray-600 font-cartoon file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-2 file:border-bg-base file:text-xs file:bg-secondary-500 file:text-bg-base file:font-cartoon file:font-bold file:hover:bg-primary-600 file:transition-colors"
              @change="handleImageUpload(selectedCell.id, $event)"
            >
          </div>
        </div>

        <!-- 全局设置 -->
        <div class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-3 md:p-4">
          <h3 class="text-xs md:text-sm font-pixel text-bg-base mb-2 md:mb-3 flex items-center gap-2">
            <div class="w-2 h-2 bg-primary-600 rounded-sm" />
            全局设置
          </h3>

          <!-- 间距调整 -->
          <div class="mb-3">
            <label class="block text-xs font-cartoon font-bold mb-1 text-bg-base">
              格子间距: {{ globalGap }}px
            </label>
            <input
              v-model="globalGap"
              type="range"
              min="0"
              max="20"
              step="1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            >
          </div>

          <!-- 全局圆角设置 -->
          <div class="mb-3">
            <div class="flex items-center mb-2">
              <input
                id="globalBorderRadius"
                v-model="isGlobalBorderRadius"
                type="checkbox"
                class="mr-2 w-4 h-4 text-primary-600 bg-gray-100 border-2 border-bg-base rounded focus:ring-primary-600 focus:ring-2"
              >
              <label for="globalBorderRadius" class="text-xs font-cartoon font-bold text-bg-base">
                全局圆角: {{ globalBorderRadius }}px
              </label>
            </div>
            <input
              v-model="globalBorderRadius"
              type="range"
              min="0"
              :max="maxBorderRadius"
              step="1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              @input="updateGlobalBorderRadius(Number(($event.target as HTMLInputElement).value))"
            >
            <div class="text-xs text-gray-600 mt-1 font-cartoon">
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
              <div class="flex items-center gap-3">
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

                <!-- 长图方向选择 -->
                <div v-if="currentWorkMode === 'long'" class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    class="px-2 py-1 text-xs rounded transition-colors"
                    :class="[
                      longImageDirection === 'vertical'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900',
                    ]"
                    @click="longImageDirection = 'vertical'"
                  >
                    纵向
                  </button>
                  <button
                    class="px-2 py-1 text-xs rounded transition-colors"
                    :class="[
                      longImageDirection === 'horizontal'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900',
                    ]"
                    @click="longImageDirection = 'horizontal'"
                  >
                    横向
                  </button>
                </div>
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
              class="bg-gray-100 rounded-lg relative shadow-lg"
              :class="[
                currentWorkMode === 'long'
                  ? (longImageDirection === 'horizontal' ? 'overflow-x-auto overflow-y-hidden' : 'overflow-y-auto overflow-x-hidden')
                  : 'overflow-hidden',
              ]"
              :style="{
                width: `${canvasDimensions.width}px`,
                height: `${canvasDimensions.height}px`,
              }"
            >
              <!-- 格子容器 -->
              <div
                v-for="(cell, index) in cells"
                :key="cell.id"
                class="absolute cursor-pointer transition-all duration-200"
                :style="currentWorkMode === 'long' ? {
                  left: longImageDirection === 'horizontal' ? `${index * fixedCellSize.width}px` : '0px',
                  top: longImageDirection === 'vertical' ? `${index * fixedCellSize.height}px` : '0px',
                  width: `${fixedCellSize.width}px`,
                  height: `${fixedCellSize.height}px`,
                  padding: `${globalGap}px`,
                } : {
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
                  class="w-full h-full border-2 overflow-hidden relative transition-all duration-200" :class="[
                    selectedCellId === cell.id ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' : 'border-gray-300 hover:border-gray-400',
                  ]"
                  :style="{
                    borderRadius: `${cell.borderRadius}px`,
                  }"
                  @click="selectedCellId = cell.id"
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
