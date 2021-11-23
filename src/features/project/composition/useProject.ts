import useProjectStore from './useProjectStore'
import { computed, SetupContext, onBeforeMount, onUnmounted, watch } from '@vue/composition-api'

export default function (context: SetupContext) {
  const projectStore: any = useProjectStore()

  const projectIdCd = computed(() => context.root.$route.params.projectId)

  const fetchData = async () => {
    projectStore.resetProjectData()

    const { projectId } = context.root.$route.params

    await projectStore.getProjectMe(projectId)
    await projectStore.getProject(projectId)
  }

  onBeforeMount(() => {
    fetchData()
  })

  watch(projectIdCd, (projectId, prevId) => {
    if (projectId && projectId !== prevId) {
      fetchData()
    }
  })

  onUnmounted(() => {
    projectStore.resetProjectData()
  })

  return {
    ...projectStore
  }
}
