import { SetupContext } from '@vue/composition-api'
import usePackageStore from './usePackageStore'
import useFetchData from '@/core/composition/useFetchData'

export default function (context: SetupContext) {
  const packageStore: any = usePackageStore()
  const fetchData = useFetchData()

  return {
    ...packageStore,
    fetchData
  }
}
