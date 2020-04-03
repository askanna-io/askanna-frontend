<template>
  <v-card flat>
    <v-card-title>Job run #{{ jobRunId }}</v-card-title>
    <v-divider />

    <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="!jobRun">
      <v-list class="transparent" max-width="650px" v-if="jobRun">
        <v-list-item>
          <v-list-item-title>Status: <ask-anna-chip-status :status="jobRun.status" /> </v-list-item-title>
          <v-list-item-title class="text-left">
            Duratation: &nbsp;{{ runTimeHours(jobRun.created, jobRun.finished) }} seconds
          </v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title
            >Job:
            <v-chip small outlined label :to="{ name: 'workspace' }">
              {{ jobName }}
            </v-chip></v-list-item-title
          >
          <v-list-item-title class="text-left">
            CPU: 10%
          </v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>Version: {{ jobRun.version.name }}: #{{ jobRun.version.uuid }}</v-list-item-title>
          <v-list-item-title class="text-left"> Runner/worker: {{ jobRun.runner.name }} </v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>By: {{ jobRun.owner.name }}</v-list-item-title>
          <v-list-item-title class="text-left"> Trigger: {{ jobRun.trigger.name }} </v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>Memory: {{ jobRun.memory }}MB</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-expansion-panels focusable tile>
        <v-expansion-panel>
          <v-expansion-panel-header>Input</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-flex pt-2>
              <v-chip outlined label color="primary" @click.stop="handleDownload(jobRun)">
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
                  {{ jobRun.return_payload }}
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
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import { createComponent, onBeforeMount, computed, watch } from '@vue/composition-api'

import useJobStore from '@job/composition/useJobStore'
import useMoment from '@/core/composition/useMoment.js'
import useFetchData from '@/core/composition/useFetchData'
import useJobRunResults from '@jobs/composition/useJobRunResults'
import useProjectStore from '@project/composition/useProjectStore'

export default createComponent({
  name: 'JobRun',

  setup(props, context) {
    const jobStore = useJobStore()
    const fetchData = useFetchData()
    const moment = useMoment(context)
    const projectStore = useProjectStore()
    const jobRunResult = useJobRunResults()

    const { jobName, jobRunId } = context.root.$route.params

    const currentJob = computed(() => projectStore.projectJobs.value.find(job => job.name === jobName))

    onBeforeMount(async () => {
      projectStore.resetProjectJobs()
      const { jobName, jobRunId, projectId } = context.root.$route.params

      jobStore.getJobRun(jobRunId)

      await fetchData(context, [projectStore.getProjectJobs(projectId)])
    })

    watch(currentJob, (val, prevCount) => {
      if (!val) return
      jobStore.getRunsJob(val.short_uuid)
    })

    const handleDownload = item => {
      jobStore.getJobRunPayload({ jobRunShortId: item.short_uuid, payloadUuid: item.payload.uuid })
    }

    return {
      ...jobStore,
      ...moment,
      ...jobRunResult,
      jobName,
      jobRunId,
      handleDownload
    }
  }
})
</script>
