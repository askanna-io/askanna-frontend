import { get } from 'lodash'

export default function () {
  const { route } = useRouterAskAnna()
  const generalStore = useGeneralStore()

  const defaultTitle = 'AskAnna - Running Data Science Projects'

  const getTitle = function () {
    const title = computed(() => {
      let pageTitle = route.meta?.title || route.params.title || ''
      // replace uuid to name
      Object.entries(route.params).forEach(([key, value]) => {
        const name = get(generalStore.breadcrumbParams, key)
        pageTitle = pageTitle.replace(key, name || value)
      })

      return pageTitle
    })

    document.title = title.value ? `${title.value} | ${defaultTitle}` : defaultTitle
  }

  // init
  getTitle()

  // update title based on route params or route meta
  watchEffect(() => {
    getTitle()
  })
}
