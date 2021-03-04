<template>
  <div class="px-4">
    <v-toolbar dense flat color="grey lighten-4" class="br-r4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center"></div>
        <div>
          <v-tooltip top>
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

          <v-tooltip top>
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
    <v-flex :style="scrollerStyles" class="mb-4 overflow-y-auto" id="scroll-target">
      <ask-anna-loading-progress
        :loading="loading"
        fullWidth
        transition="transition"
        height="94"
        type="list-item-two-line"
      >
        <the-highlight v-if="!logNoAvailable" :value="logs" v-scroll:#scroll-target="throttle(onScroll, 1500)" />
        <v-alert v-else class="my-2" dense outlined color="grey">
          No log entries are available for this job run.
        </v-alert>
      </ask-anna-loading-progress>
    </v-flex>
  </div>
</template>

<script>
import { throttle } from 'lodash'
import { useWindowSize } from '@u3u/vue-hooks'
import useQuery from '@/core/composition/useQuery'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import TheHighlight from '@/core/components/highlight/TheHighlight'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress'
import { computed, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunLog',

  components: {
    TheHighlight,
    AskAnnaLoadingProgress
  },

  setup(props, context) {
    const snackBar = useSnackBar()
    const { height } = useWindowSize()
    const jobRunStore = useJobRunStore()
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

    onBeforeMount(async () => {
      jobRunStore.resetJobRunLog()
      jobRunStore.getInitJobRunLog({ uuid: jobRunId.value, params: { limit: 200, offset: 0 } })
    })

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

    const onScroll = e => query.onScroll(e.target.scrollTop)

    const getFullJobRun = async () => {
      if (fullLog.value) return
      await jobRunStore.getFullVersionJobRunLog(jobRunId.value)
    }

    return {
      logs,
      loading,
      throttle,
      onScroll,
      handleCopy,
      logNoAvailable,
      scrollerStyles,
      handleDownload
    }
  }
})
</script>
