export default (params: { start: number; end: number } = { start: 0, end: 6 }) => {
  const { end } = params
  const { route } = useRouterAskAnna()

  const getBreadcrumbs = computed(() => {
    const beforeFolderPath = route.path.split('/').slice(0, end).join('/')
    const { workspaceId, projectId, packageId } = route.params

    let currentPath = beforeFolderPath

    const breadcrumbs = route.path
      .split('/')
      .slice(end)
      .filter(name => name !== '')
      .map((name, index, arr) => {
        currentPath += `/${name}`
        return {
          title: decodeURI(name),
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
