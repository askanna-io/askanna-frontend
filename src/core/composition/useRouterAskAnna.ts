//@ts-nocheck
import VueRouter from 'vue-router'
import { useRouter } from '@u3u/vue-hooks'
import type { RawLocation } from 'vue-router'
import { useLogger } from '@/core/composition/useLogger'

const { isNavigationFailure, NavigationFailureType } = VueRouter

export default () => {
  const logger = useLogger()
  const { route, router } = useRouter()

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
