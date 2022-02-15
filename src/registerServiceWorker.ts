/* eslint-disable*/

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(`${process.env.BASE_URL}service-worker.js`).then(function (reg) {
        reg.onupdatefound = function () {
          const newSW = reg.installing

          if (!newSW) return

          newSW.onstatechange = function () {
            if (newSW.state === 'installed') {
              if (reg.active) {
                document.dispatchEvent(new CustomEvent('swUpdated', { detail: newSW }))
              }
            }
          }
        }
      })
    })

    // refrech all open tabs
    var refreshing: boolean

    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return

      window.location.reload()

      refreshing = true
    })
  }
}
