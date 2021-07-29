//@ts-nocheck
import useSnackBar from '@/core/components/snackBar/useSnackBar'

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

  return { handleCopyText, handleCopyTextById }
}
