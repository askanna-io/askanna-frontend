import { toRefs, reactive } from '@vue/composition-api'

export default function() {
  let state = reactive({
    open: false,
    message: '',
    timeout: 6000
  })

  function setSnackBar(params: any) {
    console.log('setSnackBar')
    let { timeout, message = '' } = params

    if (!timeout) {
      timeout = message.length * 200
    }
    state.open = true
    state.message = message
    state.timeout = timeout
  }

  function closeSnackBar() {
    state.open = false
  }

  return {
    ...toRefs(state),
    setSnackBar,
    closeSnackBar
  }
}
