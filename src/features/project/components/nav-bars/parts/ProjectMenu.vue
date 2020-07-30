<template>
  <v-tabs left align-with-title>
    <v-tabs-slider color="primary" optional />
    <template v-for="tab of projectTools">
      <v-tab
        v-if="tab.show"
        ripple
        :key="tab.id"
        :to="{ name: tab.to, params: { title: `${tab.name} - ${projectName}`, ...routerParams } }"
      >
        {{ tab.name }}
      </v-tab>
    </template>
  </v-tabs>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ProjectMenu',

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
        to: 'workspace-project-code',
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
        show: context.root.isNotBeta
      }
    ]

    return { projectTools: projectTools.filter(item => item.show), routerParams: context.root.$route.params }
  }
})
</script>
