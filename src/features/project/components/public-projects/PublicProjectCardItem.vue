<template>
  <v-card
    class="mx-auto h-100"
    :elevation="hover ? 16 : 2"
    :to="{
      name: 'workspace-project-code',
      params: {
        title: `${project.name} - ${workspaceName}`,
        projectId: project.short_uuid,
        packageId: (project.package && project.package.short_uuid) || ''
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

      <project-menu-popup v-if="projectInfoEdit" :project="project" />
    </v-toolbar>

    <v-card-text class="font-weight-bold project--description">
      {{ description }}
    </v-card-text>
  </v-card>
</template>

<script>
import usePermission from '@/core/composition/usePermission'
import { computed, defineComponent } from '@vue/composition-api'
import ProjectMenuPopup from '@/features/project/components/ProjectMenuPopup'

export default defineComponent({
  name: 'PublicProjectCardItem',

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
  },

  setup() {
    const permission = usePermission()
    const projectInfoEdit = computed(() => permission.getFor(permission.labels.projectInfoEdit))

    return { projectInfoEdit }
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
