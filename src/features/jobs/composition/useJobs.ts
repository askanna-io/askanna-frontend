import { SetupContext } from '@vue/composition-api'
import { onBeforeMount } from '@vue/composition-api'
import useJobsStore from '../composition/useJobsStore'
import useFetchData from '@/core/composition/useFetchData'

export default function() {
  const jobsStore: any = useJobsStore()
  const fetchData = useFetchData()

  onBeforeMount((context: SetupContext) => {
    fetchData(context, jobsStore.getJobsList)
  })

  return {
    ...jobsStore,
    fetchData
  }
}
