<template>
  <v-tabs left align-with-title>
    <v-tabs-slider color="primary" optional />
    <template v-for="tab of tabs">
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
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ProjectMenu',

  props: {
    projectName: {
      type: String,
      default: ''
    },
    isEditProjectView: {
      type: Boolean,
      default: false
    }
  },

  setup(props, context) {
    const projectEditTabs = [
      {
        id: 0,
        name: 'Edit project',
        to: 'workspace-project-edit',
        show: true
      }
    ]

    const projectTabs = [
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
        name: 'Variables',
        to: 'workspace-project-variables',
        show: !context.root.isNotBeta
      },

      {
        id: 4,
        name: 'Documentation',
        to: 'workspace-project-documentation',
        show: context.root.isNotBeta
      }
    ]

    const tabs = computed(() => {
      const currentTabs = props.isEditProjectView ? projectEditTabs : projectTabs
      return currentTabs.filter(item => item.show)
    })

    return { tabs, routerParams: context.root.$route.params }
  }
})
</script>
