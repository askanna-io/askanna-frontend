<template>
  <div>
    <div v-sticky="true" on-stick="onStick" :sticky-margin-width="0" sticky-offset="{top: 52, bottom: 10}">
      <v-toolbar dense color="white" class="br-r5 ma-3" :flat="!sticked">
        <v-btn
          text
          icon
          class="align-self-center mr-4"
          :color="(isShowProjectBar && 'primary') || ''"
          @click="isShowProjectBar = !isShowProjectBar"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <v-breadcrumbs :items="breadcrumbs">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" exact>
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
        <v-spacer />
      </v-toolbar>
      <v-slide-y-transition>
        <v-card v-if="isShowProjectBar" :flat="!sticked" :class="{ 'ma-3': sticked }">
          <v-divider v-if="!sticked" />
          <project-tool-bar :projectName="project.name" />
          <v-divider />
          <job-tool-bar :jobName="jobName" :projectName="project.name" />
        </v-card>
      </v-slide-y-transition>
    </div>
    <v-divider />

    <v-card flat>
      <v-card-title>
        <span class="title font-weight-light">Job run: #{{ jobRunId }}</span></v-card-title
      >
      <v-divider />

      <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="!jobRun">
        <job-run-info :jobRun="jobRun" :jobName="jobName" :jobId="jobId" />
        <v-divider />

        <v-row>
          <v-col cols="12">
            <v-toolbar dense color="white" class="br-r5" flat transition="slide-y-transition">
              <v-tabs v-model="currentJobRunTab" left align-with-title>
                <v-tabs-slider color="primary" />
                <template v-for="tab of jobRunTabs">
                  <v-tab v-if="tab.show" ripple :key="tab.id" :to="{ name: tab.to }">
                    {{ tab.name }}
                  </v-tab>
                </template>
              </v-tabs>
            </v-toolbar>
          </v-col>
        </v-row>
      </v-skeleton-loader>
    </v-card>
  </div>
</template>
<script>
import useJobStore from '@job/composition/useJobStore'
import useMoment from '@/core/composition/useMoment'
import useFetchData from '@/core/composition/useFetchData'
import JobRunInfo from '@jobrun/components/jobrun/JobRunInfo'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import useJobRunResults from '@jobs/composition/useJobRunResults'
import useProjectStore from '@project/composition/useProjectStore'

import JobToolBar from './parts/JobToolBar'
import ProjectToolBar from './parts/ProjectToolBar'
import { defineComponent, onBeforeMount, computed, watch, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunNavBar',

  components: {
    JobToolBar,
    JobRunInfo,
    ProjectToolBar
  },

  props: {
    job: {
      type: Object,
      default: function () {
        return {
          name: ''
        }
      }
    },
    project: {
      type: Object,
      default: function () {
        return {
          name: ''
        }
      }
    }
  },

  setup(props, context) {
    const jobStore = useJobStore()
    const fetchData = useFetchData()
    const jobRunStore = useJobRunStore()
    const projectStore = useProjectStore()

    onBeforeMount(async () => {
      const { jobId, jobRunId, projectId } = context.root.$route.params

      if (jobStore.job.value.short_uuid !== jobId) {
        projectStore.resetProjectJobs()
        await fetchData(context, [projectStore.getProjectJobs(projectId)])

        jobStore.getJob(jobId)
      }
      if (jobRunStore.jobRun.value.short_uuid !== jobRunId) {
        jobRunStore.resetStore()

        await jobRunStore.getJobRun(jobRunId)
        await handleViewPayload()
      }
    })

    const jobName = computed(() => jobStore.job.value.name)
    const isShowProjectBar = ref(false)
    const end = context.root.$route.name.indexOf('jobs-name') >= 1 ? 5 : 3
    const breadcrumbs = useBreadcrumbs(context, { start: 0, end: 7 })

    let sticked = ref(false)

    const currentJobRunTab = ref('workspace-project-jobs-job-jobrun-input')
    const jobRunTabs = [
      {
        id: 0,
        name: 'Input',
        show: !context.root.isNotBeta,
        to: 'workspace-project-jobs-job-jobrun-input'
      },
      {
        id: 1,
        name: 'Result',
        show: !context.root.isNotBeta,
        to: 'workspace-project-jobs-job-jobrun-result'
      },
      {
        id: 2,
        name: 'Log',
        show: !context.root.isNotBeta,
        to: 'workspace-project-jobs-job-jobrun-log'
      }
    ]

    const onStick = data => {
      sticked.value = data.sticked
    }

    const { jobId, jobRunId } = context.root.$route.params
    const jobRun = computed(() => jobRunStore.jobRun.value)

    const handleViewPayload = async () => {
      const {
        short_uuid,
        payload: { short_uuid: uuid }
      } = jobRunStore.jobRun.value

      if (!jobRunStore.jobRunPayload.value) {
        await jobRunStore.getJobRunPayload({ jobRunShortId: short_uuid, payloadUuid: uuid })
      }
    }

    return {
      sticked,
      onStick,
      jobRunTabs,
      breadcrumbs,
      isShowProjectBar,
      currentJobRunTab,

      jobId,
      jobRun,
      jobRunId,
      jobName
    }
  }
})
</script>
