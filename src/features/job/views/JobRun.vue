<template>
  <v-card flat>
    <v-card-title>Job run #{{ jobRunId }}</v-card-title>
    <v-divider />

    <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="!jobRunData">
      <v-list class="transparent" max-width="450px" v-if="jobRunData">
        <v-list-item>
          <v-list-item-title>Status: <ask-anna-chip-status :status="jobRunData.status" /> </v-list-item-title>
          <v-list-item-title class="text-left">
            Duratation: &nbsp;{{ runTimeHours(jobRunData.created, jobRunData.finished) }} seconds
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
          <v-list-item-title>Memory: {{ jobRunData.memory }}MB</v-list-item-title>
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
                  {{ jobRunData.return_payload }}
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

    const currentJob = computed(() => {
      return projectStore.projectJobs.value.find(job => job.name === jobName)
    })

    const jobRunData = computed(() => {
      return jobStore.runs.value.find(run => run.uuid === jobRunId)
    })

    onBeforeMount(async () => {
      projectStore.resetProjectJobs()
      const { jobName, jobRunId, projectId } = context.root.$route.params

      await fetchData(context, [projectStore.getProjectJobs(projectId)])
    })

    watch(currentJob, (val, prevCount) => {
      if (!val) return
      jobStore.getRunsJob(val.id)
    })

    return {
      ...jobStore,
      ...moment,
      ...jobRunResult,
      jobName,
      jobRunId,
      jobRunData
    }
  }
})
</script>
