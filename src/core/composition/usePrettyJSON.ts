// function to pretty json string
// keep float number to correct format, 50.0 => 50.0
const endFloat = '~AskAnna~float~end~'
const beginFloat = '~AskAnna~float~start~'

const REG_FLOAT = /[+,-]?\d*\.[0]*\s*\,/gm
const REG_FLOA_DECODE = new RegExp(`"${beginFloat}(.+?)${endFloat}"`, 'g')

export default () => (jsonString: string, space: number) => {
  if (!jsonString) return ''

  // find float number with one deciaml 0 and replace it to special string
  const replacement = (match: string) => `"${beginFloat}${match.slice(0, -1)}${endFloat}",`

  const markedJson = jsonString.replaceAll(REG_FLOAT, replacement)
  let prettyJson = jsonString
  try {
    prettyJson = JSON.stringify(JSON.parse(markedJson), null, space)
  } catch {
    return { prettyJson, isValidJSON: false }
  }

  // find special marked string and back it to float number with one decimal
  const regexReplacer = (_: string, num: any) => (num.includes('.') || Number.isNaN(num) ? num : `${num}.0`)

  return { prettyJson: prettyJson.replace(REG_FLOA_DECODE, regexReplacer), isValidJSON: true }
}
