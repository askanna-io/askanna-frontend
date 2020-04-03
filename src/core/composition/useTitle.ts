import { SetupContext } from '@vue/composition-api'
import { watch } from '@vue/composition-api'

export default function(context: SetupContext) {
  const defaultTitle = 'AskAnna - Running Data Science Projects'

  const getTitle = function() {
    const { title } = context.root.$route.params
    console.log(context.root.$route)
    document.title = title ? `${title} | ${defaultTitle}` : defaultTitle
  }

  watch(
    () => context.root.$route,
    function() {
      getTitle()
    }
  )
}
