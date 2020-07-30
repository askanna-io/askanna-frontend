<template>
  <v-card-title>
    <span v-if="showTitle" class="title font-weight-light">Job run: #{{ jobRunId }}</span>

    <v-tabs v-model="currentJobRunTab" left align-with-title>
      <v-tabs-slider color="primary" />
      <template v-for="tab of jobRunTabs">
        <v-tab v-if="tab.show" ripple :key="tab.id" :to="{ name: tab.to }">
          {{ tab.name }}
        </v-tab>
      </template>
    </v-tabs>
  </v-card-title>
</template>
<script>
import { ref, defineComponent } from '@vue/composition-api'

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
    }
  },

  setup(props, context) {
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

    return { jobRunTabs: jobRunTabs.filter(item => item.show), currentJobRunTab }
  }
})
</script>
