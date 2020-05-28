<template>
  <v-card-title>
    <span class="title">Job {{ jobName }}</span>
    <v-tabs v-model="currentTab" left align-with-title>
      <v-tabs-slider color="primary" />
      <template v-for="tab of jobTools">
        <v-tab
          v-if="tab.show"
          :key="tab.id"
          ripple
          :to="{ name: tab.to, params: { title: `${tab.name} - ${projectName}` } }"
        >
          {{ tab.name }}
        </v-tab>
      </template>
    </v-tabs>
  </v-card-title>
</template>
<script>
import { ref, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobToolBar',

  props: {
    projectName: {
      type: String,
      default: ''
    },
    jobName: {
      type: String,
      default: ''
    }
  },

  setup(props, context) {
    const currentTab = ref('job-overview')
    const jobTools = [
      {
        id: 0,
        name: 'Overview',
        show: !context.root.isNotBeta,
        to: 'workspace-project-job-overiew'
      },
      {
        id: 1,
        name: 'Runs',
        show: !context.root.isNotBeta,
        to: 'workspace-project-job-jobruns'
      },
      {
        id: 2,
        name: 'Variables & data',
        show: context.root.isNotBeta,
        to: 'workspace-project-job-variables'
      },

      {
        id: 3,
        name: 'Tokens',
        show: context.root.isNotBeta,
        to: 'workspace-project-job-tokens'
      }
    ]

    return { jobTools, currentTab }
  }
})
</script>
