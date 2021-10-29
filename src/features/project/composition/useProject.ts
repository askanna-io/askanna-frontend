import useProjectStore from './useProjectStore'
import { SetupContext, onBeforeMount, onUnmounted } from '@vue/composition-api'

export default function (context: SetupContext) {
  const projectStore: any = useProjectStore()

  const fetchData = async (projectId: string) => {
    await projectStore.getProjectMe(projectId)
    await projectStore.getProject(projectId)
  }

  onBeforeMount(() => {
    const { projectId } = context.root.$route.params

    projectStore.resetProjectData()

    fetchData(projectId)
  })

  onUnmounted(() => {
    projectStore.resetProjectData()
  })

  return {
    ...projectStore,
    fetchData
  }
}
