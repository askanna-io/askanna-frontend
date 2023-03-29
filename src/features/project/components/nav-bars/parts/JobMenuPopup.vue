<template>
  <div class="text-center z-40">
    <VMenu
      v-model="menu"
      rounded
      :close-on-content-click="false"
      left
    >
      <template v-slot:activator="{ on, attrs }">
        <AskAnnaButton
          icon
          v-bind="attrs"
          @click.stop.prevent="on.click"
          small
        >
          <AskAnnaIcon>mdi-dots-vertical</AskAnnaIcon>
        </AskAnnaButton>
      </template>
      <AskAnnaCard
        flat
        elevation="24"
        width="300"
      >
        <AskAnnaToolbar
          flat
          height="40"
          class="secondary--text"
          color="white"
        >
          <AskAnnaToolbarTitle class="pl-0">
            <span class="title font-weight-light">{{ job.name || 'Job:' + job.suuid }}</span>
          </AskAnnaToolbarTitle>
          <AskAnnaSpacer />

          <AskAnnaButton
            icon
            @click.stop.prevent="handleClose"
            small
          >
            <AskAnnaIcon>mdi-close</AskAnnaIcon>
          </AskAnnaButton>
        </AskAnnaToolbar>

        <AskAnnaCardActions>
          <AskAnnaRow
            dense
            class="mx-2"
          >
            <AskAnnaCol cols="12">
              <AskAnnaButton
                text
                block
                small
                outlined
                class="btn--hover"
                @click="handlerOpenEditJobPage"
                :disabled="disabledButtonEditJob"
              >
                Edit job
              </AskAnnaButton>
            </AskAnnaCol>
            <AskAnnaCol cols="12">
              <AskAnnaButton
                small
                outlined
                text
                block
                color="error"
                class="btn--hover"
                @click="handleOpenConfirmDeleteJob"
              >Remove this job
              </AskAnnaButton>
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaCardActions>
      </AskAnnaCard>
    </VMenu>
    <ConfirmDeleteJobPopup
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
  routerPush({ name: editJobRouteName })
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
    routerPush({ name: 'workspace-project-jobs' })
  }
}
</script>
