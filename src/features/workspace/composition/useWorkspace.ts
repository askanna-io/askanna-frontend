import { onBeforeMount, SetupContext } from '@vue/composition-api'
import useWorkspaceStore from './useWorkSpaceStore'
import useFetchData from '@/core/composition/useFetchData'

export default function (context: SetupContext) {
  const workspaceStore: any = useWorkspaceStore()
  const fetchData = useFetchData()

  onBeforeMount(() => {
    const { workspaceId } = context.root.$route.params

    if (workspaceId) fetchData(context, workspaceStore.getWorkspace(workspaceId))
  })

  return {
    ...workspaceStore,
    fetchData
  }
}
