<template>
  <v-toolbar color="grey lighten-4" flat dense class="br-r5">
    <v-toolbar-title> {{ title }}</v-toolbar-title>
    <v-spacer />
    <v-spacer />
    <v-spacer />
    <v-spacer />

    <create-project-popup />

    <v-menu
      v-if="isNotBeta"
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
import CreateProjectPopup from '@/features/project/components/CreateProjectPopup'

import useWorkspaceStore from '../../composition/useWorkSpaceStore'
import { reactive, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspaceToolbar',

  props: {
    title: {
      type: String,
      default: ''
    }
  },

  components: { CreateProjectPopup },

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()

    const state = reactive({
      menu: false
    })

    const handleChangeProjectView = projectView => workspaceStore.changeSettings({ projectView })

    return {
      menu: state.menu,
      handleChangeProjectView
    }
  }
})
</script>
