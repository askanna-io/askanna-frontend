import useJobsStore from '../composition/useJobsStore'

export default function () {
  const jobsStore: any = useJobsStore()

  return {
    ...jobsStore
  }
}
