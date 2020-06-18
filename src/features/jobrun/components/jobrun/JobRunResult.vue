<template>
  <div class="px-4">
    <v-toolbar dense flat color="grey lighten-3" class="br-r4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center"></div>
        <div>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn small outlined v-on="on" color="secondary" class="mr-1" @click="handleDownload()">
                <v-icon color="secondary">mdi-download</v-icon>
              </v-btn>
            </template>
            <span>Download</span>
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
    <v-flex :style="scrollerStyles" class="mb-4 overflow-y-auto" id="scroll-target">
      <v-skeleton-loader
        v-if="!resultNoAvailable"
        :loading="loading"
        transition="transition"
        height="94"
        type="list-item-two-line"
      >
        <prism-editor v-scroll:#scroll-target="onScroll" :code="jobRunResult" readonly line-numbers />
      </v-skeleton-loader>

      <v-alert v-if="resultNoAvailable" class="my-2" dense outlined type="warning" border="left">
        No log entries are available for this job run
      </v-alert>
    </v-flex>
  </div>
</template>
<script>
import PrismEditor from 'vue-prism-editor'
import { JobRun } from '../../store/types'
import { useWindowSize } from '@u3u/vue-hooks'

import useJobRunStore from '../../composition/useJobRunStore'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

import { computed, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunResult',

  components: { PrismEditor },

  setup(props, context) {
    const { height } = useWindowSize()
    const jobRunStore = useJobRunStore()
    const forceFileDownload = useForceFileDownload()

    const jobRunResult = computed(() => {
      if (!jobRunStore.jobRunResult.value.data) return ''

      const result = jobRunStore.jobRunResult.value.data.length
        ? JSON.stringify(jobRunStore.jobRunResult.value.data, null, 2)
        : ''
      return result
    })

    const loading = computed(
      () => jobRunStore.jobRunResult.value.data && jobRunStore.jobRunResult.value.data.length === 0
    )
    const resultNoAvailable = computed(() => jobRunStore.jobRunResult.value === null)

    onBeforeMount(async () => {
      const { jobRunId } = context.root.$route.params

      jobRunStore.getJobRunResult(jobRunId)
    })

    const maxHeight = computed(() => height.value - 270)
    const scrollerStyles = computed(() => {
      return { 'max-height': `${maxHeight.value}px` }
    })

    const handleCopy = () => {
      context.root.$copyText(jobRunResult.value).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
        }
      )
    }

    const handleDownload = () =>
      forceFileDownload.trigger({
        source: jobRunResult.value,
        name: `${jobRunStore.jobRun.value.short_uuid}_result.txt`
      })

    const onScroll = e => {}

    return {
      loading,
      resultNoAvailable,
      jobRunResult,
      scrollerStyles,

      onScroll,
      handleCopy,
      handleDownload
    }
  }
})
</script>
