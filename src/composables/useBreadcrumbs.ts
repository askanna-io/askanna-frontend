import { get } from 'lodash'

export default function ({ start = 0, end = undefined }) {
  const generalStore = useGeneralStore()
  const { route: crcRoute } = useRouterAskAnna()

  const getBreadcrumbs = computed(() => {
    let breadcrumbs: any = []

    let isReachCurrent = false

    breadcrumbs = crcRoute.matched
      .filter(route => route.meta.breadcrumb)
      .slice(start, end)
      .map(route => {
        if (isReachCurrent) return
        isReachCurrent = crcRoute.name === route.name

        let path = route.path.replace('?', '')
        let title = route.meta.breadcrumb
        Object.entries(crcRoute.params).forEach(([key, value]) => {
          path = path.replace(`:${key}`, value)
          const name = get(generalStore.breadcrumbParams, key)
          title = title.replace(`:${key}`, name || value)
        })

        return {
          to: path,
          title: decodeURI(title),
          disabled: isReachCurrent
        }
      })

    return breadcrumbs
  })

  return getBreadcrumbs
}
