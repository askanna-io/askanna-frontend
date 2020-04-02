<template>
  <div>
    <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="workspacesLoading">
      <v-data-iterator :items="workspaceProjects.results" hide-default-footer>
        <template v-slot:header>
          <v-toolbar color="grey lighten-4" flat dense class="br-r5">
            <v-toolbar-title>Workspace</v-toolbar-title>
            <v-spacer />
            <v-spacer />
            <v-select
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
            <v-btn small rounded color="primary" class="mr-3">
              <v-icon left>mdi-plus</v-icon>
              Create Project
            </v-btn>

            <v-menu v-model="state.menu" :close-on-content-click="false" :nudge-width="200" offset-x>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-card>
                <v-card-subtitle>Workspace settings</v-card-subtitle>
                <v-card-text>
                  ...
                </v-card-text>
                <v-card-subtitle>Project view</v-card-subtitle>
                <v-card-text>
                  <v-btn-toggle v-model="state.projectView" mandatory>
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

        <template v-slot:default="props">
          <v-skeleton-loader
            ref="skeleton"
            :loading="workspaceProjectsLoading"
            :transition="'scale-transition'"
            :type="'table-row'"
          >
            <v-row v-if="!state.projectView">
              <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="6" lg="4">
                <v-hover v-slot:default="{ hover }" open-delay="200">
                  <workspace-project-card-item :project="item" :hover="hover" :to="{ path: '/' }" />
                </v-hover>
              </v-col>
            </v-row>
            <div v-if="state.projectView">
              <div v-for="item in props.items" :key="item.name">
                <workspace-project-list-item :project="item" cols="12" />
                <v-divider />
              </div>
            </div>
          </v-skeleton-loader>
        </template>
      </v-data-iterator>
    </v-skeleton-loader>
    <ask-anna-divider text="Latest Activity" />
    <ask-anna-time-lines text="Latest Activity" />
  </div>
</template>
<script>
import useQuery from '@/core/composition/useQuery'
import useWorkSpaceStore from '../composition/useWorkSpaceStore'
import { watch, computed, reactive, onBeforeMount } from '@vue/composition-api'
import WorkspaceProjectCardItem from '../components/WorkspaceProjectCardItem'
import WorkspaceProjectListItem from '../components/WorkspaceProjectListItem'

export default {
  name: 'TheWorkspace',

  components: { WorkspaceProjectCardItem, WorkspaceProjectListItem },

  setup(props, context) {
    const query = useQuery()
    const workSpaceStore = useWorkSpaceStore()

    const state = reactive({
      menu: false,
      projectView: 0
    })

    const workspaceVmodel = computed({
      get: () => {
        return workSpaceStore.workspace.value.uuid
      },
      set: uuid => {
        workSpaceStore.getWorkspace(uuid)
      }
    })

    onBeforeMount(async () => {
      await workSpaceStore.getWorkspaces()
      let workspace = workSpaceStore.workspace.value

      if (!workspace.short_uuid) {
        ;[workspace] = workSpaceStore.workspaces.value.results
      }

      workSpaceStore.getWorkspace(workspace.uuid)
      workSpaceStore.getWorkpaceProjects(workspace.short_uuid)
    })

    return {
      state,
      workspaceVmodel,
      ...workSpaceStore
    }
  }
}
</script>
<style scoped>
.select-workspace {
  width: 300px;
}
</style>
