<template>
  <div :class="{ 'mb-3': sticked }">
    <div v-sticky="true" on-stick="onStick" :sticky-margin-width="0" sticky-offset="{top: 52, bottom: 10}">
      <v-toolbar v-if="sticked" dense color="white" class="br-r5 ma-3" :flat="!sticked">
        <v-breadcrumbs :items="breadcrumbs" class="pl-0">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" :exact="item.exact">
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
    <v-breadcrumbs v-if="!sticked" :items="breadcrumbs" class="">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.to" :exact="item.exact">
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-divider />
    <v-card flat>
      <v-card-title v-if="!sticked">
        <span class="title font-weight-light"
          >Run{{ runName }}
          <ask-anna-copy-text
            v-if="!jobRun.name"
            :text="jobRun.short_uuid"
            :buttonType="{ text: true }"
            :styleClasses="'px-0 white title font-weight-light primary--black '"
          />
        </span>
        <v-spacer />
        <job-run-info-status class="title font-weight-light" text="" :value="jobRunStatus" />
      </v-card-title>

      <v-divider />

      <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="!jobRun">
        <v-row>
          <v-col cols="12" v-if="!sticked">
            <v-toolbar dense color="white" flat class="br-r5 ma-3">
              <job-run-tool-bar :showTitle="false" :isEditJobRunView="isEditJobRunView" />

              <v-spacer />

              <job-run-menu-popup v-if="!isEditJobRunView && projectRunEdit" :jobrun="jobRun" />
            </v-toolbar>
          </v-col>
        </v-row>
      </v-skeleton-loader>
    </v-card>
  </div>
</template>
<script>
import useJobStore from '@job/composition/useJobStore'
import usePermission from '@/core/composition/usePermission'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useJobRunStore from '@jobrun/composition/useJobRunStore'

import JobToolBar from './parts/JobToolBar'
import JobRunToolBar from './parts/JobRunToolBar'
import ProjectToolBar from './parts/ProjectToolBar'
import JobRunMenuPopup from './parts/JobRunMenuPopup'
import JobRunInfoStatus from '@/features/jobrun/components/jobrun/parts/JobRunInfoStatus'

import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunNavBar',

  components: {
    JobToolBar,
    JobRunToolBar,
    ProjectToolBar,
    JobRunMenuPopup,
    JobRunInfoStatus
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
    const permission = usePermission()
    const jobRunStore = useJobRunStore()
    const breadcrumbs = useBreadcrumbs(context, { start: 0, end: 6 })

    const projectRunEdit = computed(() => permission.getFor(permission.labels.projectRunEdit))

    const { jobId, jobRunId } = context.root.$route.params
    const jobName = computed(() => jobStore.job.value.name)
    const jobRun = computed(() => jobRunStore.jobRun.value)
    const jobRunStatus = computed(() => jobStore.jobrun.value.status)
    const runName = computed(() => (jobRun.value.name ? `: ${jobRun.value.name}` : ':'))

    const isEditJobRunView = computed(() => context.root.$route.name === 'workspace-project-jobs-job-jobrun-edit')

    const onStick = data => props.handleOnStick(data.sticked)

    return {
      jobId,
      jobRun,
      jobName,
      runName,
      onStick,
      jobRunId,
      breadcrumbs,
      jobRunStatus,
      projectRunEdit,
      isEditJobRunView
    }
  }
})
</script>
