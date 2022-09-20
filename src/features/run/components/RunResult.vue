<template>
  <div>
    <v-toolbar v-if="!fileStore.loading && !fileStore.isFileEmpty" dense flat color="grey lighten-4">
      <v-flex class="d-flex">
        <div class="cut-text d-flex align-center">
          {{ run.result.name
          }}<span v-if="!$vuetify.breakpoint.xsOnly" class="pl-3"
            >({{ `${humanize.humanizeSize(fileStore.size)}` }}{{ metaInfo }})</span
          >
        </div>
        <div class="mr-auto d-flex align-center"></div>
        <v-btn-toggle
          v-if="fileStore.isRenderedExt || fileStore.isValidJSON"
          mandatory
          class="mr-1"
          :value="currentView.value"
        >
          <v-tooltip v-for="(view, index) in views" top :key="index">
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                class="btn--hover"
                :value="view.value"
                small
                outlined
                color="secondary"
                @click="handleChangeView(index)"
              >
                <v-icon color="secondary">{{ view.icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ view.name }}</span>
          </v-tooltip>
        </v-btn-toggle>
        <div>
          <v-btn
            v-if="!$vuetify.breakpoint.xsOnly"
            small
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            :disabled="fileStore.loading || fileStore.isFileEmpty || fileStore.loadingFullData"
            @click="handleDownload"
          >
            <template v-slot:loader>
              <span>Downloading...</span>
            </template>
            <v-icon color="secondary" left>mdi-download</v-icon>Download file
          </v-btn>
          <v-btn
            v-if="fileStore.isFileJSON || fileStore.isFileImg"
            small
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            :disabled="fileStore.loading || fileStore.isFileEmpty || fileStore.loadingFullData"
            @click="handleCopy()"
          >
            <v-icon left color="secondary">mdi-content-copy</v-icon>Copy
          </v-btn>
        </div>
      </v-flex>
    </v-toolbar>
    <v-flex id="scroll-target" class="overflow-y-auto" ref="scrolllWrapperRef" :style="scrollerStyles">
      <ask-anna-loading-progress
        :loading="fileStore.loading"
        fullWidth
        height="94"
        classes="mx-4 mb-4"
        transition="transition"
        type="list-item-two-line"
      >
        <PreviewFile
          :maxHeight="`${maxHeight}px`"
          :fileBlob="fileStore.fileBlob"
          :isFileBig="fileStore.isFileBig"
          :currentView="currentView.value"
          :isFileEmpty="fileStore.isFileEmpty"
          :fileExtension="fileStore.fileExtension"
          :loadingFullData="fileStore.loadingFullData"
          :isShowFilePreview="fileStore.isShowFilePreview"
          :fileSource="fileStore.filePreviewByView(currentView.value)"
          :isFileBigForRawView="fileStore.isFileBigForRawView"
          @onDownload="handleDownload"
        />
      </ask-anna-loading-progress>
    </v-flex>
  </div>
</template>
<script setup lang="ts">
import { RunModel } from '../types'

defineProps({
  run: {
    type: Object,
    default: new RunModel().state
  }
})

const copy = useCopy()
const numeral = useNumeral()
const runStore = useRunStore()
const fileStore = useFileStore()
const { height } = useWindowSize()
const humanize = useSizeHumanize()
const { route, router } = useRouterAskAnna()
const forceFileDownload = useForceFileDownload()

const views = [
  { name: 'Pretty', value: 'pretty', icon: 'mdi-file-outline' },
  { name: 'Raw', value: 'raw', icon: 'mdi-xml' }
]

const { view, runId } = route.params

const currentView = ref(views[0])
const scrolllWrapperRef = ref(null)

const runResult = computed(() => runStore.run.result)

const fetchData = async () => {
  fileStore.$reset()
  if (view) {
    currentView.value = views.find(el => el.value === view) || views[0]
  }

  if (!runResult.value) {
    fileStore.loading = false
    return
  }

  await fileStore.getFilePreview({
    uuid: runId,
    serviceName: 'run',
    size: runResult.value.size,
    serviceAction: 'getRunResult',
    extension: runResult.value.extension
  })
}

const maxHeight = computed(() => height.value - 120)
const scrollerStyles = computed(() => ({ 'max-height': `${maxHeight.value}px` }))

const metaInfo = computed(() =>
  ['csv', 'tsv'].includes(fileStore.fileExtension)
    ? `, ${numeral.numberFormated(fileStore.metaInfo.columns)} columns, ${
        fileStore.isFileBig ? 'preview ' : ''
      } ${numeral.numberFormated(fileStore.metaInfo.rows)} rows`
    : ''
)

const handleDownload = async () => {
  // download full version of result without formating
  await fileStore.getFullFile({
    uuid: runId,
    serviceName: 'run',
    serviceAction: 'getRunResult'
  })

  forceFileDownload.trigger({
    source: fileStore.rawFile,
    name: `run_${runStore.run.short_uuid}_result_${runStore.run.result.name}`
  })
}

const handleCopy = async () => {
  const fileSource = await fileStore.getFullFile({
    uuid: runId,
    serviceName: 'run',
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
  router.push({ name: 'workspace-project-jobs-job-run-result', params: { view: currentView.value.value } })
}

onBeforeMount(() => fetchData())

// change view of cutted html to raw
if (fileStore.isShowFilePreview && fileStore.isFileHTML && fileStore.isFileBig) {
  currentView.value = views[1]
}
</script>
<style scoped>
.cut-text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
