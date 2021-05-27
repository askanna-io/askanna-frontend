<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="90"
      :nudge-bottom="5"
      :nudge-left="100"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" small rounded class="mr-3">
          <v-icon color="primary" left>mdi-plus</v-icon>
          Create Project
        </v-btn>
      </template>
      <v-card>
        <v-col cols="12">
          <v-text-field
            v-model="projectName"
            autofocus
            @keyup.enter="handlerCreateProject"
            small
            dense
            hide-details
            outlined
            label="Project name"
          />
        </v-col>
        <v-card-actions>
          <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="handlerCreateProject">
            Create
          </v-btn>
          <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="handleMoreOptions">
            More options
          </v-btn>
          <v-btn small outlined text class="mr-1" @click="handleCancel">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { ref, defineComponent } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useProjectStore from '@/features/project/composition/useProjectStore'

export default defineComponent({
  name: 'CreateProjectPopup',

  setup(_, context) {
    const projectStore = useProjectStore()
    const router = useRouterAskAnna(context)

    const menu = ref(false)

    projectStore.resetProjectData()

    const handleMoreOptions = () =>
      router.push({
        name: 'workspace-new-project',
        params: { workspaceId: context.root.$route.params.workspaceId }
      })

    const handlerCreateProject = async () => {
      await projectStore.createProjectShortWay(context.root.$route.params.workspaceId)
      menu.value = false
    }

    const handleCancel = () => {
      projectStore.resetProjectData()
      menu.value = false
    }

    return {
      menu,
      projectName: projectStore.projectName,
      handleCancel,
      handleMoreOptions,
      handlerCreateProject
    }
  }
})
</script>
