<template>
  <div :class="{ 'pt-4': projectJobEdit }">
    <ask-anna-loading-progress v-if="projectJobEdit" :type="'table-row'" :loading="loading" fullWidth>
      <v-card flat>
        <v-container class="ma-0 pt-0" fluid>
          <v-row>
            <v-col cols="12" sm="5">
              <v-text-field
                dense
                autofocus
                outlined
                required
                :value="jobState.name"
                label="Job name"
                :rules="[RULE.required('Job name is required')]"
                @input="handleOnInput($event, 'name')"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="pt-0">
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
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0">
              <v-card-actions class="pl-0">
                <v-btn
                  text
                  small
                  outlined
                  color="secondary"
                  class="mr-1 btn--hover"
                  :disabled="isStateNotChanged"
                  @click="handleShowConfirmationPopup"
                >
                  Save my changes
                </v-btn>
                <v-btn @click="handleClose" small outlined text color="secondary" class="btn--hover"> Cancel </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
        <confirm-change-job-name-popup
          :jobName="job.name"
          :value="showConfirmPopup"
          @onClose="handleClosePopup"
          @onConfirmChangeName="handleSave"
        />
      </v-card>
    </ask-anna-loading-progress>
    <v-alert v-else class="mx-4 text-center" dense outlined>
      You are not allowed to edit this job. I can bring you back to the job
      <router-link :to="{ name: 'workspace-project-job-overiew' }" class="ask-anna-link">{{ job.name }}</router-link
      >.
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { set } from 'lodash'
import usePermission from '@/core/composition/usePermission'
import useJobStore from '@/features/job/composition/useJobStore'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useValidationRules from '@/core/composition/useValidationRules'
import { ref, watch, computed, onBeforeMount } from '@vue/composition-api'
import AskAnnaDescription from '@/core/components/shared/AskAnnaDescription.vue'
import ConfirmChangeJobNamePopup from '@/features/job/components/popup/ConfirmChangeJobNamePopup.vue'

const jobStore = useJobStore()
const snackBar = useSnackBar()
const router = useRouterAskAnna()
const permission = usePermission()
const validationRules = useValidationRules()

const { jobId } = router.route.value.params

const isNameChanged = ref(false)
const showConfirmPopup = ref(false)

const RULE = computed(() => validationRules.RULES)
const projectJobEdit = computed(() => permission.getFor(permission.labels.projectJobEdit))

const fetchData = async () => {
  await jobStore.resetStore()
  await jobStore.getJob(jobId)
}

onBeforeMount(() => fetchData())

const job = computed(() => jobStore.job.value)
const loading = computed(() => jobStore.jobLoading.value)

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
