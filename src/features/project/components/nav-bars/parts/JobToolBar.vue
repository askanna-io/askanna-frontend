<template>
  <v-card-title>
    <span class="title font-weight-light">Job: {{ jobName }}</span>
    <v-tabs v-model="currentTab" left align-with-title>
      <v-tabs-slider color="primary" />

      <v-tab
        v-for="tab of jobTools"
        :key="tab.id"
        ripple
        :to="{ name: tab.to, params: { title: `${tab.name} - ${projectName}` } }"
      >
        {{ tab.name }}
      </v-tab>
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
        to: 'workspace-project-job-overiew'
      },
      {
        id: 1,
        name: 'Runs',
        to: 'workspace-project-job-jobruns'
      },
      {
        id: 2,
        name: 'Variables & data',
        to: 'workspace-project-job-variables'
      },

      {
        id: 3,
        name: 'Tokens',
        to: 'workspace-project-job-tokens'
      }
    ]

    return { jobTools, currentTab }
  }
})
</script>
