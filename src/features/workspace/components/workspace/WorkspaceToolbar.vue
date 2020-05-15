<template>
  <v-toolbar color="grey lighten-4" flat dense class="br-r5">
    <v-toolbar-title> {{ title }}</v-toolbar-title>
    <v-spacer />
    <v-spacer />
    <v-spacer />
    <v-spacer />
    <v-btn v-if="isNotBeta" small rounded color="primary" class="mr-3">
      <v-icon left>mdi-plus</v-icon>
      Create Project
    </v-btn>

    <v-menu
      v-model="menu"
      class="workspace-menu"
      data-test="workspace-menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" data-test="workspace-menu-activate-btn">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-subtitle>Workspace settings</v-card-subtitle>
        <v-card-subtitle>Project view</v-card-subtitle>
        <v-card-text>
          <v-btn-toggle @change="handleChangeProjectView" mandatory>
            <v-btn>
              <v-icon>mdi-card-bulleted-outline</v-icon>
            </v-btn>

            <v-btn data-test="view-list">
              <v-icon>mdi-format-align-justify</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>
<script>
import useWorkspaceStore from '../../composition/useWorkspaceStore'
import { watch, computed, reactive, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspaceToolbar',

  props: {
    title: {
      type: String,
      default: ''
    }
  },

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()

    const state = reactive({
      menu: false
    })

    const workspaceVmodel = computed({
      get: () => {
        return workspaceStore.workspace.value.uuid
      },
      set: uuid => {
        workspaceStore.getWorkspace(uuid)
      }
    })

    const handleChangeProjectView = projectView => workspaceStore.changeSettings({ projectView })

    return {
      menu: state.menu,
      workspaceVmodel,
      handleChangeProjectView
    }
  }
})
</script>
