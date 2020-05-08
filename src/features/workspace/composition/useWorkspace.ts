import { SetupContext } from '@vue/composition-api'
import { onBeforeMount } from '@vue/composition-api'
import useWorkSpaceStore from './useWorkSpaceStore'
import useFetchData from '@/core/composition/useFetchData'

export default function (context: SetupContext) {
  const workspaceStore: any = useWorkSpaceStore()
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
