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
        A project is where you can collaborate with your team, or yourself. You can house files, code, jobs, runs and
        all (meta) data related to running your projects.
      </p>
      <p>
        You can use a blank template, or you can choose one of the project templates that are available.
      </p>
      <p>
        Tip: via the AskAnna CLI, you can also create projects using the command line. You can do this via
        <ask-anna-copy-text :text="`askanna create ${projectName}`" />
        and follow the instructions in your terminal.
      </p></v-card-text
    >
    <v-divider />

    <project
      :projectData="projectData"
      :projectTemplates="projectTemplates"
      @handleOnInput="handleOnInput"
      @handleCreate="handleCreate"
      @handleCancel="handleCancel"
    />
  </v-card>
</template>

<script>
import Project from '@/features/project/components/Project'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import AskAnnaCopyText from '@/core/components/shared/AskAnnaCopyText'

import useProjectStore from '@/features/project/composition/useProjectStore'
import useWorkSpaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import { computed, reactive, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'new-project',

  components: { Project, AskAnnaCopyText },

  setup(props, context) {
    const projectStore = useProjectStore(context)
    const workSpaceStore = useWorkSpaceStore(context)

    onBeforeMount(async () => {
      projectStore.getProjectTemplates()
    })

    const projectName = computed(() =>
      projectStore.project.value.name ? `"${projectStore.project.value.name}"` : '"project name"'
    )

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
          name: 'workspace-project-package-new',
          params: { projectId: project.short_uuid, workspaceId: project.workspace.short_uuid, packageId: 'new-package' }
        })
      }
    }
    const handleCancel = data => {
      projectStore.resetProjectData()
      context.root.$router.go(-1)
    }

    return {
      projectName,
      projectTemplates: projectStore.projectTemplates,
      projectData: projectStore.project,
      handleOnInput,
      handleCreate,
      handleCancel,
      breadcrumbs
    }
  }
})
</script>
