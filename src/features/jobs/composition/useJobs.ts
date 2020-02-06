import { onBeforeMount } from '@vue/composition-api'
import useJobsStore from '../composition/useJobsStore'
import useFetchData from '@/core/composition/useFetchData'

export default function() {
  const jobsStore = useJobsStore()
  const fetchData = useFetchData()

  onBeforeMount(context => {
    console.log('V3 beforeMount!')
    fetchData(context, jobsStore.getJobsList)
  })

  return {
    ...jobsStore,
    fetchData
  }
}
