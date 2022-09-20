import VueRouter from 'vue-router'
import type { RawLocation } from 'vue-router'
import { useRoute, useRouter } from 'vue-router/composables'

const { isNavigationFailure, NavigationFailureType } = VueRouter

export default () => {
  const route = useRoute()
  const logger = useLogger()
  const router = useRouter()

  const push = (location: RawLocation) => {
    router.push(location).catch(failure => {
      if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
        logger.error(`Error on redirect to location: ${location}.\nError: `, failure)
      }
    })
  }

  const replace = (location: RawLocation) => {
    router.replace(location).catch(failure => {
      if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
        logger.error(`Error on redirect to location: ${location}.\nError: `, failure)
      }
    })
  }

  return { route, router, push, replace }
}
