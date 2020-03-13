import { SetupContext } from '@vue/composition-api'
import { onBeforeMount } from '@vue/composition-api'
import useProjectStore from './useProjectStore'
import useFetchData from '@/core/composition/useFetchData'

export default function(context: SetupContext) {
  const projectStore: any = useProjectStore()
  const fetchData = useFetchData()

  onBeforeMount(() => {
    const { projectId } = context.root.$route.params

    if (projectId) fetchData(context, projectStore.getProject(projectId))
  })

  return {
    ...projectStore,
    fetchData
  }
}
