<template>
  <div :class="{ 'mb-3': sticked }">
    <div v-sticky="true" on-stick="onStick" :sticky-margin-width="0" sticky-offset="{top: 52, bottom: 10}">
      <v-toolbar v-if="sticked" dense color="white" class="br-r5 ma-3" :flat="!sticked">
        <v-breadcrumbs :items="breadcrumbs" class="pl-0">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" exact>
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
        <v-spacer />
      </v-toolbar>
      <v-slide-y-transition>
        <v-card v-if="sticked" :flat="!sticked" :class="{ 'ma-3': sticked }">
          <v-divider v-if="!sticked" />
          <project-tool-bar :projectName="project.name" />
          <v-divider />
          <job-tool-bar :jobName="jobName" :projectName="project.name" />
          <v-divider v-if="sticked" />
          <job-run-tool-bar v-if="sticked" :jobRunId="jobRunId" />
        </v-card>
      </v-slide-y-transition>
    </div>

    <v-card flat>
      <v-card-title v-if="!sticked">
        <span class="title font-weight-light">Job run: #{{ jobRunId }}</span>
      </v-card-title>
      <v-divider />

      <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="!jobRun">
        <job-run-info :jobRun="jobRun" :jobName="jobName" :jobId="jobId" />
        <v-divider />

        <v-row>
          <v-col cols="12" v-if="!sticked">
            <job-run-tool-bar :showTitle="false" />
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
import JobRunToolBar from './parts/JobRunToolBar'
import ProjectToolBar from './parts/ProjectToolBar'
import { defineComponent, onBeforeMount, computed, watch, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunNavBar',

  components: {
    JobToolBar,
    JobRunInfo,
    JobRunToolBar,
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
    },
    sticked: {
      type: Boolean,
      default: false
    },

    handleOnStick: {
      type: Function,
      default: () => {}
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

    const onStick = data => props.handleOnStick(data.sticked)

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
      onStick,
      breadcrumbs,
      isShowProjectBar,

      jobId,
      jobRun,
      jobRunId,
      jobName
    }
  }
})
</script>
