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
              <ask-anna-description
                cleared
                outlined
                onInputMode
                :description="jobState.description"
                :title="'Run description (optional)'"
                @onChange="handleOnChange"
                @onChangeDescription="handleOnInput(handleClarifyDescription($event), 'description')"
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

<script lang="ts">
import { set } from 'lodash'
import useJobStore from '@/features/job/composition/useJobStore'
import usePermission from '@/core/composition/usePermission'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useValidationRules from '@/core/composition/useValidationRules'
import ConfirmChangeJobNamePopup from '@/features/job/components/popup/ConfirmChangeJobNamePopup.vue'

import { ref, watch, computed, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  components: { ConfirmChangeJobNamePopup },

  setup(_, context) {
    const jobStore = useJobStore()
    const snackBar = useSnackBar()
    const permission = usePermission()
    const validationRules = useValidationRules()

    const { jobId } = context.root.$route.params

    const isNameChanged = ref(false)
    const showConfirmPopup = ref(false)

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
    const handleChangeDescription = data => jobStore.changeJob(data)

    const handleClarifyDescription = val => val.replace('<p></p>', '')

    const handleClosePopup = () => {
      showConfirmPopup.value = false
    }
    const handleClose = () =>
      context.root.$router.push({
        name: 'workspace-project-job-overiew'
      })

    watch(job, job => {
      jobState.value = {
        name: job.name,
        description: job.description
      }
    })

    return {
      job,
      loading,
      jobState,
      projectJobEdit,
      showConfirmPopup,
      isStateNotChanged,
      RULE: validationRules.RULES,

      handleSave,
      handleClose,
      handleOnInput,
      handleOnChange,
      handleClosePopup,
      handleChangeDescription,
      handleClarifyDescription,
      handleShowConfirmationPopup
    }
  }
})
</script>
