// @ts-nocheck
import { toRefs, ref, reactive } from '@vue/composition-api'

export default function () {
  const state = reactive({
    refreshing: false,
    snackWithButtons: false
  })
  const registration = ref(null)

  const showRefreshUI = e => {
    // Display a snackbar inviting the user to refresh/reload the app due
    // to an app update being available.
    // The new service worker is installed, but not yet active.
    registration.value = e.detail
    state.snackWithButtons = true
  }

  const refreshApp = () => {
    // Protect against missing registration.waiting.
    if (!registration.value) return
    registration.value.postMessage('skipWaiting')
    window.location.reload()
    state.snackWithButtons = false
  }

  // Listen for swUpdated event and display refresh snackbar as required.
  document.addEventListener('swUpdated', showRefreshUI, { once: true })

  return {
    refreshApp,
    ...toRefs(state)
  }
}
