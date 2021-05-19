import { SetupContext } from '@vue/composition-api'
import { onBeforeMount } from '@vue/composition-api'
import usePackagesStore from './usePackagesStore'
import useFetchData from '@/core/composition/useFetchData'

export default function (context: SetupContext) {
  const packagesStore: any = usePackagesStore()
  const fetchData = useFetchData()

  onBeforeMount(() => {
    packagesStore.resetStore()
    const { projectId: uuid } = context.root.$route.params
    fetchData(context, packagesStore.getProjectPackages({ uuid, params: { limit: 1, offset: 0 } }))
  })

  return {
    ...packagesStore,
    fetchData
  }
}
