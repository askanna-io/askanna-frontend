<template>
  <div>
    <ask-anna-loading-progress v-if="projectRunEdit" classes="ma-4" :type="'table-row'" :loading="loading" fullWidth>
      <v-card flat>
        <v-container class="ma-0 pt-0" fluid>
          <v-row>
            <v-col cols="12" sm="5">
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
                <v-btn @click="handleClose" small outlined text color="secondary" class="btn--hover"> Cancel </v-btn>
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

<script setup lang="ts">
import { set } from 'lodash'
import { ref, watch, computed } from '@vue/composition-api'
import usePermission from '@/core/composition/usePermission'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import AskAnnaDescription from '@/core/components/shared/AskAnnaDescription.vue'

const snackBar = useSnackBar()
const router = useRouterAskAnna()
const permission = usePermission()
const jobRunStore = useJobRunStore()

const jobRun = computed(() => jobRunStore.state.jobRun.value)
const loading = computed(() => jobRunStore.state.jobRunLoading.value)
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

const handleSaveDescription = async () => {
  const isUpdated = await jobRunStore.udapteJobRun({
    uuid: jobRunStore.state.jobRun.value.short_uuid,
    data: { description: run.value.description }
  })

  if (isUpdated) {
    snackBar.showSnackBar({ message: 'The runifo was updated', color: 'success' })
  }
}

const handleSave = async () => {
  const isUpdated = await jobRunStore.udapteJobRun({
    uuid: jobRunStore.state.jobRun.value.short_uuid,
    data: run.value
  })
  if (isUpdated) {
    snackBar.showSnackBar({ message: 'The runifo was updated', color: 'success' })
    handleClose()
  }
}

const handleClose = () =>
  router.push({
    name: 'workspace-project-jobs-job-jobrun-overview'
  })

const handleOnChange = () => (isStateNotChanged.value = false)

watch(jobRun, jobRun => {
  run.value = {
    name: jobRun.name,
    description: jobRun.description
  }
})
</script>
