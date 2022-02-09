import { useRouter } from '@u3u/vue-hooks'
import { computed } from '@vue/composition-api'

export default (params: { start: number; end: number } = { start: 0, end: 6 }) => {
  const { end } = params
  const { route } = useRouter()

  const getBreadcrumbs = computed(() => {
    const beforeFolderPath = route.value.path.split('/').slice(0, end).join('/')
    const { workspaceId, projectId, packageId } = route.value.params

    let currentPath = beforeFolderPath

    const breadcrumbs = route.value.path
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
          exact: true,
          disabled: index === arr.length - 1
        }
      })
    return breadcrumbs
  })

  return getBreadcrumbs
}
