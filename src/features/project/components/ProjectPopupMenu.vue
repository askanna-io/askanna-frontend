<template>
  <AskAnnaToolbarMenu
    :items="menuItems"
    @onClick="handleMenuClick"
  />

  <ProjectPopupDelete
    :projectName="project.name"
    :value="deleteProjectConfirmPopup"
    @onClose="handlCloseConfirmDeletePopup"
    @onDeleteConfirm="handleDeleteConfirmPorject"
  />
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
        created_at: '',
        stdout: null,
        finished_at: '',
        permission: {},
        return_payload: null
      }
    }
  },
  routeToRedirect: {
    type: String,
    default: () => ''
  }
})

const projectStore = useProjectStore()
const projectsStore = useProjectsStore()
const permission = useAskAnnaPermission()
const { routerPush } = useRouterAskAnna()

const deleteProjectConfirmPopup = ref(false)

const projectRemove = computed(() => props.project.permission[permission.labels.projectRemove])
const projectInfoEdit = computed(() => props.project.permission[permission.labels.projectInfoEdit])

const handleOpenConfirmDeleteProject = async () => (deleteProjectConfirmPopup.value = true)

const handlCloseConfirmDeletePopup = () => (deleteProjectConfirmPopup.value = false)

const handleOpenConfirmEditProject = () => {
  routerPush({
    name: 'workspace-project-edit',
    params: {
      projectId: props.project.suuid,
      workspaceId: props.project.workspace.suuid
    }
  })
}

const handleDeleteConfirmPorject = async () => {
  await projectStore.deleteProject(props.project)
  await projectsStore.getProjects()

  deleteProjectConfirmPopup.value = false

  if (props.routeToRedirect) {
    routerPush({ name: props.routeToRedirect })
  }
}

const menuItems = computed(() =>
  [
    {
      title: 'Edit project',
      isVisible: projectInfoEdit.value,
      onClick: handleOpenConfirmEditProject,
    },
    {
      color: 'text-error',
      title: 'Remove project',
      isVisible: projectRemove.value,
      onClick: handleOpenConfirmDeleteProject,
    },
  ].filter(el => el.isVisible)
)

const handleMenuClick = item => {
  if (item.onClick) {
    item.onClick()
  }
}
</script>