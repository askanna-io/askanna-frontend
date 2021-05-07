<template>
  <div class="text-center">
    <v-menu v-model="menu" rounded :close-on-content-click="false" left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" @click.stop.prevent="on.click" small>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-card flat elevation="24" width="300">
        <v-toolbar flat height="40" class="secondary--text" color="white">
          <v-toolbar-title class="pl-0">
            <span class="title font-weight-light">{{ project.name }}</span>
          </v-toolbar-title>
          <v-spacer />

          <v-btn icon @click.stop.prevent="handleClose" small>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-actions>
          <v-btn block small outlined text color="error" class="btn--hover" @click="handleOpenConfirmDeleteProject">
            Remove this project
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <confirm-delete-project-popup
      :value="deleteProjectConfirmPopup"
      :projectName="project.name"
      @onClose="handlCloseConfirmDeletePopup"
      @onDeleteConfirm="handleDeleteConfirmPorject"
    />
  </div>
</template>

<script>
import { ref, computed, defineComponent } from '@vue/composition-api'
import useProjectStore from '@/features/project/composition/useProjectStore'
import ConfirmDeleteProjectPopup from '@/features/project/components/popup/ConfirmDeleteProjectPopup'

export default defineComponent({
  name: 'ProjectMenuPopup',

  components: {
    ConfirmDeleteProjectPopup
  },

  props: {
    project: {
      type: Object,
      default: function () {
        return {
          runtime: 0,
          memory: 0,
          created: '',
          stdout: null,
          finished: '',
          return_payload: null
        }
      }
    },
    routeToRedirect: {
      type: String,
      default: () => ''
    }
  },

  setup(props, context) {
    const projectStore = useProjectStore()

    const menu = ref(false)
    const deleteProjectConfirmPopup = ref(false)

    const handleMoreOptions = () =>
      context.root.$router.push({
        name: 'workspace-new-project',
        params: { workspaceId: context.root.$route.params.workspaceId }
      })

    const handleOpenConfirmDeleteProject = async () => {
      deleteProjectConfirmPopup.value = true
    }

    const handlCloseConfirmDeletePopup = () => {
      deleteProjectConfirmPopup.value = false
    }

    const handleClose = () => {
      menu.value = false
    }

    const handleDeleteConfirmPorject = async () => {
      await projectStore.deleteProject(props.project)
      deleteProjectConfirmPopup.value = false
      menu.value = false
      if (props.routeToRedirect) {
        context.root.$router.push({ name: props.routeToRedirect })
      }
    }

    return {
      menu,
      handleClose,
      handleMoreOptions,
      deleteProjectConfirmPopup,
      handleDeleteConfirmPorject,
      handlCloseConfirmDeletePopup,
      handleOpenConfirmDeleteProject,
      projectName: projectStore.projectName
    }
  }
})
</script>
