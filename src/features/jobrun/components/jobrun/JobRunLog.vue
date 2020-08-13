<template>
  <div class="px-4">
    <v-toolbar dense flat color="grey lighten-3" class="br-r4">
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
                class="mr-1"
                @click="handleDownload()"
              >
                <v-icon color="secondary">mdi-download</v-icon>
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
                @click="handleCopy()"
              >
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
        v-if="!logNoAvailable"
        :loading="loading"
        transition="transition"
        height="94"
        type="list-item-two-line"
      >
        <prism-editor v-scroll:#scroll-target="throttle(onScroll, 1000)" :code="logs" readonly line-numbers />
      </v-skeleton-loader>
      <v-alert v-if="logNoAvailable" class="my-2" dense outlined color="grey">
        No log entries are available for this job run.
      </v-alert>
    </v-flex>
  </div>
</template>

<script>
import { throttle } from 'lodash'
import PrismEditor from 'vue-prism-editor'
import { useWindowSize } from '@u3u/vue-hooks'
import useQuery from '@/core/composition/useQuery'
import useMoment from '@/core/composition/useMoment'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import { reactive, computed, onBeforeMount, defineComponent } from '@vue/composition-api'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

export default defineComponent({
  name: 'JobRunLog',

  components: {
    PrismEditor
  },

  setup(props, context) {
    const snackBar = useSnackBar()
    const moment = useMoment(context)
    const { height } = useWindowSize()
    const jobRunStore = useJobRunStore()
    const jobRunId = computed(() => context.root.$route.params.jobRunId)
    const query = useQuery({
      offset: 100,
      limit: 100,
      store: jobRunStore,
      uuid: jobRunId.value,
      action: 'getJobRunLog',
      queryPath: 'jobRunLog'
    })
    const forceFileDownload = useForceFileDownload()

    onBeforeMount(async () => {
      if (jobRunId.value === jobRunStore.jobRun.value.short_uuid) return

      jobRunStore.getInitJobRunLog({ uuid: jobRunId.value, params: { limit: 100, offset: 0 } })
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
    const logNoAvailable = computed(() => jobRunStore.jobRunLog.value.results === null && !loading.value)

    const handleCopy = async () => {
      await getFullJobRun()
      context.root.$copyText(fullLog.value).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
        }
      )
    }

    const handleDownload = async () => {
      await getFullJobRun()

      forceFileDownload.trigger({ source: fullLog.value, name: `${jobRunStore.jobRun.value.short_uuid}_log.txt` })
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
