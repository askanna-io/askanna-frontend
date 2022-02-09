import { useRouter } from '@u3u/vue-hooks'
import usePackagesStore from './usePackagesStore'
import { onBeforeMount } from '@vue/composition-api'
import useFetchData from '@/core/composition/useFetchData'

export default () => {
  const { route } = useRouter()
  const fetchData = useFetchData()
  const packagesStore: any = usePackagesStore()

  onBeforeMount(() => {
    packagesStore.resetStore()
    const uuid = route.value.params.projectId
    fetchData(packagesStore.getProjectPackages({ uuid, params: { limit: 1, offset: 0 } }))
  })

  return {
    ...packagesStore,
    fetchData
  }
}
