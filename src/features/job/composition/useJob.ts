import useJobStore from './useJobStore'
import useFetchData from '@/core/composition/useFetchData'

export default function() {
  const jobStore = useJobStore()
  const fetchData = useFetchData()

  return {
    ...jobStore,
    fetchData
  }
}
