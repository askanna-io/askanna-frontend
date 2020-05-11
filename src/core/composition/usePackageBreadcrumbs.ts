import { watch, SetupContext } from '@vue/composition-api'

export default function (context: SetupContext) {
  let breadcrumbs: any = []

  const getBreadcrumbs = function () {
    const beforeFolderPath = context.root.$route.path.split('/').slice(0, 6).join('/')

    let currentPath = beforeFolderPath

    breadcrumbs = context.root.$route.path
      .split('/')
      .slice(6)
      .filter(name => name !== '')
      .map(name => {
        currentPath = `${currentPath}/${name}`
        return {
          title: name,
          to: currentPath,
          disabled: false
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
