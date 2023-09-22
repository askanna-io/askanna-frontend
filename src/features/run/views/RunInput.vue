<template>
  <AskAnnaToolbar
    v-if="!fileStore.isFileEmpty"
    flat
    class="px-4 z-10 askanna-sticky"
  >
    <div class="flex w-full items-center justify-between">
      <div
        class="mr-auto flex items-center"
        :class="{ 'pr-1': $vuetify.display.xs }"
      >Payload</div>

      <VBtnToggle
        v-if="fileStore.isRenderedExt || fileStore.isValidJSON"
        divided
        mandatory
        color="primary"
        variant="outlined"
        class="mr-2 h-7 cursor-pointer"
        :model-value="currentViewIndex"
      >
        <AskAnnaButtonIcon
          v-for="(view, index) in views"
          :tag="'a'"
          :key="index"
          @click="handleChangeView(index)"
        >
          <AskAnnaIcon :icon="view.icon" />
          <AskAnnaTooltip>
            {{ view.name }}
          </AskAnnaTooltip>
        </AskAnnaButtonIcon>
      </VBtnToggle>
      <AskAnnaButton
        v-if="!$vuetify.display.xs"
        class="mr-2"
        @click="handleScrollToTop()"
        prependIcon="mdi-arrow-up-bold"
      >
        Scroll to top
      </AskAnnaButton>
      <div class="flex gap-2">
        <AskAnnaButton
          v-if="!$vuetify.display.xs"
          prependIcon="mdi-download"
          :disabled="fileStore.loading || fileStore.isFileEmpty"
          @click="handleDownload()"
        >
          Download file
        </AskAnnaButton>
        <AskAnnaButton
          @click="handleCopy()"
          prependIcon="mdi-content-copy"
          :disabled="fileStore.loading || fileStore.isFileEmpty"
        >
          Copy
        </AskAnnaButton>
      </div>
    </div>
  </AskAnnaToolbar>
  <AskAnnaLoadingProgress
    fullWidth
    classes="mx-4 mb-4"
    :loading="fileStore.loading"
  >
    <PreviewFile
      :isFileBig="false"
      :maxHeight="`${maxHeight}px`"
      :fileBlob="fileStore.fileBlob"
      :currentView="currentView.value"
      :isFileEmpty="fileStore.isFileEmpty"
      :fileExtension="fileStore.fileExtension"
      :loadingFullData="fileStore.loadingFullData"
      :isEmbedPdfSuccess="fileStore.isEmbedPdfSuccess"
      :isShowFilePreview="fileStore.isShowFilePreview"
      :isFileBigForRawView="fileStore.isFileBigForRawView"
      :fileSource="fileStore.filePreviewByView(currentView.value)"
      textNoData="There is no input available for this run."
      @onDownload="handleDownload()"
    />
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
const copy = useCopy()
const runStore = useRunStore()
const fileStore = useFileStore()
const { height } = useAskAnnaWindowSize()
const { route, routerPush } = useRouterAskAnna()
const forceFileDownload = useForceFileDownload()

const views = [
  { name: 'Pretty', value: 'pretty', icon: 'mdi-file-outline' },
  { name: 'Raw', value: 'raw', icon: 'mdi-xml' }
]

const currentViewIndex = ref(0)

const maxHeight = computed(() => height.value - 150)
const runShortId = computed(() => runStore.run.suuid)
const payloadUuid = computed(() => runStore.run.payload?.suuid)
const currentView = computed(() => views[currentViewIndex.value])

const handleViewPayload = async (runShortId, payloadUuid) => {
  if (payloadUuid) {
    await fileStore.getFilePreview({
      extension: 'json',
      serviceName: 'run',
      size: runStore.run.payload.size,
      serviceAction: 'getRunPayload',
      suuid: { runShortId, payloadUuid }
    })
  }
}

const handleScrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  })
}

const handleDownload = async () => {
  const { suuid } = runStore.run

  await fileStore.getFullFile({
    serviceName: 'run',
    serviceAction: 'getRunPayload',
    suuid: { runShortId: runShortId.value, payloadUuid: payloadUuid.value }
  })

  forceFileDownload.trigger({ source: fileStore.filePreviewByView('raw'), name: `run_${suuid}_payload.json` })
}

const handleCopy = async () => {
  await fileStore.getFullFile({
    serviceName: 'run',
    serviceAction: 'getRunPayload',
    suuid: { runShortId: runShortId.value, payloadUuid: payloadUuid.value }
  })

  copy.handleCopyText(fileStore.fileSourceForCopy(currentView.value.value))
}

const handleChangeView = (index: number) => {
  currentViewIndex.value = index
  routerPush({ name: `workspace-project-jobs-job-run-input`, params: { ...route.params, view: currentView.value.value } })
}

const fetchData = async () => {
  if (route.params.view) {
    currentViewIndex.value = views.findIndex(el => el.value === route.params.view) || 0
  }
}

watch(runShortId, runShortId => {
  if (!payloadUuid.value && runShortId) {
    fileStore.loading = false
  }
})

watch(payloadUuid, (payloadUuid, previusPayloadUuid) => {
  if (fileStore.isFileEmpty || previusPayloadUuid !== payloadUuid) {
    handleViewPayload(runShortId.value, payloadUuid)
  }
})

onBeforeMount(() => {
  fileStore.$reset()

  handleViewPayload(runShortId.value, payloadUuid.value)

  fetchData()
})

onMounted(() => {
  if (!payloadUuid.value && runShortId.value) {
    fileStore.loading = false
  }
}) 
</script>