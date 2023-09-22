import type { RouteLocationRaw } from 'vue-router'
import { useRoute, useRouter, isNavigationFailure, NavigationFailureType } from 'vue-router'

export default () => {
  const route = useRoute()
  const logger = useLogger()
  const router = useRouter()

  const routerPush = (location: RouteLocationRaw) => {
    router.push(location).catch(failure => {
      if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
        logger.error(`Error on redirect to location: ${location}.\nError: `, failure)
      }
    })
  }

  const replace = (location: RouteLocationRaw) => {
    router.replace(location).catch(failure => {
      if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
        logger.error(`Error on redirect to location: ${location}.\nError: `, failure)
      }
    })
  }

  return { route, router, routerPush, replace }
}
