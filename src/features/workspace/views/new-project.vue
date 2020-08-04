<template>
  <v-card class="mx-auto" outlined>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.to" exact>
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-divider />
    <v-card-title>
      <v-icon large left>
        mdi-semantic-web
      </v-icon>
      <span class="title font-weight-light">Create a new project</span>
    </v-card-title>

    <v-card-text class="font-weight-bold">
      <p>
        A project is where you house your files (repository), plan your work (issues), and publish your documentation
        (wiki), among other things.
      </p>
      <p>
        All features are enabled for blank projects, from templates, or when importing, but you can disable them
        afterward in the project settings.
      </p>
      <p>
        To only use CI/CD features for an external repository, choose CI/CD for external repo. Information about
        additional Pages templates and how to install them can be found in our Pages getting started guide. Tip: You can
        also create a project from the command line.
      </p></v-card-text
    >
    <v-divider />

    <project
      :projectData="projectData"
      @handleOnInput="handleOnInput"
      @handleCreate="handleCreate"
      @handleCancel="handleCancel"
    />
  </v-card>
</template>

<script>
import Project from '@/features/project/components/Project'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useProjectStore from '@/features/project/composition/useProjectStore'
import useWorkSpaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import { computed, reactive, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'new-project',

  components: { Project },

  setup(props, context) {
    const projectStore = useProjectStore(context)
    const workSpaceStore = useWorkSpaceStore(context)

    const breadcrumbs = computed(() => [
      {
        title: workSpaceStore.workspace.value.title,
        to: `/${workSpaceStore.workspace.value.short_uuid}`,
        disabled: false
      },
      {
        title: 'Create new project',
        to: '',
        disabled: true
      }
    ])

    const handleOnInput = data => projectStore.setProject(data)
    const handleCreate = async data => {
      const project = await projectStore.createProjectFullWay(context.root.$route.params.workspaceId)

      if (project && project.short_uuid) {
        context.root.$router.push({
          name: 'workspace-project',
          params: { projectId: project.short_uuid, workspaceId: project.workspace.short_uuid }
        })
      }
    }
    const handleCancel = data => {
      projectStore.resetProjectData()
      context.root.$router.go(-1)
    }

    return {
      projectData: projectStore.project,
      handleOnInput,
      handleCreate,
      handleCancel,
      breadcrumbs
    }
  }
})
</script>
