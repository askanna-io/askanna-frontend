<template>
  <div>
    <v-toolbar v-if="!isJobRunPayloadEmpty" dense flat color="grey lighten-4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center">
          Payload
        </div>
        <div>
          <v-tooltip top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <v-btn
                small
                :disabled="loading || isJobRunPayloadEmpty"
                outlined
                v-on="on"
                color="secondary"
                class="mr-1 btn--hover"
                @click="handleDownload('raw')"
              >
                <v-icon color="secondary" left>mdi-download</v-icon>Raw
              </v-btn>
            </template>
            <span>Download raw</span>
          </v-tooltip>

          <v-tooltip top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :disabled="loading || isJobRunPayloadEmpty"
                small
                outlined
                color="secondary"
                class="mr-1 btn--hover"
                @click="handleDownload('formated')"
              >
                <v-icon color="secondary" left>mdi-download</v-icon>Formated
              </v-btn>
            </template>
            <span>Download formated</span>
          </v-tooltip>

          <v-tooltip top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                small
                :disabled="loading || isJobRunPayloadEmpty"
                outlined
                color="secondary"
                @click="handleCopy()"
                class="mr-1 btn--hover"
              >
                <v-icon left color="secondary">mdi-content-copy</v-icon>Copy
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
        </div>
      </v-flex>
    </v-toolbar>
    <v-flex>
      <ask-anna-loading-progress classes="mx-4 mb-4" :type="'table-row'" :loading="loading" fullWidth>
        <job-run-pay-load v-if="!isJobRunPayloadEmpty" :file="jobRunPayloadComputed" />
        <v-alert v-if="isJobRunPayloadEmpty" class="ma-4 text-center" color="grey" dense outlined>
          There is no input available for this run.
        </v-alert>
      </ask-anna-loading-progress>
    </v-flex>
  </div>
</template>
<script>
import JobRunPayLoad from './JobRunPayLoad.vue'
import useJobRunStore from '../../composition/useJobRunStore'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import { computed, defineComponent } from '@vue/composition-api'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress'

export default defineComponent({
  name: 'JobRunInput',

  components: {
    JobRunPayLoad,
    AskAnnaLoadingProgress
  },

  setup(props, context) {
    const snackBar = useSnackBar()
    const jobRunStore = useJobRunStore()
    const forceFileDownload = useForceFileDownload()

    const loading = computed(() => jobRunStore.payLoadLoading.value)
    const jobRunPayload = computed(() => jobRunStore.jobRunPayload.value)
    const jobRunPayloadComputed = computed(() => JSON.stringify(jobRunStore.jobRunPayload.value, null, 2))
    const isJobRunPayloadEmpty = computed(() => !jobRunPayload.value && !loading.value)

    const handleDownload = async formatType => {
      const { short_uuid } = jobRunStore.jobRun.value
      const formatOption = formatType === 'raw' ? null : 2
      const jrPayload = JSON.stringify(jobRunPayload.value, null, formatOption)

      forceFileDownload.trigger({ source: jrPayload, name: `run_${short_uuid}_payload.json` })
    }

    const handleCopy = () => {
      context.root.$copyText(jobRunPayloadComputed.value).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'failed' })
        }
      )
    }

    return {
      loading,
      handleCopy,
      handleDownload,
      isJobRunPayloadEmpty,
      jobRunPayloadComputed,
      jobRun: jobRunStore.jobRun.value
    }
  }
})
</script>
