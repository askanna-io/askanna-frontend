//@ts-nocheck
import VueRouter from 'vue-router'
import type { RawLocation } from 'vue-router'
import { logger } from '@/core/plugins/logger'
import { SetupContext } from '@vue/composition-api'
const { isNavigationFailure, NavigationFailureType } = VueRouter
export default function (context: SetupContext) {
  const push = (location: RawLocation) => {
    context.root.$router.push(location).catch(failure => {
      if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
        logger.error(context.root.$store.commit, `Error on redirect to location: ${location}.\nError: `, failure)
      }
    })
  }

  return { push }
}
