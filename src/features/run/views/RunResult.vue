<template>
  <AskAnnaToolbar
    v-if="!fileStore.loading && !fileStore.isFileEmpty"
    flat
    class="px-4 z-10 askanna-sticky"
  >
    <div class="flex w-full items-center justify-between">
      <div class="cut-text flex items-center">
        {{ run?.result?.name
        }}<span
          v-if="!$vuetify.display.xs"
          class="pl-3"
        >({{ `${humanize.humanizeSize(fileStore.size)}` }}{{ metaInfo }})</span>
      </div>
      <div class="mr-auto flex items-center"></div>

      <AskAnnaButtonScrollToTop class="mr-2" />

      <AskAnnaBtnToggle
        v-if="fileStore.isRenderedExt || fileStore.isValidJSON"
        class="h-7 mr-2 cursor-pointer"
        :model-value="currentViewIndex"
      >
        <AskAnnaButtonIcon
          v-for="(view, index) in views"
          :tag="'a'"
          :key="index"
          class="border-main"
          @click="handleChangeView(index)"
        >
          <AskAnnaIcon :icon="view.icon" />
          <AskAnnaTooltip>
            {{ view.name }}
          </AskAnnaTooltip>
        </AskAnnaButtonIcon>
      </AskAnnaBtnToggle>
      <div class="flex gap-2">
        <AskAnnaButton
          v-if="!$vuetify.display.xs"
          prependIcon="mdi-download"
          :disabled="fileStore.loading || fileStore.isFileEmpty || fileStore.loadingFullData"
          @click="handleDownload"
        >
          <template v-slot:loader>
            <span>Downloading...</span>
          </template>
          Download file
        </AskAnnaButton>
        <AskAnnaButton
          v-if="fileStore.isFileJSON || fileStore.isFileImg"
          prependIcon="mdi-content-copy"
          :disabled="fileStore.loading || fileStore.isFileEmpty || fileStore.loadingFullData"
          @click="handleCopy()"
        >
          Copy
        </AskAnnaButton>
      </div>
    </div>
  </AskAnnaToolbar>
  <AskAnnaLoadingProgress
    :loading="fileStore.loading"
    fullWidth
    classes="mx-4 mb-4"
    transition="transition"
    type="list-item-two-line"
  >
    <PreviewFile
      :fileBlob="fileStore.fileBlob"
      :isFileBig="fileStore.isFileBig"
      :currentView="currentView.value"
      :isFileEmpty="fileStore.isFileEmpty"
      :fileExtension="fileStore.fileExtension"
      :loadingFullData="fileStore.loadingFullData"
      :isEmbedPdfSuccess="fileStore.isEmbedPdfSuccess"
      :isShowFilePreview="fileStore.isShowFilePreview"
      :fileSource="fileStore.filePreviewByView(currentView.value)"
      :isFileBigForRawView="fileStore.isFileBigForRawView"
      @onDownload="handleDownload"
    />
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
const copy = useCopy()
const numeral = useNumeral()
const runStore = useRunStore()
const fileStore = useFileStore()
const humanize = useSizeHumanize()
const { route, routerPush } = useRouterAskAnna()
const forceFileDownload = useForceFileDownload()

const views = [
  { name: 'Pretty', value: 'pretty', icon: 'mdi-file-outline' },
  { name: 'Raw', value: 'raw', icon: 'mdi-xml' }
]

const currentViewIndex = ref(0)
const currentView = ref(views[0])

const run = computed(() => runStore.run)
const runResult = computed(() => runStore.run.result)

const fetchData = async () => {
  await fileStore.$reset()
  if (route.params.view) {
    currentView.value = views.find(el => el.value === route.params.view) || views[0]
  }

  if (!runResult.value) {
    fileStore.loading = false

    return
  }

  await fileStore.getFilePreview({
    serviceName: 'run',
    suuid: route.params.runId,
    size: runResult.value.size,
    serviceAction: 'getRunResult',
    extension: runResult.value.extension
  })
}

const metaInfo = computed(() =>
  ['csv', 'tsv'].includes(fileStore.fileExtension)
    ? `, ${numeral.numberFormated(fileStore.metaInfo.columns)} columns, ${fileStore.isFileBig ? 'preview ' : ''
    } ${numeral.numberFormated(fileStore.metaInfo.rows)} rows`
    : ''
)

const handleDownload = async () => {
  // download full version of result without formating
  await fileStore.getFullFile({
    serviceName: 'run',
    suuid: route.params.runId,
    serviceAction: 'getRunResult'
  })

  forceFileDownload.trigger({
    source: fileStore.rawFile,
    name: `run_${runStore.run.suuid}_result_${runStore.run.result.name}`
  })
}

const handleCopy = async () => {
  const fileSource = await fileStore.getFullFile({
    serviceName: 'run',
    suuid: route.params.runId,
    serviceAction: 'getRunResult'
  })

  if (fileStore.isFileImg) {
    copy.handleCopyElementBySource(fileSource)

    return
  }

  copy.handleCopyText(fileStore.fileSourceForCopy(currentView.value.value))
}

const handleChangeView = (currentViewIndex: number) => {
  currentView.value = views[currentViewIndex]
  routerPush({ name: 'workspace-project-jobs-job-run-result', params: { ...route.params, view: currentView.value.value } })
}

// change view of cutted html to raw
if (fileStore.isShowFilePreview && fileStore.isFileHTML && fileStore.isFileBig) {
  currentView.value = views[1]
}

whenever(runResult, async () => {
  await fetchData()
}, { immediate: true }) 
</script>
<style scoped>
.cut-text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
