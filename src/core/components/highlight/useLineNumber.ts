import { SetupContext } from '@vue/composition-api'

export default () => {
  const TABLE_NAME = 'hljs-ln'
  const LINE_NAME = 'hljs-ln-line'
  const CODE_BLOCK_NAME = 'hljs-ln-code'
  const NUMBERS_BLOCK_NAME = 'hljs-ln-numbers'
  const NUMBER_LINE_NAME = 'hljs-ln-n'
  const DATA_ATTR_NAME = 'data-line-number'
  const BREAK_LINE_REGEXP = /\r\n|\r|\n/g

  function getLines(text: string) {
    if (text.length === 0) return []
    return text.split(BREAK_LINE_REGEXP)
  }

  function addLineNumbersBlockFor(inputHtml: string, firstLineIndex: number) {
    const lines = getLines(inputHtml)
    if (!lines || !lines.length) return inputHtml

    // if last line contains only carriage return remove it
    if (lines[lines.length - 1].trim() === '') {
      lines.pop()
    }

    if (lines.length > firstLineIndex) {
      let html = ''
      lines.forEach((line, i) => {
        i += 1
        html += `
  <tr>
  <td class="${LINE_NAME} ${NUMBERS_BLOCK_NAME}" ${DATA_ATTR_NAME}="${i}">
  <div class="${NUMBER_LINE_NAME}" ${DATA_ATTR_NAME}="${i}"></div>
  </td>
  <td class="${LINE_NAME} ${CODE_BLOCK_NAME}" ${DATA_ATTR_NAME}="${i}">
  ${line}
  </td>
  </tr>`.replace(/\n/g, '')
      })

      return `<table class="${TABLE_NAME}">${html}</table>`
    }

    return inputHtml
  }

  function lineNumbersInternal(element: HTMLElement, options: Options) {
    // define options or set default
    options = {
      singleLine: false,
      ...options
    }

    // convert options
    const firstLineIndex = options.singleLine ? 0 : 1

    return addLineNumbersBlockFor(element.innerHTML, firstLineIndex)
  }

  interface Options {
    singleLine?: boolean
  }

  const lineNumbersValue = function (value: string, options: Options = {}) {
    const element = document.createElement('code')
    element.innerHTML = value

    return lineNumbersInternal(element, options)
  }
  return { lineNumbersValue }
}
