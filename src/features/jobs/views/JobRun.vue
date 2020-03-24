<template>
  <v-flex>asdas</v-flex>
</template>

<script>
import { createComponent } from '@vue/composition-api'

import useJobs from '../composition/useJobs'
import { useWindowSize } from '@u3u/vue-hooks'
import useJob from '../../job/composition/useJob'
import useMoment from '@/core/composition/useMoment.js'
import useJobRunResults from '../composition/useJobRunResults'

import JobRunResults from '../components/JobRunResults'

export default createComponent({
  name: 'TheJobs',

  components: { JobRunResults },

  setup(props, context) {
    const job = useJob()
    const jobs = useJobs()
    const moment = useMoment(context)
    const { height } = useWindowSize()
    const jobRunResult = useJobRunResults()

    const handleClickOnRow = item =>
      context.root.$router.push({
        name: 'workspace-project-packages-uuid-version-uuid-name',
        params: { ...context.root.$route.params, jobRunId: item.uuid }
      })

    return {
      height,
      ...job,
      ...jobs,
      ...moment,
      ...jobRunResult,
      handleClickOnRow
    }
  }
})
</script>
