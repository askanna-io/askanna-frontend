import { get } from 'lodash'

export default function () {
  const { route } = useRouterAskAnna()
  const generalStore = useGeneralStore()

  const defaultTitle = 'AskAnna - Running Data Science Projects'

  const updateTitle = function () {
    const title = computed(() => {
      let pageTitle = route.meta?.title || route.params.title || ''

      // replace suuid to name
      Object.entries(route.params).forEach(([key, value]) => {
        const keyName = key.slice(0, -2) + 'Name'
        const name = get(generalStore.breadcrumbParams, keyName)
        pageTitle = pageTitle.replace(key, name || value)
      })

      return pageTitle
    })

    document.title = title.value ? `${title.value} | ${defaultTitle}` : defaultTitle
  }

  // update title based on route params or route meta title
  watch(
    () => generalStore.breadcrumbParams,
    () => {
      updateTitle()
    },
    { immediate: true }
  )

  watch(
    () => route.name,
    () => {
      updateTitle()
    },
    { immediate: true }
  )
}
