<template>
  <div class="px-4">
    <v-toolbar dense flat color="grey lighten-3" class="br-r4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center">
          Payload
        </div>
        <div>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn small outlined v-on="on" color="secondary" class="mr-1" @click="handleDownload('raw')">
                <v-icon color="secondary" left>mdi-download</v-icon>Raw
              </v-btn>
            </template>
            <span>Download raw</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" small outlined color="secondary" class="mr-1" @click="handleDownload('formated')">
                <v-icon color="secondary" left>mdi-download</v-icon>Formated
              </v-btn>
            </template>
            <span>Download formated</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn small v-on="on" outlined color="secondary" @click="handleCopy()">
                <v-icon color="secondary">mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
        </div>
      </v-flex>
    </v-toolbar>
    <v-flex class="mb-4">
      <v-skeleton-loader :loading="loading" transition="transition" height="94" type="list-item-two-line">
        <job-run-pay-load :file="jobRunPayloadComputed" />
      </v-skeleton-loader>
    </v-flex>
  </div>
</template>
<script>
import { JobRun } from '../../store/types'
import JobRunPayLoad from '../JobRunPayLoad.vue'
import useJobRunStore from '../../composition/useJobRunStore'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunInput',

  components: {
    JobRunPayLoad
  },

  setup(props, context) {
    const snackBar = useSnackBar()
    const jobRunStore = useJobRunStore()
    const forceFileDownload = useForceFileDownload()

    const showPayload = ref(false)

    const jobRunPayloadComputed = computed(() => JSON.stringify(jobRunStore.jobRunPayload.value, null, 2))

    const loading = computed(() => jobRunStore.jobRunPayload.value === '')

    const handleDownload = async formatType => {
      const {
        short_uuid,
        payload: { uuid }
      } = jobRunStore.jobRun.value
      await jobRunStore.getJobRunPayload({ jobRunShortId: short_uuid, payloadUuid: uuid })

      const formatOption = formatType === 'raw' ? null : 2
      const jobRunPayload = JSON.stringify(jobRunStore.jobRunPayload.value, null, formatOption)

      forceFileDownload.trigger({ source: jobRunPayload, name: `payload-${uuid}.json` })
    }

    const handleViewPayload = async () => {
      const {
        short_uuid,
        payload: { uuid }
      } = jobRunStore.jobRun.value

      if (!jobRunStore.jobRunPayload.value) {
        await jobRunStore.getJobRunPayload({ jobRunShortId: short_uuid, payloadUuid: uuid })
      }
      loading.value = false
    }

    const handleCopy = () => {
      context.root.$copyText(jobRunPayloadComputed.value).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
        }
      )
    }

    return {
      loading,
      handleCopy,
      handleDownload,
      jobRunPayloadComputed,
      jobRun: jobRunStore.jobRun.value
    }
  }
})
</script>
