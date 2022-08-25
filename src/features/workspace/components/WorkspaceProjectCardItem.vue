<template>
  <v-card
    class="mx-auto h-100"
    :elevation="hover ? 16 : 2"
    :to="{
      name: 'workspace-project-code',
      params: {
        title: `${project.name} - ${workspaceName}`,
        projectId: project.short_uuid,
        workspaceId: project.workspace.short_uuid,
        packageId: (project.package && project.package.short_uuid) || ''
      }
    }"
  >
    <v-toolbar flat dense white--text color="white" class="AskAnna-app-bar">
      <v-toolbar-title
        class="title font-weight-light"
        :class="{ 'px-0 pt-2 pr-0': $vuetify.breakpoint.xsOnly, 'pl-4 pt-5': !$vuetify.breakpoint.xsOnly }"
      >
        <v-icon large> mdi-semantic-web </v-icon>
        {{ project.name }}
      </v-toolbar-title>
      <v-spacer />

      <project-menu-popup v-if="projectInfoEdit" :project="project" :routeBackTo="routeBackTo" />
    </v-toolbar>

    <v-card-text class="font-weight-bold project--description">
      {{ description }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from '@vue/composition-api'
import usePermission from '@/core/composition/usePermission'
import ProjectMenuPopup from '@/features/project/components/ProjectMenuPopup.vue'

const props = defineProps({
  project: {
    type: Object,
    default: function () {
      return {
        name: '',
        memory: 0,
        description: '',
        permission: {},
        runtime: 0,
        created: '',
        stdout: null,
        finished: '',
        status: 'UNDIFENED',
        return_payload: null
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
  },
  routeBackTo: {
    type: String,
    default: () => 'workspace'
  }
})

const permission = usePermission()
const projectInfoEdit = computed(
  () => props.project.permission && props.project.permission[permission.labels.projectInfoEdit]
)
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
