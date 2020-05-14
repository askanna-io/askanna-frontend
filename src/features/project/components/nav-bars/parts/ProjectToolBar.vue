<template>
  <v-card-title transition="slide-y-transition">
    <span class="title font-weight-light">Project: {{ projectName }}</span>
    <v-tabs left align-with-title>
      <v-tabs-slider color="primary" optional />
      <template v-for="tab of projectTools">
        <v-tab
          v-if="tab.show"
          ripple
          :key="tab.id"
          :to="{ name: tab.to, params: { title: `${tab.name} - ${projectName}` } }"
        >
          {{ tab.name }}
        </v-tab>
      </template>
    </v-tabs>
  </v-card-title>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ProjectToolBar',

  props: {
    projectName: {
      type: String,
      default: ''
    }
  },

  setup(props, context) {
    const projectTools = [
      {
        id: 0,
        name: 'Activity',
        to: 'workspace-project-activity',
        show: context.root.isNotBeta
      },
      {
        id: 1,
        name: 'Code',
        to: 'workspace-project-packages',
        show: !context.root.isNotBeta
      },
      {
        id: 2,
        name: 'Jobs',
        to: 'workspace-project-jobs',
        show: !context.root.isNotBeta
      },

      {
        id: 3,
        name: 'Documentation',
        to: 'workspace-project-documentation',
        show: !context.root.isNotBeta
      }
    ]

    return { projectTools: projectTools.filter(item => item.show) }
  }
})
</script>
