<template>
  <AskAnnaToolbar
    v-if="!logNoAvailable"
    flat
    class="z-10 askanna-sticky"
  >
    <div class="flex px-4 w-full justify-between">
      <AskAnnaChipPlayStop
        v-if="!isFinished && runStatus"
        :value="isAutoUpdateLog"
        @onClick="handleAutoUpdate"
      />
      <div class="mr-auto flex items-center"></div>
      <div class="flex gap-2 items-center">
        <AskAnnaButton
          @click="handleScrollToTop()"
          prependIcon="mdi-arrow-up-bold"
        >
          Scroll to top
        </AskAnnaButton>
        <AskAnnaButton
          @click="handleDownload()"
          prependIcon="mdi-download"
          :disabled="loading || logNoAvailable"
        >
          Download
        </AskAnnaButton>

        <AskAnnaButton
          @click="handleCopy()"
          prependIcon="mdi-content-copy"
          :disabled="loading || logNoAvailable"
        >
          Copy
        </AskAnnaButton>
      </div>
    </div>
  </AskAnnaToolbar>
  <div class="overflow-y-auto">
    <AskAnnaLoadingProgress
      fullWidth
      height="94"
      :loading="loading"
      classes="mx-4 mb-4"
      transition="transition"
      type="list-item-two-line"
    >
      <div
        v-if="!logNoAvailable"
        class="relative"
      >
        <TheHighlight
          ref="logRef"
          :value="logs"
          :loading="isLoadingLogs || isThreeDotsLoading"
        />
        <AskAnnaLoadingDotsFlashing v-if="isLoadingLogs || isThreeDotsLoading" />
      </div>

      <AskAnnaAlert v-else>There is no log available for this run.
      </AskAnnaAlert>
    </AskAnnaLoadingProgress>
  </div>
</template>

<script setup lang="ts">
import { throttle } from 'lodash'

const copy = useCopy()
const runStore = useRunStore()
const fileStore = useFileStore()
const { route } = useRouterAskAnna()
const forceFileDownload = useForceFileDownload()

const logRef = ref(null)
const polling = ref(null)
const isAutoUpdateLog = ref(true)
const isThreeDotsLoading = ref(false)

const runId = computed(() => route.params.runId)
const next = computed(() => runStore.runLog.next)
const runStatus = computed(() => runStore.run.status)
const countLogs = computed(() => runStore.runLog.count)
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

const loading = computed(() => runStore.runlogLoading)

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
  if (isFinished.value) {
    isThreeDotsLoading.value = true
  }

  if (!isFinished.value) return

  query.onScroll(e.target.scrollTop || e.target.firstElementChild.scrollTop)

  if (isFinished.value && countLogs.value === runStore.runLog.results.length) {
    isThreeDotsLoading.value = false
  }
}

const throttledScroll = throttle(onScroll, 1500)

const checkLogs = () => {
  polling.value = setInterval(async () => {
    if (!isAutoUpdateLog.value) return

    // scroll window and log container to bottom
    await runStore.getRunLog({
      suuid: runId.value,
      params: { limit: 1000, offset: runStore.runLog.results.length }
    })

    logRef.value.$el.scrollIntoView({ behavior: "smooth", block: "end" })

    if (logNoAvailable.value || isFinished.value) {
      clearInterval(polling.value)
      isAutoUpdateLog.value = false
    }

    if (isFinished.value && countLogs.value === runStore.runLog.results.length) {
      isAutoUpdateLog.value = false
    }
  }, 5000)
}
const handleScrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  })
}

const fetchData = async () => {
  await fileStore.$reset()
  await runStore.resetRunLog()
  await runStore.getInitRunLog({ suuid: runId.value, params: { limit: 200, offset: 0 } })
}

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

onBeforeMount(() => fetchData())

onUnmounted(() => {
  clearInterval(polling.value)
})

window.addEventListener('scroll', throttledScroll)
</script>