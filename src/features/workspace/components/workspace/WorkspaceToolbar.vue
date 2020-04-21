<template>
  <v-toolbar color="grey lighten-4" flat dense class="br-r5">
    <v-toolbar-title>Workspace</v-toolbar-title>
    <v-spacer />
    <v-spacer />
    <template v-if="workspaces.results.length === 1">
      {{ workspaces.results[0].title }}
    </template>
    <v-select
      v-else
      class="select-workspace"
      v-model="workspaceVmodel"
      item-text="title"
      item-value="uuid"
      full-width
      color="primary"
      :items="workspaces.results"
      hide-details
      flat
      label="Solo field"
      dense
      solo
    />
    <v-spacer />

    <v-spacer />
    <v-btn v-if="isNotBeta" small rounded color="primary" class="mr-3">
      <v-icon left>mdi-plus</v-icon>
      Create Project
    </v-btn>

    <v-menu v-if="isNotBeta" v-model="state.menu" :close-on-content-click="false" :nudge-width="200" offset-x>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-subtitle>Workspace settings</v-card-subtitle>
        <v-card-subtitle>Project view</v-card-subtitle>
        <v-card-text>
          <v-btn-toggle v-model="projectView" mandatory>
            <v-btn>
              <v-icon>mdi-card-bulleted-outline</v-icon>
            </v-btn>

            <v-btn>
              <v-icon>mdi-format-align-justify</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>
<script>
import useWorkSpaceStore from '../../composition/useWorkSpaceStore'
import { watch, computed, reactive, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspaceToolbar',

  setup(props, context) {
    const workSpaceStore = useWorkSpaceStore()

    const state = reactive({
      menu: false
    })

    const workspaceVmodel = computed({
      get: () => {
        return workSpaceStore.workspace.value.uuid
      },
      set: uuid => {
        workSpaceStore.getWorkspace(uuid)
      }
    })

    const projectView = computed({
      get: () => {
        return workSpaceStore.workspaceSettings.value.projectView
      },
      set: projectView => {
        workSpaceStore.changeSettings({ projectView })
      }
    })

    return {
      state,
      projectView,
      workspaceVmodel,
      ...workSpaceStore
    }
  }
})
</script>
