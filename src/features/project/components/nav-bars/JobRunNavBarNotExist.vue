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
        </v-card>
      </v-slide-y-transition>
    </div>
    <v-breadcrumbs v-if="!sticked" :items="breadcrumbs" class="">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.to" exact>
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </div>
</template>
<script>
import useJobStore from '@job/composition/useJobStore'
import useMoment from '@/core/composition/useMoment'
import useFetchData from '@/core/composition/useFetchData'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import useJobRunResults from '@jobs/composition/useJobRunResults'
import useProjectStore from '@project/composition/useProjectStore'

import JobToolBar from './parts/JobToolBar'
import ProjectToolBar from './parts/ProjectToolBar'
import { defineComponent, onBeforeMount, computed, watch, ref } from '@vue/composition-api'

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
    const fetchData = useFetchData()
    const jobRunStore = useJobRunStore()
    const projectStore = useProjectStore()

    const jobName = computed(() => jobStore.job.value.name)
    const end = context.root.$route.name.indexOf('jobs-name') >= 1 ? 5 : 3
    const breadcrumbs = useBreadcrumbs(context, { start: 0, end: 6 })

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
