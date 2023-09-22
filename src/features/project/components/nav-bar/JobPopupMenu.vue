<template>
  <div>
    <AskAnnaToolbarMenu
      :items="menuItems"
      @onClick="handleMenuClick"
    />
    <JobPopupDelete
      :jobName="job.name"
      :value="deleteJobConfirmPopup"
      @onClose="handlCloseConfirmDeletePopup"
      @onDeleteConfirm="handleDeleteConfirmJob"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  job: {
    type: Object,
    default: function () {
      return {
        name: '',
        suuid: '',
        description: ''
      }
    }
  }
})

const jobStore = useJobStore()
const { route, routerPush } = useRouterAskAnna()

const menu = ref(false)
const deleteJobConfirmPopup = ref(false)

const editJobRouteName = 'workspace-project-job-edit'

const disabledButtonEditJob = computed(() => route.name === editJobRouteName)

const handlerOpenEditJobPage = async () => {
  routerPush({ name: editJobRouteName, params: route.params })
  handleClose()
}

const handleOpenConfirmDeleteJob = async () => (deleteJobConfirmPopup.value = true)

const handlCloseConfirmDeletePopup = () => (deleteJobConfirmPopup.value = false)

const handleClose = () => (menu.value = false)

const handleDeleteConfirmJob = async () => {
  const isDeleted = await jobStore.deleteJob(props.job)

  deleteJobConfirmPopup.value = false
  menu.value = false
  if (isDeleted) {
    routerPush({ name: 'workspace-project-jobs', params: route.params })
  }
}

const menuItems = computed(() =>
  [
    {
      title: 'Edit job',
      isVisible: true,
      disabled: disabledButtonEditJob.value,
      onClick: handlerOpenEditJobPage,
    },
    {
      isVisible: true,
      color: 'text-error',
      title: 'Remove job',
      onClick: handleOpenConfirmDeleteJob,
    },
  ]
)

const handleMenuClick = item => {
  if (item.onClick) {
    item.onClick()
  }
}
</script>
