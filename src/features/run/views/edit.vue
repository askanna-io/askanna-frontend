<template>
  <div>
    <AskAnnaLoadingProgress v-if="projectRunEdit" classes="ma-4" :type="'table-row'" :loading="loading" fullWidth>
      <AskAnnaCard flat>
        <AskAnnaContainer class="ma-0 pt-0" fluid>
          <AskAnnaRow>
            <AskAnnaCol cols="12" sm="5">
              <AskAnnaTextField
                dense
                autofocus
                outlined
                required
                :value="run.name"
                label="Run name (optional)"
                @input="handleOnInput($event, 'name')"
              />
            </AskAnnaCol>
          </AskAnnaRow>
          <AskAnnaRow>
            <AskAnnaCol cols="12" class="pt-0">
              <AskAnnaDescription
                cleared
                outlined
                :height="480"
                :description="run.description"
                :title="'Run description (optional)'"
                @onChange="handleOnChange"
                @onSave="handleSaveDescription"
                @onChangeDescription="handleOnInput($event, 'description')"
              />
            </AskAnnaCol>
          </AskAnnaRow>
          <AskAnnaRow>
            <AskAnnaCol class="pt-0">
              <AskAnnaCardActions class="pl-0">
                <AskAnnaButton
                  text
                  small
                  outlined
                  color="secondary"
                  class="mr-1 btn--hover"
                  @click="handleSave"
                  :disabled="isStateNotChanged"
                >
                  Save my changes
                </AskAnnaButton>
                <AskAnnaButton @click="handleClose" small outlined text color="secondary" class="btn--hover">
                  Cancel
                </AskAnnaButton>
              </AskAnnaCardActions>
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaContainer>
      </AskAnnaCard>
    </AskAnnaLoadingProgress>
    <AskAnnaAlert v-else class="mx-4 text-center" dense outlined>
      You are not allowed to edit this run. I can bring you back toto the run
      <router-link :to="{ name: 'workspace-project-jobs-job-run-overview' }" class="ask-anna-link">{{
        run.name || run.suuid
      }}</router-link
      >.
    </AskAnnaAlert>
  </div>
</template>

<script setup lang="ts">
import { set } from 'lodash'

const runStore = useRunStore()
const snackBar = useSnackBar()
const permission = usePermission()
const { router } = useRouterAskAnna()

const run = computed(() => runStore.run)
const loading = computed(() => runStore.runLoading)
const projectRunEdit = computed(() => permission.getFor(permission.labels.projectRunEdit))

const isStateNotChanged = ref(true)
const data = ref({
  name: run.value.name,
  description: run.value.description
})

const handleOnInput = (value, path) => {
  isStateNotChanged.value = false
  set(data.value, path, value)
}

const handleSaveDescription = async () => {
  const isUpdated = await runStore.udapteRun({
    suuid: runStore.run.suuid,
    data: { description: run.value.description }
  })

  if (isUpdated) {
    snackBar.showSnackBar({ message: 'The runifo was updated', color: 'success' })
  }
}

const handleSave = async () => {
  const isUpdated = await runStore.udapteRun({
    suuid: runStore.run.suuid,
    data: data.value
  })
  if (isUpdated) {
    snackBar.showSnackBar({ message: 'The runifo was updated', color: 'success' })
    handleClose()
  }
}

const handleClose = () =>
  router.push({
    name: 'workspace-project-jobs-job-run-overview'
  })

const handleOnChange = () => (isStateNotChanged.value = false)

watch(run, run => {
  data.value = {
    name: run.name,
    description: run.description
  }
})
</script>
