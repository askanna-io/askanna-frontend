<template>
  <div>
    <v-toolbar v-if="!logNoAvailable" dense flat color="grey lighten-4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center"></div>
        <div>
          <v-tooltip top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :disabled="loading || logNoAvailable"
                small
                outlined
                color="secondary"
                class="mr-1 btn--hover"
                @click="handleDownload()"
              >
                <v-icon left color="secondary">mdi-download</v-icon>Download
              </v-btn>
            </template>
            <span>Download</span>
          </v-tooltip>

          <v-tooltip top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :disabled="loading || logNoAvailable"
                small
                outlined
                color="secondary"
                class="mr-1 btn--hover"
                @click="handleCopy()"
              >
                <v-icon left color="secondary">mdi-content-copy</v-icon>Copy
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
        </div>
      </v-flex>
    </v-toolbar>
    <v-flex :style="scrollerStyles" class="overflow-y-auto" id="scroll-target">
      <ask-anna-loading-progress
        :loading="loading"
        fullWidth
        height="94"
        classes="mx-4 mb-4"
        transition="transition"
        type="list-item-two-line"
      >
        <div v-if="!logNoAvailable" class="logs-wrapper">
          <the-highlight
            ref="logRef"
            :value="logs"
            :loading="!isFinished"
            v-scroll:#scroll-target="throttle(onScroll, 1500)"
          />
          <ask-anna-loading-dots-flashing v-if="!isFinished" />
        </div>

        <v-alert v-else class="ma-4 text-center" dense outlined color="grey">
          There is no log available for this run.
        </v-alert>
      </ask-anna-loading-progress>
    </v-flex>
  </div>
</template>

<script>
import goTo from 'vuetify/lib/services/goto'

import { throttle } from 'lodash'
import { useWindowSize } from '@u3u/vue-hooks'
import useQuery from '@/core/composition/useQuery'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useJobStore from '@/features/job/composition/useJobStore'
import TheHighlight from '@/core/components/highlight/TheHighlight'

import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress'
import AskAnnaLoadingDotsFlashing from '@/core/components/shared/AskAnnaLoadingDotsFlashing'
import { ref, watch, computed, onBeforeMount, onUnmounted, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunLog',

  components: {
    TheHighlight,
    AskAnnaLoadingProgress,
    AskAnnaLoadingDotsFlashing
  },

  setup(_, context) {
    const jobStore = useJobStore()
    const snackBar = useSnackBar()
    const { height } = useWindowSize()
    const jobRunStore = useJobRunStore()

    const logRef = ref(null)
    const polling = ref(null)

    const jobRunStatus = computed(() => jobStore.jobrun.value.status)
    const isFinished = computed(() => jobRunStatus.value === 'failed' || jobRunStatus.value === 'finished')

    const next = computed(() => jobRunStore.jobRunLog.value.next)
    const jobRunId = computed(() => context.root.$route.params.jobRunId)

    const query = useQuery({
      next,
      limit: 100,
      offset: 200,
      uuid: jobRunId.value,
      storeAction: jobRunStore.getJobRunLog
    })
    const forceFileDownload = useForceFileDownload()

    const logs = computed(() => {
      if (!jobRunStore.jobRunLog.value.results) return ''

      const reducer = (acc, cr) => {
        acc = acc + `${cr[2]} \n`
        return acc
      }
      const result = jobRunStore.jobRunLog.value.results.length
        ? jobRunStore.jobRunLog.value.results.reduce(reducer, ``)
        : ''

      return result
    })

    const fullLog = computed(() => {
      if (!jobRunStore.jobRunLogFullVersion.value) return ''

      const reducer = (acc, cr) => {
        acc = acc + `${cr[2]} \n`
        return acc
      }
      const result = jobRunStore.jobRunLogFullVersion.value.length
        ? jobRunStore.jobRunLogFullVersion.value.reduce(reducer, ``)
        : ''

      return result
    })

    const maxHeight = computed(() => height.value - 270)
    const scrollerStyles = computed(() => {
      return { 'max-height': `${maxHeight.value}px` }
    })
    const loading = computed(() => jobRunStore.jobRunlogLoading.value)
    const logNoAvailable = computed(() => !jobRunStore.jobRunLog.value.results.length && !loading.value)

    const handleCopy = async () => {
      await getFullJobRun()
      context.root.$copyText(fullLog.value).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'failed' })
        }
      )
    }

    const handleDownload = async () => {
      await getFullJobRun()

      forceFileDownload.trigger({ source: fullLog.value, name: `run_${jobRunStore.jobRun.value.short_uuid}_log.txt` })
    }

    const onScroll = e => {
      if (!isFinished.value) return

      query.onScroll(e.target.scrollTop)
    }

    const getFullJobRun = async () => {
      if (fullLog.value && isFinished.value) return
      await jobRunStore.getFullVersionJobRunLog(jobRunId.value)
    }

    const checkLogs = async () => {
      polling.value = setInterval(async () => {
        await jobRunStore.getJobRunLog({
          uuid: jobRunId.value,
          params: { limit: 1000, offset: jobRunStore.jobRunLog.value.results.length }
        })
        // scroll window and log container to bottom
        goTo(logRef.value.$el.scrollHeight)
        goTo(logRef.value.$el.scrollHeight, { container: '#scroll-target' })

        if (logNoAvailable.value || isFinished.value) {
          clearInterval(polling.value)
        }
      }, 5000)
    }

    const fetchData = async () => {
      await jobRunStore.resetJobRunLog()
      await jobRunStore.getInitJobRunLog({ uuid: jobRunId.value, params: { limit: 200, offset: 0 } })
      await checkLogs()
    }

    onBeforeMount(() => fetchData())

    watch(jobRunStatus, (jobRunStatus, jobRunStatusOld) => {
      if (!jobRunStatusOld && isFinished.value) jobRunStatus && isFinished.value && clearInterval(polling.value)
    })

    onUnmounted(() => {
      clearInterval(polling.value)
    })

    return {
      logs,
      logRef,
      loading,
      throttle,
      onScroll,
      isFinished,

      handleCopy,
      logNoAvailable,
      scrollerStyles,
      handleDownload
    }
  }
})
</script>
<style scoped lang="scss">
.logs-wrapper {
  position: relative;
}
</style>
