<template>
  <div>
    <AskAnnaToolbar v-if="!logNoAvailable" dense flat color="grey lighten-4">
      <AskAnnaFlex class="d-flex">
        <AskAnnaChipPlayStop v-if="!isFinished && runStatus" :value="isAutoUpdateLog" @onClick="handleAutoUpdate" />

        <div class="mr-auto d-flex align-center"></div>
        <div>
          <AskAnnaTooltip v-if="!$vuetify.breakpoint.xsOnly" top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <AskAnnaButton
                v-on="on"
                small
                outlined
                color="secondary"
                class="mr-1 btn--hover"
                @click="handleDownload()"
                :disabled="loading || logNoAvailable"
              >
                <AskAnnaIcon left color="secondary">mdi-download</AskAnnaIcon>Download
              </AskAnnaButton>
            </template>
            <span>Download</span>
          </AskAnnaTooltip>

          <AskAnnaTooltip top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <AskAnnaButton
                v-on="on"
                small
                outlined
                color="secondary"
                class="mr-1 btn--hover"
                @click="handleCopy()"
                :disabled="loading || logNoAvailable"
              >
                <AskAnnaIcon left color="secondary">mdi-content-copy</AskAnnaIcon>Copy
              </AskAnnaButton>
            </template>
            <span>Copy</span>
          </AskAnnaTooltip>
        </div>
      </AskAnnaFlex>
    </AskAnnaToolbar>
    <AskAnnaFlex :style="scrollerStyles" class="overflow-y-auto" id="scroll-target">
      <AskAnnaLoadingProgress
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
            :loading="isLoadingLogs || isThreeDotsLoading"
            v-scroll:#scroll-target="throttle(onScroll, 1500)"
          />
          <AskAnnaLoadingDotsFlashing v-if="isLoadingLogs || isThreeDotsLoading" />
        </div>

        <AskAnnaAlert v-else class="ma-4 text-center" dense outlined
          >There is no log available for this run.
        </AskAnnaAlert>
      </AskAnnaLoadingProgress>
    </AskAnnaFlex>
  </div>
</template>

<script setup lang="ts">
import { throttle } from 'lodash'
import goTo from 'vuetify/lib/services/goto'

const copy = useCopy()
const runStore = useRunStore()
const { height } = useWindowSize()
const { route } = useRouterAskAnna()
const forceFileDownload = useForceFileDownload()

const logRef = ref(null)
const polling = ref(null)
const isAutoUpdateLog = ref(true)
const isThreeDotsLoading = ref(false)

const runId = computed(() => route.params.runId)
const next = computed(() => runStore.runLog.next)
const countLogs = computed(() => runStore.runLog.count)
const runStatus = computed(() => runStore.run.status)
const isFinished = computed(() => FINISHED_STATUSES.includes(runStatus.value?.toLowerCase()))
const isLoadingLogs = computed(() => !isFinished.value && runStatus.value && isAutoUpdateLog.value)

const query = useQueryLog({
  next,
  limit: 100,
  offset: 200,
  suuid: runId.value,
  storeAction: runStore.getRunLog
})

const logs = computed(() => {
  if (!runStore.runLog.results) return ''

  const reducer = (acc, cr) => {
    acc = acc + `${cr[2]} \n`
    return acc
  }
  const result = runStore.runLog.results.length ? runStore.runLog.results.reduce(reducer, ``) : ''

  return result
})

const fullLog = computed(() => {
  if (!runStore.runLogFullVersion) return ''

  const reducer = (acc, cr) => {
    acc = acc + `${cr[2]} \n`
    return acc
  }
  const result = runStore.runLogFullVersion.length ? runStore.runLogFullVersion.reduce(reducer, ``) : ''

  return result
})

const maxHeight = computed(() => height.value - 270)
const loading = computed(() => runStore.runlogLoading)
const scrollerStyles = computed(() => ({ 'max-height': `${maxHeight.value}px` }))
const logNoAvailable = computed(() => !runStore.runLog.results.length && !loading.value)

const handleAutoUpdate = () => {
  isAutoUpdateLog.value = !isAutoUpdateLog.value
  isThreeDotsLoading.value = isAutoUpdateLog.value
}

const handleCopy = async () => {
  await runStore.getFullVersionRunLog(runId.value)

  copy.handleCopyText(fullLog.value)
}

const handleDownload = async () => {
  await runStore.getFullVersionRunLog(runId.value)

  forceFileDownload.trigger({ source: fullLog.value, name: `run_${runStore.run.suuid}_log.txt` })
}

const onScroll = e => {
  isThreeDotsLoading.value = true

  if (!isFinished.value) return

  query.onScroll(e.target.scrollTop)

  if (isFinished.value && countLogs.value === runStore.runLog.results.length) {
    isThreeDotsLoading.value = false
  }
}

const checkLogs = () => {
  polling.value = setInterval(async () => {
    if (!isAutoUpdateLog.value) return

    // scroll window and log container to bottom
    await runStore.getRunLog({
      suuid: runId.value,
      params: { limit: 1000, offset: runStore.runLog.results.length }
    })
    goTo(logRef.value.$el.scrollHeight)
    goTo(logRef.value.$el.scrollHeight, { container: '#scroll-target' })

    if (logNoAvailable.value || isFinished.value) {
      clearInterval(polling.value)
      isAutoUpdateLog.value = false
    }

    if (isFinished.value && countLogs.value === runStore.runLog.results.length) {
      isAutoUpdateLog.value = false
    }
  }, 5000)
}

const fetchData = async () => {
  await runStore.resetRunLog()
  await runStore.getInitRunLog({ suuid: runId.value, params: { limit: 200, offset: 0 } })
}

onBeforeMount(() => fetchData())

// check status on load if run is not finished yet
watch(
  runStatus,
  runStatus => {
    if (runStatus && !isFinished.value) {
      checkLogs()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  clearInterval(polling.value)
})
</script>
<style scoped lang="scss">
.logs-wrapper {
  position: relative;
}
</style>
