<template>
  <AskAnnaToolbarMenu
    :items="menuItems"
    @onClick="handleMenuClick"
  />

  <RunPopupDelete
    :runInfo="run"
    :value="deleteRunConfirmPopup"
    @onClose="handlCloseConfirmDeletePopup"
    @onDeleteConfirm="handleDeleteConfirmRun"
  />
</template>

<script setup lang="ts">
const runStore = useRunStore()
const { route, routerPush } = useRouterAskAnna()

const deleteRunConfirmPopup = ref(false)

const editRunRouteName = 'workspace-project-jobs-job-run-edit'

const menuItems = computed(() =>
  [
    {
      isVisible: true,
      title: 'Edit run info',
      onClick: handlerOpenEditRunPage,
      disabled: disabledButtonEditRun.value,
    },
    {
      disabled: false,
      isVisible: true,
      color: 'text-error',
      title: 'Remove this run',
      onClick: handleOpenConfirmDeleteRun,
    },
  ]
)


const run = computed(() => runStore.run)
const disabledButtonEditRun = computed(() => route.name === editRunRouteName)
const handlerOpenEditRunPage = async () => {
  routerPush({ name: editRunRouteName, params: route.params })
  handleClose()
}

const handleClose = () => {
}

const handleMenuClick = item => {
  if (item.onClick) {
    item.onClick()
  }
}

const handleOpenConfirmDeleteRun = async () => (deleteRunConfirmPopup.value = true)

const handlCloseConfirmDeletePopup = () => (deleteRunConfirmPopup.value = false)

const handleDeleteConfirmRun = async () => {
  const isDeleted = await runStore.deleteRunInfo(run.value)

  deleteRunConfirmPopup.value = false

  if (isDeleted) {
    routerPush({ name: 'workspace-project-jobs-job-runs-table', params: route.params })
  }
}
</script>
