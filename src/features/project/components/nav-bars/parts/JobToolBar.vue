<template>
  <v-card-title>
    <span v-if="showTitle" class="title font-weight-light">Job: {{ jobName }}</span>
    <v-tabs v-model="currentTab" left align-with-title>
      <v-tabs-slider color="primary" />
      <template v-for="tab of tabs">
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
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobToolBar',

  props: {
    projectName: {
      type: String,
      default: ''
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    jobName: {
      type: String,
      default: ''
    },
    isEditJobView: {
      type: Boolean,
      default: false
    }
  },

  setup(props, context) {
    const currentTab = ref('job-overview')

    const jobRunEditTabs = [
      {
        id: 0,
        name: 'Edit job',
        show: true,
        to: 'workspace-project-job-edit'
      }
    ]

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

    const tabs = computed(() => {
      const runTabs = props.isEditJobView ? jobRunEditTabs : jobTools
      return runTabs.filter(item => item.show)
    })

    return { tabs, currentTab }
  }
})
</script>
