/**
 * 转义 HTML 字符
 * @param source
 */
export function encodeHTML(source: string) {
  return source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * 判断是否为代码块
 * @param text
 */
export function includeCode(text: string | null | undefined) {
  const regexp = /^(?:\s{4}|\t).+/gm
  return !!(text?.includes(' = ') || text?.match(regexp))
}

/**
 * 复制文本
 * @param options
 */
export function copyTextFromClipboard(options: { text: string; origin?: boolean }) {
  const props = { origin: true, ...options }
  const input = props.origin ? document.createElement('textarea') : document.createElement('input')

  input.setAttribute('readonly', 'readonly')
  input.value = props.text
  document.body.appendChild(input)

  // 执行复制操作
  input.select()
  document.execCommand('copy')

  // 清理
  if (document.body.contains(input))
    document.body.removeChild(input)
}

/**
 * 复制文本
 * @param options
 */
export async function copyText(options: { text: string; origin?: boolean }) {
  try {
    await navigator.clipboard.writeText(options.text)
    console.log('复制成功')
  }
  catch (err) {
    console.error('Error in copying text:', err)
  }
}
