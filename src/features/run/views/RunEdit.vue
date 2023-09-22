<template>
  <AskAnnaLoadingProgress
    v-if="projectRunEdit"
    fullWidth
    :loading="loading"
  >
    <VForm
      @submit.prevent
      ref="formRef"
    >
      <div class="px-4">
        <div class="w-full sm:w-5/12 pb-2">
          <AskAnnaTextField
            required
            autofocus
            :model-value="run.name"
            label="Run name (optional)"
            @update:modelValue="handleOnInput($event, 'name')"
          />
        </div>
        <div class="w-full">
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
        </div>
        <AskAnnaCardActions class="pl-0 my-2">
          <AskAnnaButton
            type="submit"
            @click="handleSave"
            :disabled="isStateNotChanged"
          >
            Save my changes
          </AskAnnaButton>
          <AskAnnaButton @click="handleClose">
            Cancel
          </AskAnnaButton>
        </AskAnnaCardActions>
      </div>
    </VForm>
  </AskAnnaLoadingProgress>
  <AskAnnaAlert
    v-else
    class="mx-4 text-center"
    density="compact"
    variant="outlined"
  >
    You are not allowed to edit this run. I can bring you back toto the run
    <RouterLink
      :to="{ name: 'workspace-project-jobs-job-run-overview' }"
      class="askanna-link"
    >{{
      run.name || run.suuid
    }}</RouterLink>.
  </AskAnnaAlert>
</template>

<script setup lang="ts">
import { set } from 'lodash'

const runStore = useRunStore()
const snackBar = useSnackBar()
const permission = useAskAnnaPermission()
const { route, routerPush } = useRouterAskAnna()

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
  routerPush({
    name: 'workspace-project-jobs-job-run-overview',
    params: route.params

  })

const handleOnChange = () => (isStateNotChanged.value = false)

watch(run, run => {
  data.value = {
    name: run.name,
    description: run.description
  }
})
</script>
