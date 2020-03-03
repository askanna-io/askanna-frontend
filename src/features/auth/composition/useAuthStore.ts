import { useActions } from '@u3u/vue-hooks'
import { authStoreName, ac } from '../store/types'

export default function() {
  const actions = {
    ...useActions(authStoreName, { ...ac })
  }

  return {
    ...actions
  }
}
