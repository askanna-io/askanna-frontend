<template>
  <AskAnnaLoadingProgress
    v-if="projectJobEdit"
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
            autofocus
            required
            label="Job name"
            :model-value="jobState.name"
            :rules="[RULE.required('Job name is required')]"
            @update:modelValue="handleOnInput($event, 'name')"
          />
        </div>
        <div class="w-full">
          <AskAnnaDescription
            cleared
            outlined
            :height="480"
            :description="jobState.description"
            :title="'Job description (optional)'"
            @onChange="handleOnChange"
            @onSave="handleSaveDescription"
            @onChangeDescription="handleOnInput($event, 'description')"
          />
        </div>

        <AskAnnaCardActions class="pl-0 my-2">
          <AskAnnaButton
            type="submit"
            :disabled="isStateNotChanged"
            @click="handleShowConfirmationPopup"
          >
            Save my changes
          </AskAnnaButton>
          <AskAnnaButton @click="handleClose">
            Cancel
          </AskAnnaButton>
        </AskAnnaCardActions>
      </div>
    </VForm>

    <JobPopupChangeName
      :jobName="job.name"
      :value="showConfirmPopup"
      @onClose="handleClosePopup"
      @onConfirmChangeName="handleSave"
    />
  </AskAnnaLoadingProgress>
  <AskAnnaAlert
    v-else
    class="mx-2 my-4"
  >
    You are not allowed to edit this job. I can bring you back to the job
    <RouterLink
      :to="{ name: 'workspace-project-job-overiew' }"
      class="askanna-link"
    >{{ job.name }}</RouterLink>.
  </AskAnnaAlert>
</template>

<script setup lang="ts">
import { set } from 'lodash'

const jobStore = useJobStore()
const snackBar = useSnackBar()
const permission = useAskAnnaPermission()
const validationRules = useValidationRules()
const { route, routerPush } = useRouterAskAnna()

const formRef = ref(null)
const isNameChanged = ref(false)
const showConfirmPopup = ref(false)

const job = computed(() => jobStore.job)
const loading = computed(() => jobStore.loading)
const isStateNotChanged = ref(true)
const jobState = ref({
  name: job.value.name,
  description: job.value.description
})

const RULE = computed(() => validationRules.RULES)
const projectJobEdit = computed(() => permission.getFor(permission.labels.projectJobEdit))

const resetValidation = () => formRef?.value.resetValidation()


const handleOnInput = (value, path) => {
  isStateNotChanged.value = false
  if (path === 'name') {
    isNameChanged.value = job.value.name !== value
  }
  set(jobState.value, path, value)
}

const handleOnChange = () => (isStateNotChanged.value = false)

const handleShowConfirmationPopup = async () => {
  const { valid } = await formRef.value?.validate()

  if (!valid) {
    return
  }

  if (isNameChanged.value) {
    showConfirmPopup.value = true
    return
  }
  handleSave()
  resetValidation()
}

const handleSave = async () => {
  const isUpdated = await jobStore.updateJob({ ...jobState.value })
  if (isUpdated) {
    snackBar.showSnackBar({ message: 'The job was updated', color: 'success' })
    handleClose()
    resetValidation()
  }
}

const handleSaveDescription = async () => {
  const isUpdated = await jobStore.updateJob({ description: jobState.value.description })
  if (isUpdated) {
    snackBar.showSnackBar({ message: 'The job was updated', color: 'success' })
  }
}

const handleClosePopup = () => {
  showConfirmPopup.value = false
}
const handleClose = () =>
  routerPush({
    name: 'workspace-project-job-overiew',
    params: route.params
  })

watch(job, job => {
  jobState.value = {
    name: job.name,
    description: job.description
  }
})
</script>
