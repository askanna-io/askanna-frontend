import { watch, SetupContext } from '@vue/composition-api'

export default function (context: SetupContext) {
  const defaultTitle = 'AskAnna - Running Data Science Projects'

  const getTitle = function () {
    const { title } = context.root.$route.params
    document.title = title ? `${title} | ${defaultTitle}` : defaultTitle
  }

  watch(
    () => context.root.$route,
    function () {
      getTitle()
    }
  )
}
