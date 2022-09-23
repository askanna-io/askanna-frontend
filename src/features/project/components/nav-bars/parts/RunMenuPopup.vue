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
            <span class="title font-weight-light">{{ run.name || 'Run: ' + run.short_uuid }}</span>
          </v-toolbar-title>
          <v-spacer />

          <v-btn icon @click.stop.prevent="handleClose" small>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-actions>
          <v-row dense class="mx-2">
            <v-col cols="12">
              <v-btn
                text
                block
                small
                outlined
                class="btn--hover"
                @click="handlerOpenEditRunPage"
                :disabled="disabledButtonEditRun"
              >
                Edit run info
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn small outlined text block color="error" class="btn--hover" @click="handleOpenConfirmDeleteRun"
                >Remove this run
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-menu>
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
const { route, router } = useRouterAskAnna()

const menu = ref(false)
const deleteRunConfirmPopup = ref(false)

const editRunRouteName = 'workspace-project-jobs-job-run-edit'

const run = computed(() => runStore.run)
const disabledButtonEditRun = computed(() => route.name === editRunRouteName)
const handlerOpenEditRunPage = async () => {
  router.push({ name: editRunRouteName })
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
    router.push({ name: 'workspace-project-jobs-job-runs-table' })
  }
}
</script>