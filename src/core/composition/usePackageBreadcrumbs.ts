import { computed, SetupContext } from '@vue/composition-api'

export default (context: SetupContext, params: { start: number; end: number } = { start: 0, end: 6 }) => {
  const { end } = params

  const getBreadcrumbs = computed(() => {
    const beforeFolderPath = context.root.$route.path.split('/').slice(0, end).join('/')
    const { workspaceId, projectId, packageId } = context.root.$route.params

    let currentPath = beforeFolderPath

    const breadcrumbs = context.root.$route.path
      .split('/')
      .slice(end)
      .filter(name => name !== '')
      .map((name, index, arr) => {
        currentPath += `/${name}`
        return {
          title: name,
          to: {
            path: currentPath,
            params: { workspaceId, projectId, packageId, folderName: currentPath }
          },
          disabled: index === arr.length - 1
        }
      })
    return breadcrumbs
  })

  return getBreadcrumbs
}
