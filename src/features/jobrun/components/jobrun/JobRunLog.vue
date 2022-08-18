<template>
  <div>
    <v-toolbar v-if="!logNoAvailable" dense flat color="grey lighten-4">
      <v-flex class="d-flex">
        <ask-anna-chip-play-stop
          v-if="!isFinished && jobRunStatus"
          :value="isAutoUpdateLog"
          @onClick="handleAutoUpdate"
        />

        <div class="mr-auto d-flex align-center"></div>
        <div>
          <v-tooltip v-if="!$vuetify.breakpoint.xsOnly" top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                small
                outlined
                color="secondary"
                class="mr-1 btn--hover"
                @click="handleDownload()"
                :disabled="loading || logNoAvailable"
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
                small
                outlined
                color="secondary"
                class="mr-1 btn--hover"
                @click="handleCopy()"
                :disabled="loading || logNoAvailable"
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
        fullWidth
        height="94"
        :loading="loading"
        classes="mx-4 mb-4"
        transition="transition"
        type="list-item-two-line"
      >
        <div v-if="!logNoAvailable" class="logs-wrapper">
          <TheHighlight
            ref="logRef"
            :value="logs"
            :loading="isLoadingLogs"
            v-scroll:#scroll-target="throttle(onScroll, 1500)"
          />
          <ask-anna-loading-dots-flashing v-if="isLoadingLogs" />
        </div>

        <v-alert v-else class="ma-4 text-center" dense outlined>There is no log available for this run. </v-alert>
      </ask-anna-loading-progress>
    </v-flex>
  </div>
</template>

<script setup lang="ts">
import { throttle } from 'lodash'
import goTo from 'vuetify/lib/services/goto'
import useCopy from '@/core/composition/useCopy'
import useQuery from '@/core/composition/useQuery'
import { useJobStore } from '@/features/job/useJobStore'
import { useRouter, useWindowSize } from '@u3u/vue-hooks'
import TheHighlight from '@/core/components/highlight/TheHighlight.vue'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import AskAnnaChipPlayStop from '@/core/components/shared/AskAnnaChipPlayStop.vue'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'
import { ref, watchEffect, computed, onBeforeMount, onUnmounted } from '@vue/composition-api'
import AskAnnaLoadingDotsFlashing from '@/core/components/shared/AskAnnaLoadingDotsFlashing.vue'

const copy = useCopy()
const { route } = useRouter()
const jobStore = useJobStore()
const { height } = useWindowSize()
const jobRunStore = useJobRunStore()
const forceFileDownload = useForceFileDownload()

const logRef = ref(null)
const polling = ref(null)
const scrollLoading = ref(false)
const isAutoUpdateLog = ref(true)
const isCheckStatusRuning = ref(false)

const jobRunStatus = computed(() => jobStore.run.status)
const isFinished = computed(() => jobRunStatus.value === 'failed' || jobRunStatus.value === 'finished')

const isLoadingLogs = computed(
  () => (!isFinished.value || scrollLoading.value) && jobRunStatus.value && isAutoUpdateLog.value
)

const next = computed(() => jobRunStore.state.jobRunLog.value.next)
const jobRunId = computed(() => route.value.params.jobRunId)

const query = useQuery({
  next,
  limit: 100,
  offset: 200,
  uuid: jobRunId.value,
  storeAction: jobRunStore.actions.getJobRunLog
})

const countLogs = computed(() => jobRunStore.state.jobRunLog.value.count)
const logs = computed(() => {
  if (!jobRunStore.state.jobRunLog.value.results) return ''

  const reducer = (acc, cr) => {
    acc = acc + `${cr[2]} \n`
    return acc
  }
  const result = jobRunStore.state.jobRunLog.value.results.length
    ? jobRunStore.state.jobRunLog.value.results.reduce(reducer, ``)
    : ''

  return result
})

const fullLog = computed(() => {
  if (!jobRunStore.state.jobRunLogFullVersion.value) return ''

  const reducer = (acc, cr) => {
    acc = acc + `${cr[2]} \n`
    return acc
  }
  const result = jobRunStore.state.jobRunLogFullVersion.value.length
    ? jobRunStore.state.jobRunLogFullVersion.value.reduce(reducer, ``)
    : ''

  return result
})

const maxHeight = computed(() => height.value - 270)
const loading = computed(() => jobRunStore.state.jobRunlogLoading.value)
const scrollerStyles = computed(() => ({ 'max-height': `${maxHeight.value}px` }))
const logNoAvailable = computed(() => !jobRunStore.state.jobRunLog.value.results.length && !loading.value)

const handleAutoUpdate = () => {
  scrollLoading.value = true
  isAutoUpdateLog.value = !isAutoUpdateLog.value
}

const handleCopy = async () => {
  await getFullJobRun()
  copy.handleCopyText(fullLog.value)
}

const handleDownload = async () => {
  await getFullJobRun()

  forceFileDownload.trigger({ source: fullLog.value, name: `run_${jobRunStore.state.jobRun.value.short_uuid}_log.txt` })
}

const onScroll = e => {
  if (!isFinished.value) return

  scrollLoading.value = true
  query.onScroll(e.target.scrollTop)
}

const getFullJobRun = async () => {
  if (fullLog.value && isFinished.value) return

  await jobRunStore.actions.getFullVersionJobRunLog(jobRunId.value)
}

const checkLogs = () => {
  polling.value = setInterval(async () => {
    if (!isAutoUpdateLog.value) return
    // scroll window and log container to bottom
    await jobRunStore.actions.getJobRunLog({
      uuid: jobRunId.value,
      params: { limit: 1000, offset: jobRunStore.state.jobRunLog.value.results.length }
    })
    goTo(logRef.value.$el.scrollHeight)
    goTo(logRef.value.$el.scrollHeight, { container: '#scroll-target' })

    if (logNoAvailable.value || isFinished.value) {
      clearInterval(polling.value)
    }
  }, 5000)
}

const fetchData = async () => {
  await jobRunStore.actions.resetJobRunLog()
  await jobRunStore.actions.getInitJobRunLog({ uuid: jobRunId.value, params: { limit: 200, offset: 0 } })
}

onBeforeMount(() => fetchData())

watchEffect(() => {
  // check status, eneable auto-update logs
  if (!isCheckStatusRuning.value && jobRunStatus.value && !isFinished.value) {
    checkLogs()
    isCheckStatusRuning.value = true
  }

  // disable load animation logic
  if (isFinished.value && countLogs.value === jobRunStore.state.jobRunLog.value.results.length) {
    scrollLoading.value = false
    isAutoUpdateLog.value = false
    isCheckStatusRuning.value = true

    return
  }
})

onUnmounted(() => {
  clearInterval(polling.value)
  isCheckStatusRuning.value = false
})
</script>
<style scoped lang="scss">
.logs-wrapper {
  position: relative;
}
</style>
