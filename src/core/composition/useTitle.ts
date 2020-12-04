import { watch, computed, SetupContext } from '@vue/composition-api'

export default function (context: SetupContext) {
  const defaultTitle = 'AskAnna - Running Data Science Projects'

  const getTitle = function () {
    const title = computed(() => context.root.$route.params.title || context.root.$route.meta.title)

    document.title = title.value ? `${title.value} | ${defaultTitle}` : defaultTitle
  }

  // init
  getTitle()

  // update title based on route params or route meta
  watch(
    () => context.root.$route,
    function () {
      getTitle()
    }
  )
}
