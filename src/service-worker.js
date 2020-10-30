self.addEventListener('message', event => {
  console.log('serwice worker ')
  if (event.data === 'sw:update') self.skipWaiting()
})

// The precaching code provided by Workbox.
self.__precacheManifest = [].concat(self.__precacheManifest || [])
// workbox.precaching.suppressWarnings(); // Only used with Vue CLI 3 and Workbox v3.
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})
