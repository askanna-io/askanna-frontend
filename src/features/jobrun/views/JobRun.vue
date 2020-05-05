<template>
  <v-card flat>
    <v-card-title>Job run #{{ jobRunId }}</v-card-title>
    <v-divider />

    <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="!jobRun">
      <job-run-info :jobRun="jobRun" :jobName="job.name" />
      <v-divider />
      <job-run-input
        :jobRun="jobRun"
        :formatType="formatType"
        :showPayload="showPayload"
        :jobRunPayload="jobRunPayloadComputed"
        @handleDownload="handleDownload"
        @handleViewPayload="handleViewPayload"
        @changeFormType="handleChangeFormType"
      />
      <v-expansion-panels>
        <job-run-result :jobRun="jobRun" />
        <job-run-log v-if="isNotBeta" :jobRun="jobRun" />
      </v-expansion-panels>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import { ref, defineComponent, onBeforeMount, computed, watch } from '@vue/composition-api'
import JobRunLog from '../components/jobrun/JobRunLog'
import JobRunInfo from '../components/jobrun/JobRunInfo'
import JobRunInput from '../components/jobrun/JobRunInput'
import JobRunResult from '../components/jobrun/JobRunResult'

import useJobStore from '@job/composition/useJobStore'
import useMoment from '@/core/composition/useMoment.js'
import useJobRunStore from '../composition/useJobRunStore'
import useFetchData from '@/core/composition/useFetchData'
import useJobRunResults from '@jobs/composition/useJobRunResults'
import useProjectStore from '@project/composition/useProjectStore'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

export default defineComponent({
  name: 'JobRun',

  components: {
    JobRunInfo,
    JobRunInput,
    JobRunResult
  },

  setup(props, context) {
    const jobStore = useJobStore()
    const fetchData = useFetchData()
    const moment = useMoment(context)
    const jobRunStore = useJobRunStore()
    const projectStore = useProjectStore()
    const jobRunResult = useJobRunResults()
    const forceFileDownload = useForceFileDownload()

    const formatType = ref()
    const showPayload = ref(false)

    const { jobId, jobRunId } = context.root.$route.params
    const currentJob = computed(() => projectStore.projectJobs.value.find(job => job.name === jobName))
    const jobRunPayloadComputed = computed(() => JSON.stringify(jobRunStore.jobRunPayload.value, null, 2))

    onBeforeMount(async () => {
      jobRunStore.resetStore()
      projectStore.resetProjectJobs()

      const { jobId, jobRunId, projectId } = context.root.$route.params

      jobStore.getJob(jobId)
      jobRunStore.getJobRun(jobRunId)

      await fetchData(context, [projectStore.getProjectJobs(projectId)])
    })

    const handleChangeFormType = value => (formatType.value = value)

    const handleDownload = async item => {
      await jobRunStore.getJobRunPayload({ jobRunShortId: item.short_uuid, payloadUuid: item.payload.uuid })

      const formatOption = formatType.value === 'raw' ? null : 2
      const jobRunPayload = JSON.stringify(jobRunStore.jobRunPayload.value, null, formatOption)

      forceFileDownload.trigger({ source: jobRunPayload, name: `payload-${item.payload.uuid}.json` })

      formatType.value = null
    }

    const handleViewPayload = async item => {
      showPayload.value = !showPayload.value
      if (!showPayload.value) return
      if (!jobRunStore.jobRunPayload.value) {
        await jobRunStore.getJobRunPayload({ jobRunShortId: item.short_uuid, payloadUuid: item.payload.uuid })
      }

      const jobRunPayload = JSON.stringify(jobRunStore.jobRunPayload.value, null, 2)
    }

    return {
      ...moment,
      ...jobStore,
      ...jobRunStore,
      ...jobRunResult,
      jobRunId,
      formatType,
      showPayload,
      handleDownload,
      handleViewPayload,
      handleChangeFormType,
      jobRunPayloadComputed
    }
  }
})
</script>
