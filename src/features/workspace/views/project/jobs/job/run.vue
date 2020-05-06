<template>
  <v-card flat>
    <v-card-title>Job run #{{ jobRunId }}</v-card-title>
    <v-divider />

    <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="!jobRun">
      <job-run-info :jobRun="jobRun" :jobName="jobName" />
      <v-divider />

      <v-row>
        <v-col cols="12">
          <v-toolbar dense color="white" class="br-r5" flat transition="slide-y-transition">
            <v-tabs v-model="currentTab" left align-with-title>
              <v-tabs-slider color="primary" />
              <template v-for="tab of tabs">
                <v-tab v-if="tab.show" ripple :key="tab.id" :to="{ name: tab.to }">
                  {{ tab.name }}
                </v-tab>
              </template>
            </v-tabs>
          </v-toolbar>
        </v-col>

        <v-col cols="12">
          <router-view />
        </v-col>
      </v-row>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import useJobStore from '@job/composition/useJobStore'
import useMoment from '@/core/composition/useMoment.js'
import useFetchData from '@/core/composition/useFetchData'
import JobRunInfo from '@jobrun/components/jobrun/JobRunInfo'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import useJobRunResults from '@jobs/composition/useJobRunResults'
import useProjectStore from '@project/composition/useProjectStore'
import { ref, defineComponent, onBeforeMount, computed, watch } from '@vue/composition-api'

export default defineComponent({
  components: {
    JobRunInfo
  },

  setup(props, context) {
    const jobStore = useJobStore()
    const fetchData = useFetchData()
    const jobRunStore = useJobRunStore()
    const projectStore = useProjectStore()

    onBeforeMount(async () => {
      jobRunStore.resetStore()
      projectStore.resetProjectJobs()

      const { jobId, jobRunId, projectId } = context.root.$route.params

      jobStore.getJob(jobId)
      jobRunStore.getJobRun(jobRunId)

      await fetchData(context, [projectStore.getProjectJobs(projectId)])
    })

    const tabs = [
      {
        id: 0,
        name: 'Input',
        component: 'JobRunInput',
        show: !context.root.isNotBeta,
        to: 'workspace-project-jobs-name-uuid-input'
      },
      {
        id: 1,
        name: 'Result',
        component: 'JobRunResult',
        show: !context.root.isNotBeta,
        to: 'workspace-project-jobs-name-uuid-result'
      }
    ]
    const currentTab = ref('workspace-project-activity')
    const { jobId, jobRunId } = context.root.$route.params
    const jobRun = computed(() => jobRunStore.jobRun.value)

    return {
      tabs,
      jobRun,
      jobRunId,
      currentTab,
      jobName: jobStore.job.value.name
    }
  }
})
</script>
