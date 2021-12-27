<template>
  <div :class="{ 'mb-3': sticked }">
    <div v-sticky="true" on-stick="onStick" :sticky-margin-width="0" sticky-offset="{top: 52, bottom: 10}">
      <v-toolbar v-if="sticked" dense color="white" class="br-r5 ma-3 askAnna-breadcrumbs" :flat="!sticked">
        <div class="">
          <v-breadcrumbs :items="breadcrumbs" class="pl-0" :class="{ 'ma-0 pa-0': $vuetify.breakpoint.xsOnly }">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :to="item.to" :exact="item.exact">
                {{ item.title }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </div>
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
    <div class="askAnna-breadcrumbs" :class="{ 'mb-2 mt-0': $vuetify.breakpoint.xsOnly }">
      <v-breadcrumbs v-if="!sticked" :items="breadcrumbs" :class="{ 'py-0 mt-0 pl-3': $vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" :exact="item.exact">
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </div>

    <v-divider v-if="!$vuetify.breakpoint.xsOnly" />

    <v-card flat>
      <v-card-title v-if="!sticked" :class="{ 'py-1 pl-3 ': $vuetify.breakpoint.xsOnly }">
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

      <v-divider v-if="!sticked && !$vuetify.breakpoint.xsOnly" />

      <v-toolbar
        v-if="!sticked"
        flat
        dense
        color="white"
        :class="{ 'br-r5 ma-3': !$vuetify.breakpoint.xsOnly, 'ma-0 with-tabs': $vuetify.breakpoint.xsOnly }"
      >
        <job-run-tool-bar
          :showTitle="false"
          :jobrun="jobRun"
          :projectRunEdit="projectRunEdit"
          :isEditJobRunView="isEditJobRunView"
        />

        <v-spacer />

        <job-run-menu-popup v-if="!isEditJobRunView && projectRunEdit && !$vuetify.breakpoint.xsOnly" />
      </v-toolbar>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from '@u3u/vue-hooks'
import { computed } from '@vue/composition-api'
import usePermission from '@/core/composition/usePermission'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useJobStore from '@/features/job/composition/useJobStore'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'

import JobToolBar from './parts/JobToolBar.vue'
import JobRunToolBar from './parts/JobRunToolBar.vue'
import ProjectToolBar from './parts/ProjectToolBar.vue'
import JobRunMenuPopup from './parts/JobRunMenuPopup.vue'
import JobRunInfoStatus from '@/features/jobrun/components/jobrun/parts/JobRunInfoStatus.vue'

const props = defineProps({
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
})

const { route } = useRouter()
const jobStore = useJobStore()
const permission = usePermission()
const jobRunStore = useJobRunStore()
const breadcrumbs = useBreadcrumbs({ start: 0, end: 6 })

const projectRunEdit = computed(() => permission.getFor(permission.labels.projectRunEdit))

const { jobRunId } = route.value.params
const jobName = computed(() => jobStore.job.value.name)
const jobRun = computed(() => jobRunStore.state.jobRun.value)
const jobRunStatus = computed(() => jobStore.jobrun.value.status)
const runName = computed(() => (jobRun.value.name ? `: ${jobRun.value.name}` : ':'))

const isEditJobRunView = computed(() => route.value.name === 'workspace-project-jobs-job-jobrun-edit')

const onStick = data => props.handleOnStick(data.sticked)
</script>
