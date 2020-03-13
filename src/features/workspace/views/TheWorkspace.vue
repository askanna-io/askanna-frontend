<template>
  <div>
    <v-data-iterator :items="projects" hide-default-footer>
      <template v-slot:header>
        <v-toolbar color="grey lighten-4" flat dense class="br-r5">
          <v-toolbar-title>Workspace</v-toolbar-title>
          <v-spacer />
          <v-btn small rounded color="primary" class="mr-3">
            <v-icon left>mdi-plus</v-icon>
            Create Project
          </v-btn>
          <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
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
      <template v-slot:default="props">
        <v-row v-if="!projectView">
          <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="6" lg="4">
            <v-hover v-slot:default="{ hover }" open-delay="200">
              <workspace-project-card-item :project="item" :hover="hover" :to="{ path: '/' }" />
            </v-hover>
          </v-col>
        </v-row>
        <div v-if="projectView">
          <div v-for="item in props.items" :key="item.name">
            <workspace-project-list-item :project="item" cols="12" />
            <v-divider />
          </div>
        </div>
      </template>
    </v-data-iterator>
    <ask-anna-divider text="Latest Activity" />
    <ask-anna-time-lines text="Latest Activity" />
  </div>
</template>

<script>
import useProject from '../../project/composition/useProject'
import { onBeforeMount } from '@vue/composition-api'

import WorkspaceProjectCardItem from '../components/WorkspaceProjectCardItem'
import WorkspaceProjectListItem from '../components/WorkspaceProjectListItem'
export default {
  name: 'TheWorkspace',

  components: { WorkspaceProjectCardItem, WorkspaceProjectListItem },

  setup(props, context) {
    const project = useProject()

    onBeforeMount(() => {
      project.getProjects()
    })

    return {
      ...project
    }
  },

  data() {
    return {
      menu: false,
      projectView: 0,
      workspace: 'Workspace 2',
      selection: 2,
      items: ['Workspace 1', 'Workspace 2', 'Workspace 3']
    }
  },

  methods: {}
}
</script>
