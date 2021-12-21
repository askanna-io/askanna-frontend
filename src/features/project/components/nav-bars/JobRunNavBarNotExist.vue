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
        </v-card>
      </v-slide-y-transition>
    </div>
    <div class="askAnna-breadcrumbs" :class="{ 'mb-2': $vuetify.breakpoint.xsOnly }">
      <v-breadcrumbs v-if="!sticked" :items="breadcrumbs" :class="{ 'py-0 mt-0 pl-3': $vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" :exact="item.exact">
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </div>
  </div>
</template>
<script lang="ts">
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useJobStore from '@/features/job/composition/useJobStore'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'

import JobToolBar from './parts/JobToolBar.vue'
import ProjectToolBar from './parts/ProjectToolBar.vue'
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunNavBarNotExist',

  components: {
    JobToolBar,
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
    const jobRunStore = useJobRunStore()

    const jobName = computed(() => jobStore.job.value.name)
    const breadcrumbs = useBreadcrumbs({ start: 0, end: 6 })

    const onStick = data => props.handleOnStick(data.sticked)

    const { jobId, jobRunId } = context.root.$route.params
    const jobRun = computed(() => jobRunStore.jobRun.value)

    return {
      jobId,
      jobRun,
      jobName,
      onStick,
      jobRunId,
      breadcrumbs
    }
  }
})
</script>
