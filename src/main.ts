import './style.css'
import './main.scss'
import App from './App.vue'
import { createApp } from 'vue'
import router from './router/index'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'
import vuetify from './plugins/vuetify'
import { BrowserTracing } from '@sentry/browser'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const app = createApp(App)

if (import.meta.env.VITE_APP_SENTRY_URL) {
  const rate: number = parseFloat(
    <string>import.meta.env.VITE_APP_SENTRY_TRACES_RATE || '0'
  )

  Sentry.init({
    app,
    ignoreErrors: [
      'Non-Error exception captured',
      'Non-Error promise rejection captured'
    ],
    dsn: import.meta.env.VITE_APP_SENTRY_URL,
    environment: import.meta.env.VITE_APP_SENTRY_ENV,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router)
      })
    ],
    tracesSampleRate: rate
  })
}

const pinia = createPinia()

//check if the current user is authenticated
const notAllowedRouteWithToken = ['signin', 'signup', 'join', 'account/reset-password', 'forgot-password']

router.beforeEach((to, previous, next) => {
  if (
    to.path !== '/' &&
    (to?.path === next?.path || to?.path === previous?.path) &&
    Object.is(to?.query, previous?.query)
  )
    return false
  if (to.name === previous.name && to.hash) return false

  const token = window.localStorage.getItem('token')
  const isRouteRequiresAuth = to.matched.some(
    (route) => route.meta.requiresAuth
  )
  const isRouteNotAllowedWithToken = notAllowedRouteWithToken.some(
    (route) => route === to.name
  )

  if (isRouteRequiresAuth && !token && !isRouteNotAllowedWithToken) {
    const name = previous.name === 'workspaces' ? 'workspaces' : 'projects'
    next({
      name
    })
  } else if (token && isRouteNotAllowedWithToken) {
    next('/')
  } else {
    next()
  }
})

router.afterEach((to) => {
  const token = window.localStorage.getItem('token')
  const isNotAllowedToBack = notAllowedRouteWithToken.some(
    (route) => route === to?.name
  )

  if (!token && !isNotAllowedToBack) {
    window.localStorage.setItem('back_after_login', window.location.pathname)
  }
})

const intervalMS = 60 * 3 * 1000

useRegisterSW({
  onRegisteredSW(swUrl, r) {
    r && setInterval(async () => {
      if (!(!r.installing && navigator))
        return

      if (('connection' in navigator) && !navigator.onLine)
        return

      const resp = await fetch(swUrl, {
        cache: 'no-store',
        headers: {
          'cache': 'no-store',
          'cache-control': 'no-cache',
        },
      })

      if (resp?.status === 200)
        await r.update()
    }, intervalMS)
  }
})

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
