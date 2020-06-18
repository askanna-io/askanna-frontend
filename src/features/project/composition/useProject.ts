import useProjectStore from './useProjectStore'
import useFetchData from '@/core/composition/useFetchData'
import { SetupContext, onBeforeMount } from '@vue/composition-api'

export default function (context: SetupContext) {
  const projectStore: any = useProjectStore()
  const fetchData = useFetchData()

  onBeforeMount(() => {
    const { projectId } = context.root.$route.params

    if (projectId && projectId !== projectStore.project.value.short_uuid) {
      fetchData(context, projectStore.getProject(projectId))
    }
  })

  return {
    ...projectStore,
    fetchData
  }
}
