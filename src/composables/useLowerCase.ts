export default () => (text: string) => {
    if (!text) return ''
    const value = text.toString()

    return value.charAt(0).toLowerCase() + value.slice(1)
}
