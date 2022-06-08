import { useRouter } from '@u3u/vue-hooks'
import useProjectStore from './useProjectStore'
import { computed, onBeforeMount, onUnmounted, watch } from '@vue/composition-api'

export default function () {
  const { route } = useRouter()
  const projectStore: any = useProjectStore()

  const projectIdCd = computed(() => route.value.params.projectId)

  const fetchData = async () => {
    projectStore.resetProjectData()

    const { projectId } = route.value.params

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
}
