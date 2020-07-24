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
        <v-btn v-bind="attrs" v-on="on" small rounded color="primary" class="mr-3">
          <v-icon left>mdi-plus</v-icon>
          Create Project
        </v-btn>
      </template>
      <v-card>
        <v-col cols="12">
          <v-text-field
            v-model="projectName"
            autofocus
            @keyup.enter="menu = false"
            small
            dense
            hide-details
            outlined
            label="Project name"
          />
        </v-col>
        <v-card-actions>
          <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="menu = false">
            Create
          </v-btn>
          <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="handleMoreOptions">
            More options
          </v-btn>
          <v-btn small text class="mr-1" @click="menu = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { reactive, defineComponent } from '@vue/composition-api'
import useProjectStore from '@/features/project/composition/useProjectStore'

export default defineComponent({
  name: 'CreateProjectPopup',

  setup(props, context) {
    const projectStore = useProjectStore()

    const handleMoreOptions = () =>
      context.root.$router.push({
        name: 'workspace-new-project',
        params: { workspaceId: context.root.$route.params.workspaceId }
      })

    return {
      projectName: projectStore.projectName,
      menu: false,
      handleMoreOptions
    }
  }
})
</script>
