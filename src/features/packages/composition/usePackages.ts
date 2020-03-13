import { SetupContext } from '@vue/composition-api'
import { onBeforeMount } from '@vue/composition-api'
import usePackagesStore from './usePackagesStore'
import useFetchData from '@/core/composition/useFetchData'

export default function(context: SetupContext) {
  const packagesStore: any = usePackagesStore()
  const fetchData = useFetchData()

  onBeforeMount(() => {
    const { projectId } = context.root.$route.params

    fetchData(context, packagesStore.getProjectPackages(projectId))
  })

  return {
    ...packagesStore,
    fetchData
  }
}
