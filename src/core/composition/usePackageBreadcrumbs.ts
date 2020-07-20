import { watch, SetupContext } from '@vue/composition-api'

export default (context: SetupContext) => {
  let breadcrumbs: any = []

  const getBreadcrumbs = () => {
    const beforeFolderPath = context.root.$route.path.split('/').slice(0, 7).join('/')

    let currentPath = beforeFolderPath

    breadcrumbs = context.root.$route.path
      .split('/')
      .slice(7)
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
    () => {
      getBreadcrumbs()
    }
  )
  return breadcrumbs
}
