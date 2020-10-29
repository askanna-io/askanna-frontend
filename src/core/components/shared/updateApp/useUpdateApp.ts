// @ts-nocheck
import { toRefs, reactive } from '@vue/composition-api'

export default function () {
  const state = reactive({
    refreshing: false,
    registration: null,
    snackBtnText: '',
    snackWithBtnText: '',
    snackWithButtons: false
  })

  const showRefreshUI = e => {
    // Display a snackbar inviting the user to refresh/reload the app due
    // to an app update being available.
    // The new service worker is installed, but not yet active.
    // Store the ServiceWorkerRegistration instance for later use.
    state.registration = e.detail
    state.snackBtnText = 'Refresh'
    state.snackWithBtnText = 'New version available!'
    state.snackWithButtons = true
  }

  const refreshApp = () => {
    state.snackWithButtons = false
    // Protect against missing registration.waiting.
    if (state.registration || !state.registration.waiting) return
    state.registration.waiting.postMessage('skipWaiting')
  }

  // Listen for swUpdated event and display refresh snackbar as required.
  document.addEventListener('swUpdated', showRefreshUI, { once: true })
  // Refresh all open app tabs when a new service worker is installed.
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (state.refreshing) return
      state.refreshing = true
      window.location.reload()
    })
  }

  return {
    refreshApp,
    ...toRefs(state)
  }
}
