import useProjectStore from './useProjectStore'
import useFetchData from '@/core/composition/useFetchData'

export default function() {
  const projectStore = useProjectStore()
  const fetchData = useFetchData()

  return {
    ...projectStore,
    fetchData
  }
}
