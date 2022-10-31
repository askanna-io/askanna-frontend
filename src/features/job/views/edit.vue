<template>
  <div :class="{ 'pt-4': projectJobEdit }">
    <AskAnnaLoadingProgress v-if="projectJobEdit" :type="'table-row'" :loading="loading" fullWidth>
      <AskAnnaCard flat>
        <AskAnnaContainer class="ma-0 pt-0" fluid>
          <AskAnnaRow>
            <AskAnnaCol cols="12" sm="5">
              <AskAnnaTextField
                dense
                autofocus
                outlined
                required
                :value="jobState.name"
                label="Job name"
                :rules="[RULE.required('Job name is required')]"
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
                :description="jobState.description"
                :title="'Job description (optional)'"
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
                  :disabled="isStateNotChanged"
                  @click="handleShowConfirmationPopup"
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
        <confirm-change-job-name-popup
          :jobName="job.name"
          :value="showConfirmPopup"
          @onClose="handleClosePopup"
          @onConfirmChangeName="handleSave"
        />
      </AskAnnaCard>
    </AskAnnaLoadingProgress>
    <AskAnnaAlert v-else class="mx-4 text-center" dense outlined>
      You are not allowed to edit this job. I can bring you back to the job
      <router-link :to="{ name: 'workspace-project-job-overiew' }" class="ask-anna-link">{{ job.name }}</router-link
      >.
    </AskAnnaAlert>
  </div>
</template>

<script setup lang="ts">
import { set } from 'lodash'

const jobStore = useJobStore()
const snackBar = useSnackBar()
const { route, router } = useRouterAskAnna()
const permission = usePermission()
const validationRules = useValidationRules()

const { jobId } = route.params

const isNameChanged = ref(false)
const showConfirmPopup = ref(false)

const RULE = computed(() => validationRules.RULES)
const projectJobEdit = computed(() => permission.getFor(permission.labels.projectJobEdit))

const fetchData = async () => {
  await jobStore.$reset()
  await jobStore.getJob(jobId)
}

onBeforeMount(() => fetchData())

const job = computed(() => jobStore.job)
const loading = computed(() => jobStore.loading)

const isStateNotChanged = ref(true)
const jobState = ref({
  name: job.value.name,
  description: job.value.description
})

const handleOnInput = (value, path) => {
  isStateNotChanged.value = false
  if (path === 'name') isNameChanged.value = true
  set(jobState.value, path, value)
}

const handleOnChange = () => (isStateNotChanged.value = false)

const handleShowConfirmationPopup = () => {
  if (isNameChanged.value) {
    showConfirmPopup.value = true
    return
  }
  handleSave()
}

const handleSave = async () => {
  const isUpdated = await jobStore.updateJob({ ...jobState.value })
  if (isUpdated) {
    snackBar.showSnackBar({ message: 'The job was updated', color: 'success' })
    handleClose()
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
  router.push({
    name: 'workspace-project-job-overiew'
  })

watch(job, job => {
  jobState.value = {
    name: job.name,
    description: job.description
  }
})
</script>
