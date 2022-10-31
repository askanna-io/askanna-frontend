<template>
  <div class="text-center">
    <v-menu v-model="menu" rounded :close-on-content-click="false" left>
      <template v-slot:activator="{ on, attrs }">
        <AskAnnaButton icon v-bind="attrs" @click.stop.prevent="on.click" small>
          <AskAnnaIcon>mdi-dots-vertical</AskAnnaIcon>
        </AskAnnaButton>
      </template>
      <AskAnnaCard flat elevation="24" width="300">
        <AskAnnaToolbar flat height="40" class="secondary--text" color="white">
          <AskAnnaToolbarTitle class="pl-0">
            <span class="title font-weight-light">{{ project.name }}</span>
          </AskAnnaToolbarTitle>
          <AskAnnaSpacer />

          <AskAnnaButton icon @click.stop.prevent="handleClose" small>
            <AskAnnaIcon>mdi-close</AskAnnaIcon>
          </AskAnnaButton>
        </AskAnnaToolbar>
        <AskAnnaCardActions>
          <AskAnnaRow dense class="mx-2">
            <AskAnnaCol cols="12" v-if="projectInfoEdit">
              <AskAnnaButton
                text
                block
                small
                outlined
                color="secondary"
                class="btn--hover"
                @click="handleOpenConfirmEditProject"
              >
                Edit this project
              </AskAnnaButton>
            </AskAnnaCol>
            <AskAnnaCol cols="12" v-if="projectRemove">
              <AskAnnaButton
                block
                small
                outlined
                text
                color="error"
                class="btn--hover"
                @click="handleOpenConfirmDeleteProject"
              >
                Remove this project
              </AskAnnaButton>
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaCardActions>
      </AskAnnaCard>
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
const props = defineProps({
  project: {
    type: Object,
    default: function () {
      return {
        name: '',
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
