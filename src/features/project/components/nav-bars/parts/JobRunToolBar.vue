<template>
  <v-flex>
    <v-card-title v-if="showTitle" :class="{ 'ml-0': $vuetify.breakpoint.xsOnly }">
      <span class="title font-weight-light">Run: #{{ jobRunId }}</span>
    </v-card-title>

    <v-tabs v-model="currentJobRunTab" class="pb-3">
      <v-tab v-for="tab of tabs" ripple :key="tab.id" :to="{ name: tab.to, params }">
        {{ tab.name }}
      </v-tab>
      <JobRunMenuPopup v-if="!isEditJobRunView && projectRunEdit && $vuetify.breakpoint.xsOnly" class="pt-2" />
    </v-tabs>
  </v-flex>
</template>
<script setup lang="ts">
import JobRunMenuPopup from './JobRunMenuPopup.vue'
import { ref, computed } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'

const props = defineProps({
  jobRunId: {
    type: String,
    default: ''
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  isEditJobRunView: {
    type: Boolean,
    default: false
  },
  projectRunEdit: {
    type: Boolean,
    default: false
  },
  jobrun: {
    type: Object,
    default: function () {
      return {
        name: '',
        short_uuid: '',
        description: ''
      }
    }
  }
})

const routerAA = useRouterAskAnna()

const currentJobRunTab = ref('workspace-project-jobs-job-jobrun-input')

const params = computed(() => routerAA.route.params)

const jobRunEditTabs = [
  {
    id: 0,
    name: 'Edit run info',
    show: true,
    to: 'workspace-project-jobs-job-jobrun-edit'
  }
]

const jobRunTabs = [
  {
    id: 0,
    name: 'Overview',
    show: true,
    to: 'workspace-project-jobs-job-jobrun-overview'
  },
  {
    id: 1,
    name: 'Input',
    show: true,
    to: 'workspace-project-jobs-job-jobrun-input'
  },
  {
    id: 2,
    name: 'Result',
    show: true,
    to: 'workspace-project-jobs-job-jobrun-result'
  },
  {
    id: 3,
    name: 'Metrics',
    show: true,
    to: 'workspace-project-jobs-job-jobrun-metrics'
  },
  {
    id: 4,
    name: 'Artifact',
    show: true,
    to: 'workspace-project-jobs-job-jobrun-artifact'
  },
  {
    id: 5,
    name: 'Variables',
    show: true,
    to: 'workspace-project-jobs-job-jobrun-variables'
  },
  {
    id: 6,
    name: 'Code',
    show: true,
    to: 'workspace-project-jobs-job-jobrun-code'
  },
  {
    id: 7,
    name: 'Log',
    show: true,
    to: 'workspace-project-jobs-job-jobrun-log'
  }
]

const tabs = computed(() => {
  const runTabs = props.isEditJobRunView ? jobRunEditTabs : jobRunTabs
  return runTabs.filter(item => item.show)
})
</script>
