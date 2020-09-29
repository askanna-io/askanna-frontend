export default function () {
  const trigger = ({ url = '', name = '' }) => {
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', name)
    document.body.appendChild(link)
    link.click()
  }

  return { trigger }
}
