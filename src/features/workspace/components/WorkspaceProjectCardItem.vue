<template>
  <v-card
    class="mx-auto h-100"
    :elevation="hover ? 16 : 2"
    :to="{
      name: 'workspace-project-package',
      params: {
        title: `${project.name} - ${workspaceName}`,
        projectId: project.short_uuid,
        packageId: (project.package && project.package.short_uuid) || 'new-package'
      }
    }"
  >
    <v-toolbar flat dense white--text color="white" class="AskAnna-app-bar">
      <v-toolbar-title class="pl-4 pt-5 title font-weight-light">
        <v-icon large>
          mdi-semantic-web
        </v-icon>
        {{ project.name }}
      </v-toolbar-title>
      <v-spacer />

      <project-menu-popup :project="project" />
    </v-toolbar>

    <v-card-text class="font-weight-bold project--description">
      {{ description }}
    </v-card-text>
    <template v-if="isNotBeta">
      <v-card-actions>
        <v-alert text dense type="success" class="d-flex mb-0">
          Last run on <strong>Oct 23, 2019</strong> was <strong>successfull</strong>
        </v-alert>
      </v-card-actions>
      <v-card-actions class="px-5">
        <v-hover v-slot:default="{ hover }" open-delay="200" v-for="n in 5" :key="n">
          <v-avatar
            :class="`elevation-${hover ? 16 : 2}`"
            class="mx-auto transition-swing"
            size="35"
            color="grey "
            :hover="hover"
            :to="`/workspace/project/${project.short_uuid}`"
          >
            <img src="https://randomuser.me/api/portraits/men/81.jpg" />
          </v-avatar>
        </v-hover>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import ProjectMenuPopup from '@/features/project/components/ProjectMenuPopup'

export default defineComponent({
  name: 'WorkspaceProjectCardItem',

  components: {
    ProjectMenuPopup
  },

  props: {
    project: {
      type: Object,
      default: function () {
        return {
          status: 'UNDIFENED',
          runtime: 0,
          memory: 0,
          return_payload: null,
          stdout: null,
          created: '',
          finished: ''
        }
      }
    },
    description: {
      type: String,
      default: () => ''
    },
    workspaceName: {
      type: String,
      default: () => ''
    },
    hover: {
      type: Boolean,
      default: false
    }
  }
})
</script>
<style scoped>
.h-100 {
  height: 100%;
}
.project--description {
  min-height: 82px;
  max-height: 86px;
  overflow: hidden;
}
</style>
