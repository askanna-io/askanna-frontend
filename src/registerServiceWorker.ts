/* eslint-disable*/

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' + 'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered(registration) {
      console.log('Service worker has been registered.')
      // Routinely check for app updates by testing for a new service worker.
      setInterval(() => {
        console.log('update')
        registration.update()
      }, 10000) // hourly checks
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated(registration) {
      console.log('New content is available; please refresh.')

      // Add a custom event and dispatch it.
      // Used to display of a 'refresh' banner following a service worker update.
      // Set the event payload to the service worker registration object.
      document.dispatchEvent(new CustomEvent('swUpdated', { detail: registration }))
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })

  // Refresh all open app tabs when a new service worker is installed.
  var refreshing: boolean

  navigator.serviceWorker.addEventListener('controllerchange', function () {
    console.log('controllerchange')
    if (refreshing) return

    window.location.reload()

    refreshing = true
  })
}
