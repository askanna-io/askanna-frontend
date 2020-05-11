import { SetupContext } from '@vue/composition-api'
import { onBeforeMount } from '@vue/composition-api'
import usePackageStore from './usePackageStore'
import useFetchData from '@/core/composition/useFetchData'

export default function (context: SetupContext) {
  const packageStore: any = usePackageStore()
  const fetchData = useFetchData()

  onBeforeMount(() => {
    /* const { projectId } = context.root.$route.params

    fetchData(context, packageStore.getProjectPackages(projectId)) */
  })

  return {
    ...packageStore,
    fetchData
  }
}
