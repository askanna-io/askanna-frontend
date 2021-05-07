import useGeneralStore from '@/core/store/general/useGeneralStore'
import { watchEffect, computed, SetupContext } from '@vue/composition-api'

export default function (context: SetupContext) {
  const generalStore = useGeneralStore()

  const defaultTitle = 'AskAnna - Running Data Science Projects'

  const getTitle = function () {
    const title = computed(() => {
      let pageTitle = context.root.$route.params.title || context.root.$route.meta.title || ''
      // replace uuid to name
      Object.entries(context.root.$route.params).forEach(([key, value]) => {
        //@ts-expect-error: Let's ignore a single compiler error
        const name = generalStore.breadcrumbParams.value.jobRunId
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
