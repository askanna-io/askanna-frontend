import { watch, SetupContext } from '@vue/composition-api'

export default function (context: SetupContext, { start = 0, end = undefined }) {
  let breadcrumbs: any = []

  const getBreadcrumbs = function () {
    let isReachCurrent = false

    breadcrumbs = context.root.$route.matched
      .filter(route => route.meta.breadcrumb)
      .slice(start, end)
      .map(route => {
        if (isReachCurrent) return
        isReachCurrent = context.root.$route.name === route.name

        let path = route.path
        let title = route.meta.breadcrumb

        Object.entries(context.root.$route.params).forEach(([key, value]) => {
          path = path.replace(`:${key}`, value)
          title = title.replace(`:${key}`, value)
        })
        return {
          title,
          to: path,
          disabled: isReachCurrent
        }
      })
  }

  watch(
    () => context.root.$route,
    function () {
      getBreadcrumbs()
    }
  )

  return breadcrumbs
}
