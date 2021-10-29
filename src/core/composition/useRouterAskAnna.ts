//@ts-nocheck
import VueRouter from 'vue-router'
import type { RawLocation } from 'vue-router'
import { logger } from '@/core/plugins/logger'
import { useStore, useRouter } from '@u3u/vue-hooks'
const { isNavigationFailure, NavigationFailureType } = VueRouter
export default () => {
  const store = useStore()
  const { router } = useRouter()

  const push = (location: RawLocation) => {
    router.push(location).catch(failure => {
      if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
        logger.error(store.value.commit, `Error on redirect to location: ${location}.\nError: `, failure)
      }
    })
  }

  return { push }
}
