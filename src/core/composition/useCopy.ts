//@ts-nocheck
import { useSnackBar } from '@/core/components/snackBar/useSnackBar'

export default () => {
  const snackBar = useSnackBar()

  const handleCopyText = (text: string) => {
    const el = document.createElement('textarea')
    el.addEventListener('focusin', e => e.stopPropagation())
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    snackBar.showSnackBar({ message: 'Copied', color: 'success' })
  }

  const handleCopyTextById = (id: string) => {
    const input = document.getElementById(id) as HTMLInputElement
    input.select()
    document.execCommand('copy')
    if (input) {
      snackBar.showSnackBar({ message: 'Copied', color: 'success' })
      return
    }
    snackBar.showSnackBar({ message: 'Copied', color: 'success' })
  }

  const handleCopyElementBySource = async (fileSource: Blob) => {
    const img = new Image()
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')

    function setCanvasImage(func) {
      img.onload = function () {
        c.width = this.naturalWidth
        c.height = this.naturalHeight
        ctx.drawImage(this, 0, 0)
        c.toBlob(blob => {
          func(blob)
        }, 'image/png')
      }

      const urlCreator = window.URL || window.webkitURL
      const imgSrc = urlCreator.createObjectURL(fileSource)
      img.src = imgSrc
    }

    setCanvasImage(imgBlob => {
      navigator.clipboard
        .write([
          new ClipboardItem({
            [imgBlob.type]: imgBlob
          })
        ])
        .then(() => {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        })
        .catch(e => {
          snackBar.showSnackBar({ message: `Not Copied, ${e.name}: ${e.message}`, color: 'error' })
        })
    })
  }

  return { handleCopyText, handleCopyTextById, handleCopyElementBySource }
}
