export default function() {
  const trigger = ({ source = '', name = '' }) => {
    const url = window.URL.createObjectURL(new Blob([source]))
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', `${name}`)
    document.body.appendChild(link)
    link.click()
  }

  return { trigger }
}
