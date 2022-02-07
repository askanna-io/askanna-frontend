import { get } from 'lodash'
import { useRouter } from '@u3u/vue-hooks'
import { computed } from '@vue/composition-api'
import useGeneralStore from '@/core/store/general/useGeneralStore'

export default function ({ start = 0, end = undefined }) {
  const { route: crcRoute } = useRouter()
  const generalStore = useGeneralStore()

  const getBreadcrumbs = computed(() => {
    let breadcrumbs: any = []

    let isReachCurrent = false

    breadcrumbs = crcRoute.value.matched
      .filter(route => route.meta.breadcrumb)
      .slice(start, end)
      .map(route => {
        if (isReachCurrent) return
        isReachCurrent = crcRoute.value.name === route.name

        let path = route.path
        let title = route.meta.breadcrumb
        Object.entries(crcRoute.value.params).forEach(([key, value]) => {
          path = path.replace(`:${key}`, value)
          const name = get(generalStore.breadcrumbParams.value, key)
          title = title.replace(`:${key}`, name || value)
        })

        return {
          title: decodeURI(title),
          to: path,
          exact: true,
          disabled: isReachCurrent
        }
      })

    return breadcrumbs
  })

  return getBreadcrumbs
}
