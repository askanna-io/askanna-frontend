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
            <span class="title font-weight-light">{{ run.name || 'Run: ' + run.suuid }}</span>
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
                @click="handlerOpenEditRunPage"
                :disabled="disabledButtonEditRun"
              >
                Edit run info
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
                @click="handleOpenConfirmDeleteRun"
              >Remove this run
              </AskAnnaButton>
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaCardActions>
      </AskAnnaCard>
    </VMenu>
    <ConfirmDeleteRunPopup
      :runInfo="run"
      :value="deleteRunConfirmPopup"
      @onClose="handlCloseConfirmDeletePopup"
      @onDeleteConfirm="handleDeleteConfirmRun"
    />
  </div>
</template>

<script setup lang="ts">
const runStore = useRunStore()
const { route, routerPush } = useRouterAskAnna()

const menu = ref(false)
const deleteRunConfirmPopup = ref(false)

const editRunRouteName = 'workspace-project-jobs-job-run-edit'

const run = computed(() => runStore.run)
const disabledButtonEditRun = computed(() => route.name === editRunRouteName)
const handlerOpenEditRunPage = async () => {
  routerPush({ name: editRunRouteName })
  handleClose()
}

const handleClose = () => {
  menu.value = false
}

const handleOpenConfirmDeleteRun = async () => (deleteRunConfirmPopup.value = true)

const handlCloseConfirmDeletePopup = () => (deleteRunConfirmPopup.value = false)

const handleDeleteConfirmRun = async () => {
  const isDeleted = await runStore.deleteRunInfo(run.value)

  deleteRunConfirmPopup.value = false
  menu.value = false

  if (isDeleted) {
    routerPush({ name: 'workspace-project-jobs-job-runs-table' })
  }
}
</script>
