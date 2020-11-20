//@ts-nocheck
import { SetupContext } from '@vue/composition-api'
import useSnackBar from '@/core/components/snackBar/useSnackBar'

export default function (context: SetupContext) {
  const snackBar = useSnackBar()

  const handleCopyText = (text: string) => {
    context.root.$copyText(text).then(
      () => snackBar.showSnackBar({ message: 'Copied', color: 'success' }),
      () => snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
    )
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
