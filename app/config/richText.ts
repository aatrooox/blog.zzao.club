// 对元素有影响的属性
export const EffectCssAttrs = [
  // 'fontFamily',
  'fontSize',
  'fontWeight',
  'color',
  'textAlign',
  'lineHeight',
  'whiteSpace',
  'textSizeAdjust',
  'overflowX',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'borderBottom',
  'borderTop',
  'borderRight',
  'borderLeft',
  'borderColor',
  'border',
  'borderBottomWidth',
  'borderLeftWidth',
  'backgroundColor',
  'borderRadius',
]

// 全局属性，防止里面子元素重复取值或太长时存在性能问题
export const GlobCssAttrs = [
  'fontFamily',
]

// 代码中，只有颜色属性有用
export const PreCodeCssAttrs = [
  'color',
]

// 某些元素需要特殊的属性值
// 比如 h2 自定义了一个黑色小方块作为样式
export const customTagCssAttrs = {
  'h2-box': ['display', 'width', 'height'],
}

export const IMG_WRAP_CLASS = 'blog-zzao-club-img-component'

// 需要排除掉的元素的class
export const ExcludeClassList = ['copy-button']

export function camelCaseToHyphen(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
// 获取所有article下的子元素
// 循环遍历, 获取每个元素的computedStyle, 提取effectCssAttr对应的css, 组合为对象
// 缓存刚才的css对象, key为[tag+class], 如果有子元素, 继续递归子元素
// 如果有完全相同的class, 则不再获取computedStyle, 直接使用缓存中的css对象
// 如果class不同, 则获取computedStyle, 组合为对象, 缓存

// <section data-tool="mdx editor" data-website="https://editor.runjs.cool/" class="oneLight"><section data-tool="mdx 编辑器" data-website="https://editor.runjs.cool/" class="markdown-body" components="[object Object]" style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue',
//     'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei',
//     Arial, sans-serif; word-break: break-word; line-height: 1.7; font-weight: 400; font-size: 16px; overflow-x: hidden; color: #212122;"><p data-line="2" style="font-size: 16px; text-align: start; white-space: normal; text-size-adjust: auto; line-height: 2; margin-top: 16px; margin-bottom: 16px;"><strong data-line="2">搞严重。</strong></p>
// <blockquote data-line="4" style="color: #777777; padding: 1px 16px; margin: 24px 0; border-left: 4px solid #c6c4c4; background-color: #f1f1f1; transition: all 0.3s ease-out; border-radius: 4px;">
// <p data-line="4" style="font-size: 16px; text-align: start; white-space: normal; text-size-adjust: auto; line-height: 2; margin-top: 16px; margin-bottom: 16px; margin: 10px 0;">1231231</p>
// <span style="display: block;"></span></blockquote>
// <p data-line="6" style="font-size: 16px; text-align: start; white-space: normal; text-size-adjust: auto; line-height: 2; margin-top: 16px; margin-bottom: 16px;">在别人<code data-line="6" style="font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; word-break: break-word; border-radius: 2px; overflow-x: auto; background-color: #f1f1f1; color: #ef7060; font-size: 14px; padding: 0.065em 6px; max-width: unset;">的框</code></p>
// <h1 data-line="8" style="line-height: 1.5; margin-bottom: 8px; padding-bottom: 8px; font-size: 18px; padding: 5px 10px; text-align: center; width: fit-content; font-weight: 800; border-bottom: 3px solid #212122; margin: 40px auto;">先有文章再有博客</h1></section></section>
