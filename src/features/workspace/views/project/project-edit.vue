<template>
  <ask-anna-loading-progress :type="'table-row'" :loading="loading">
    <v-card class="ma-2" flat>
      <project
        :projectData="projectState"
        :saveButtonText="'Save my changes'"
        :projectTemplates="projectTemplates"
        @handleCreate="handleUpdate"
        @handleCancel="handleCancel"
        @handleOnInput="handleOnInput"
      />
    </v-card>
  </ask-anna-loading-progress>
</template>

<script>
import { set } from 'lodash'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useProjectStore from '@/features/project/composition/useProjectStore'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import { ref, watch, computed, onBeforeMount, defineComponent } from '@vue/composition-api'

import Project from '@/features/project/components/Project'
import AskAnnaCopyText from '@/core/components/shared/AskAnnaCopyText'

export default defineComponent({
  name: 'project-edit',

  components: { Project, AskAnnaCopyText },

  setup(_, context) {
    const snackBar = useSnackBar()
    const workspaceStore = useWorkspaceStore()
    const projectStore = useProjectStore(context)

    const { routeBackTo = 'workspace-project' } = context.root.$route.params

    const project = computed(() => projectStore.project.value)
    const loading = computed(() => projectStore.projectLoading.value)

    const projectState = ref({
      name: project.value.name,
      description: project.value.description
    })

    const fetchData = async () => projectStore.getProjectTemplates()

    onBeforeMount(() => fetchData())

    const handleOnInput = ({ path, value }) => {
      set(projectState.value, path, value)
    }
    const handleUpdate = async () => {
      const project = await projectStore.updateProject(projectState.value)

      if (routeBackTo === 'workspace') {
        await workspaceStore.getInitialWorkpaceProjects({ params: { limit: 99, offset: 0 } })
      }
      if (project?.short_uuid) {
        snackBar.showSnackBar({ message: `The project ${project.name} was updated`, color: 'success', timeout: 2500 })
        handleCancel()
      }
    }
    const handleCancel = () => {
      context.root.$router.push({
        name: routeBackTo
      })
    }

    watch(project, project => {
      projectState.value = {
        name: project.name,
        description: project.description
      }
    })

    return {
      loading,
      projectState,
      projectTemplates: projectStore.projectTemplates,

      handleUpdate,
      handleCancel,
      handleOnInput
    }
  }
})
</script>
