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
          <v-row dense class="mx-2">
            <v-col cols="12" v-if="projectInfoEdit">
              <v-btn
                text
                block
                small
                outlined
                color="secondary"
                class="btn--hover"
                @click="handleOpenConfirmEditProject"
              >
                Edit this project
              </v-btn>
            </v-col>
            <v-col cols="12" v-if="projectRemove">
              <v-btn block small outlined text color="error" class="btn--hover" @click="handleOpenConfirmDeleteProject">
                Remove this project
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-menu>
    <confirm-delete-project-popup
      :projectName="project.name"
      :value="deleteProjectConfirmPopup"
      @onClose="handlCloseConfirmDeletePopup"
      @onDeleteConfirm="handleDeleteConfirmPorject"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from '@vue/composition-api'
import usePermission from '@/core/composition/usePermission'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { useProjectsStore } from '@/features/projects/useProjectsStore'
import useProjectStore from '@/features/project/composition/useProjectStore'
import ConfirmDeleteProjectPopup from '@/features/project/components/popup/ConfirmDeleteProjectPopup.vue'

const props = defineProps({
  project: {
    type: Object,
    default: function () {
      return {
        runtime: 0,
        memory: 0,
        created: '',
        stdout: null,
        finished: '',
        permission: {},
        return_payload: null
      }
    }
  },
  routeToRedirect: {
    type: String,
    default: () => ''
  },
  routeBackTo: {
    type: String,
    default: () => 'workspace'
  }
})

const router = useRouterAskAnna()
const permission = usePermission()
const projectStore = useProjectStore()
const projectsStore = useProjectsStore()

const menu = ref(false)
const deleteProjectConfirmPopup = ref(false)

const projectRemove = computed(() => props.project.permission[permission.labels.projectRemove])
const projectInfoEdit = computed(() => props.project.permission[permission.labels.projectInfoEdit])

const handleOpenConfirmDeleteProject = async () => (deleteProjectConfirmPopup.value = true)

const handlCloseConfirmDeletePopup = () => (deleteProjectConfirmPopup.value = false)

const handleClose = () => (menu.value = false)

const handleOpenConfirmEditProject = () =>
  router.router.push({
    name: 'workspace-project-edit',
    params: {
      routeBackTo: props.routeBackTo,
      projectId: props.project.short_uuid,
      workspaceId: props.project.workspace.short_uuid
    }
  })

const handleDeleteConfirmPorject = async () => {
  await projectStore.deleteProject(props.project)
  await projectsStore.getProjects()

  deleteProjectConfirmPopup.value = false

  menu.value = false

  if (props.routeToRedirect) {
    router.push({ name: props.routeToRedirect })
  }
}
</script>
