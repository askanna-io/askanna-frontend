import { get } from 'lodash'
import { useRouter } from '@u3u/vue-hooks'
import { watchEffect, computed } from '@vue/composition-api'
import { useGeneralStore } from '@/core/store/useGeneralStore'

export default function () {
  const { route } = useRouter()
  const generalStore = useGeneralStore()

  const defaultTitle = 'AskAnna - Running Data Science Projects'

  const getTitle = function () {
    const title = computed(() => {
      let pageTitle = route.value.meta?.title || route.value.params.title || ''
      // replace uuid to name
      Object.entries(route.value.params).forEach(([key, value]) => {
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
