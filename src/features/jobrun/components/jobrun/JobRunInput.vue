<template>
  <div class="px-4">
    <v-toolbar dense flat color="grey lighten-3">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center" @click="handleViewPayload">
          <v-btn x-small>Show preview</v-btn>
        </div>
        <div>
          <v-btn-toggle v-model="formatType" dense @change="handleDownload">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn value="raw" v-on="on">
                  <v-icon>mdi-cloud-download</v-icon>
                </v-btn>
              </template>
              <span>Download raw</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn value="formated" v-on="on">
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </template>
              <span>Download formated</span>
            </v-tooltip>
          </v-btn-toggle>

          <v-btn-toggle group class="pl-2" dense @change="handleViewPayload(jobRun)">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn value="raw" v-on="on">
                  <v-icon>mdi-file-outline</v-icon>
                </v-btn>
              </template>
              <span>View</span>
            </v-tooltip>
          </v-btn-toggle>
        </div>
      </v-flex>
    </v-toolbar>
    <v-expand-transition>
      <v-flex v-if="showPayload">
        <job-run-pay-load :file="jobRunPayloadComputed" />
      </v-flex>
    </v-expand-transition>
  </div>
</template>
<script>
import { JobRun } from '../../store/types'
import useJobRunStore from '../../composition/useJobRunStore'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

import JobRunPayLoad from '../JobRunPayLoad.vue'
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunInput',

  components: {
    JobRunPayLoad
  },

  setup(props, context) {
    const jobRunStore = useJobRunStore()
    const forceFileDownload = useForceFileDownload()

    const formatType = ref()
    const showPayload = ref(false)
    const jobRunPayloadComputed = computed(() => JSON.stringify(jobRunStore.jobRunPayload.value, null, 2))

    const handleDownload = async () => {
      const {
        short_uuid,
        payload: { uuid }
      } = jobRunStore.jobRun.value
      await jobRunStore.getJobRunPayload({ jobRunShortId: short_uuid, payloadUuid: uuid })

      const formatOption = formatType.value === 'raw' ? null : 2
      const jobRunPayload = JSON.stringify(jobRunStore.jobRunPayload.value, null, formatOption)

      forceFileDownload.trigger({ source: jobRunPayload, name: `payload-${uuid}.json` })

      formatType.value = null
    }

    const handleViewPayload = async () => {
      const {
        short_uuid,
        payload: { uuid }
      } = jobRunStore.jobRun.value

      showPayload.value = !showPayload.value
      if (!showPayload.value) return
      if (!jobRunStore.jobRunPayload.value) {
        await jobRunStore.getJobRunPayload({ jobRunShortId: short_uuid, payloadUuid: uuid })
      }

      const jobRunPayload = JSON.stringify(jobRunStore.jobRunPayload.value, null, 2)
    }

    return {
      formatType,
      showPayload,
      handleDownload,
      handleViewPayload,
      jobRunPayloadComputed,
      jobRun: jobRunStore.jobRun.value
    }
  }
})
</script>
