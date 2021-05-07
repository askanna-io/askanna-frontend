<template>
  <v-card-title>
    <span v-if="showTitle" class="title font-weight-light">Job run: #{{ jobRunId }}</span>

    <v-tabs v-model="currentJobRunTab" left align-with-title>
      <v-tabs-slider color="primary" />
      <template v-for="tab of tabs">
        <v-tab v-if="tab.show" ripple :key="tab.id" :to="{ name: tab.to }">
          {{ tab.name }}
        </v-tab>
      </template>
    </v-tabs>
  </v-card-title>
</template>
<script>
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunToolBar',

  props: {
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
    }
  },

  setup(props, context) {
    const currentJobRunTab = ref('workspace-project-jobs-job-jobrun-input')

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
        show: !context.root.isNotBeta,
        to: 'workspace-project-jobs-job-jobrun-overview'
      },
      {
        id: 1,
        name: 'Input',
        show: !context.root.isNotBeta,
        to: 'workspace-project-jobs-job-jobrun-input'
      },
      {
        id: 2,
        name: 'Result',
        show: !context.root.isNotBeta,
        to: 'workspace-project-jobs-job-jobrun-result'
      },
      {
        id: 3,
        name: 'Metrics',
        show: !context.root.isNotBeta,
        to: 'workspace-project-jobs-job-jobrun-metrics'
      },
      {
        id: 4,
        name: 'Artifact',
        show: !context.root.isNotBeta,
        to: 'workspace-project-jobs-job-jobrun-artifact'
      },
      {
        id: 5,
        name: 'Variables',
        show: !context.root.isNotBeta,
        to: 'workspace-project-jobs-job-jobrun-variables'
      },
      {
        id: 6,
        name: 'Code',
        show: !context.root.isNotBeta,
        to: 'workspace-project-jobs-job-jobrun-code'
      },
      {
        id: 7,
        name: 'Log',
        show: !context.root.isNotBeta,
        to: 'workspace-project-jobs-job-jobrun-log'
      }
    ]

    const tabs = computed(() => {
      const runTabs = props.isEditJobRunView ? jobRunEditTabs : jobRunTabs
      return runTabs.filter(item => item.show)
    })

    return { tabs, currentJobRunTab }
  }
})
</script>
