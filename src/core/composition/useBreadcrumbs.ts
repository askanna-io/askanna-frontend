import { computed, SetupContext } from '@vue/composition-api'
import useGeneralStore from '@/core/store/general/useGeneralStore'

export default function (context: SetupContext, { start = 0, end = undefined }) {
  const generalStore = useGeneralStore()

  const getBreadcrumbs = computed(() => {
    let breadcrumbs: any = []

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
          //@ts-expect-error: Let's ignore a single compiler error
          const name = generalStore.breadcrumbParams.value[key]
          title = title.replace(`:${key}`, name || value)
        })

        return {
          title,
          to: path,
          exact: true,
          disabled: isReachCurrent
        }
      })

    return breadcrumbs
  })

  return getBreadcrumbs
}
