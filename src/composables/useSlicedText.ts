export default () => (text: string, maxLength: number, suffix: string = '...') =>
  text && text.length > maxLength ? `${text.slice(0, maxLength)}${suffix}` : text
