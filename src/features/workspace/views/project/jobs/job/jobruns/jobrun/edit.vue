<template>
  <div :class="{ 'pb-5': projectJobEdit }">
    <ask-anna-loading-progress v-if="projectRunEdit" classes="ma-4" :type="'table-row'" :loading="loading" fullWidth>
      <v-card flat>
        <v-container class="ma-0 ml-1 pt-0" fluid>
          <v-row>
            <v-col cols="5">
              <v-text-field
                dense
                autofocus
                outlined
                required
                :value="run.name"
                label="Run name (optional)"
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
                :description="run.description"
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
                  @click="handleSave"
                  :disabled="isStateNotChanged"
                >
                  Save my changes
                </v-btn>
                <v-btn @click="handleClose" small outlined text color="secondary" class="btn--hover">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </ask-anna-loading-progress>
    <v-alert v-else class="mx-4 text-center" dense outlined>
      You are not allowed to edit this run. I can bring you back toto the run
      <router-link :to="{ name: 'workspace-project-jobs-job-jobrun-overview' }" class="ask-anna-link">{{
        jobRun.name || jobRun.short_uuid
      }}</router-link
      >.
    </v-alert>
  </div>
</template>

<script>
import { set } from 'lodash'
import usePermission from '@/core/composition/usePermission'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, watch, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const snackBar = useSnackBar()
    const permission = usePermission()
    const router = useRouterAskAnna()
    const jobRunStore = useJobRunStore()

    const jobRun = computed(() => jobRunStore.jobRun.value)
    const loading = computed(() => jobRunStore.jobRunLoading.value)
    const projectRunEdit = computed(() => permission.getFor(permission.labels.projectRunEdit))

    const isStateNotChanged = ref(true)
    const run = ref({
      name: jobRun.value.name,
      description: jobRun.value.description
    })

    const handleOnInput = (value, path) => {
      isStateNotChanged.value = false
      set(run.value, path, value)
    }

    const handleSave = async () => {
      const isUpdated = await jobRunStore.udapteJobRun({ uuid: jobRunStore.jobRun.value.short_uuid, data: run.value })
      if (isUpdated) {
        snackBar.showSnackBar({ message: 'The runifo was updated', color: 'success' })
        handleClose()
      }
    }

    const handleClose = () =>
      router.push({
        name: 'workspace-project-jobs-job-jobrun-overview'
      })

    const hadnleOpenJobRun = () => {
      router.push({
        name: 'workspace-project-jobs-job-jobrun'
      })
    }

    const handleOnChange = () => (isStateNotChanged.value = false)
    const handleClarifyDescription = val => val.replace('<p></p>', '')

    watch(jobRun, jobRun => {
      run.value = {
        name: jobRun.name,
        description: jobRun.description
      }
    })

    return {
      run,
      jobRun,
      loading,
      projectRunEdit,
      isStateNotChanged,

      handleSave,
      handleClose,
      handleOnInput,
      handleOnChange,
      hadnleOpenJobRun,
      handleClarifyDescription
    }
  }
})
</script>
