<template>
  <v-card flat>
    <v-card-title>Job run #{{ jobRunId }}</v-card-title>
    <v-divider />

    <v-list class="transparent" max-width="450px">
      <v-list-item>
        <v-list-item-title>Status: success</v-list-item-title>
        <v-list-item-title class="text-left">
          Duratation: 10s
        </v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>Job: {{ job.name }}</v-list-item-title>
        <v-list-item-title class="text-left">
          CPU: 100%
        </v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>Version: 1</v-list-item-title>
        <v-list-item-title class="text-left">
          Runner/worker: Python “x”
        </v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>By: @Robert</v-list-item-title>
        <v-list-item-title class="text-left">
          Trigger: API
        </v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>Memory: 100Mb</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-expansion-panels focusable tile>
      <v-expansion-panel>
        <v-expansion-panel-header>Input</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-flex pt-2>
            <v-chip outlined label color="primary" @click.stop="handleDownload(item)">
              <v-avatar left><v-icon>mdi-cloud-download</v-icon></v-avatar
              >Download Json</v-chip
            >
          </v-flex>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Result</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list class="transparent" max-width="450px">
            <v-list-item>
              <v-list-item-title>Result:</v-list-item-title>
              <v-list-item-title class="text-left">
                Hello jobhsas sjahdlkashd sjdhla
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Log</v-expansion-panel-header>
        <v-expansion-panel-content> </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
import { createComponent, onBeforeMount } from '@vue/composition-api'

import useJobs from '@jobs/composition/useJobs'
import { useWindowSize } from '@u3u/vue-hooks'
import jobStore from '@job/composition/useJobStore'
import useMoment from '@/core/composition/useMoment.js'
import JobRunResults from '@jobs/components/JobRunResults'
import useJobRunResults from '@jobs/composition/useJobRunResults'

export default createComponent({
  name: 'TheJobs',

  components: { JobRunResults },

  data() {
    return {
      currentJob: null,
      loading: true,
      openD: false,
      jobResults: {
        name: '',
        runtime: '',
        memory: '',
        return_payload: ''
      }
    }
  },

  setup(props, context) {
    const jobStore = useJobStore()
    const jobs = useJobs()
    const moment = useMoment(context)
    const { height } = useWindowSize()
    const jobRunResult = useJobRunResults()

    const { jobName, jobRunId } = context.root.$route.params

    onBeforeMount(() => {
      jobStore.resetStore()
      const { jobName, jobRunId } = context.root.$route.params
      const currentJob = jobs.list.value.find(job => job.name === jobName)

      jobStore.getJob(currentJob.id)
    })

    return {
      height,
      ...jobStore,
      ...jobs,
      ...moment,
      ...jobRunResult,
      jobRunId
    }
  }
})
</script>
