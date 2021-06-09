<template>
  <v-tabs left align-with-title>
    <v-tabs-slider color="primary" optional />
    <template v-for="tab of tabs">
      <v-tab
        v-if="tab.show"
        ripple
        :key="tab.id"
        @click="handleClick(tab.handler)"
        :to="{ name: tab.to, params: { title: `${tab.name} - ${projectName}`, ...routerParams, ...tab.params } }"
      >
        {{ tab.name }}
      </v-tab>
    </template>
  </v-tabs>
</template>
<script>
import { invoke } from 'lodash'
import { computed, defineComponent } from '@vue/composition-api'
import useProjectStore from '@project/composition/useProjectStore'
import usePackageStore from '@/features/package/composition/usePackageStore'

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
    const packageStore = usePackageStore()
    const projectStore = useProjectStore()

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
        show: !context.root.isNotBeta,
        params: { folderName: '' },
        handler: 'getProject'
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

    const projectId = computed(() => projectStore.project.value.short_uuid)
    const packageId = computed(() => projectStore.project.value.package.short_uuid)

    const tabs = computed(() => {
      const currentTabs = props.isEditProjectView ? projectEditTabs : projectTabs
      return currentTabs.filter(item => item.show)
    })

    const handlers = {
      getProject: async () => {
        if (!projectId.value) return
        await projectStore.getProject(context.root.$route.params.projectId)

        if (!packageId.value) return
        await packageStore.getPackage({
          loading: true,
          projectId: projectId.value,
          packageId: packageId.value
        })
      }
    }

    const handleClick = handler => invoke(handlers, handler)

    return { tabs, routerParams: context.root.$route.params, handleClick }
  }
})
</script>
