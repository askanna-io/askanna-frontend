import { watch, SetupContext } from '@vue/composition-api'

export default (context: SetupContext, params: { start: number; end: number } = { start: 0, end: 6 }) => {
  const { start, end } = params

  let breadcrumbs: any = []

  const getBreadcrumbs = () => {
    const beforeFolderPath = context.root.$route.path.split('/').slice(start, end).join('/')

    let currentPath = beforeFolderPath

    breadcrumbs = context.root.$route.path
      .split('/')
      .slice(end)
      .filter(name => name !== '')
      .map(name => {
        currentPath = `${name}`
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
