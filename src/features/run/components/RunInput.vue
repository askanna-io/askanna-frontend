<template>
  <div>
    <AskAnnaToolbar v-if="!fileStore.isFileEmpty" dense flat color="grey lighten-4">
      <AskAnnaFlex class="d-flex">
        <div class="mr-auto d-flex align-center" :class="{ 'pr-1': $vuetify.breakpoint.xsOnly }">Payload</div>

        <v-btn-toggle
          v-if="fileStore.isRenderedExt || fileStore.isValidJSON"
          mandatory
          class="mr-1"
          :value="currentView.value"
        >
          <AskAnnaTooltip v-for="(view, index) in views" top :key="index">
            <template v-slot:activator="{ on }">
              <AskAnnaButton
                v-on="on"
                class="btn--hover"
                :value="view.value"
                small
                outlined
                color="secondary"
                @click="handleChangeView(index)"
              >
                <AskAnnaIcon color="secondary">{{ view.icon }}</AskAnnaIcon>
              </AskAnnaButton>
            </template>
            <span>{{ view.name }}</span>
          </AskAnnaTooltip>
        </v-btn-toggle>
        <div class="d-flex">
          <AskAnnaButton
            v-if="!$vuetify.breakpoint.xsOnly"
            small
            :disabled="fileStore.loading || fileStore.isFileEmpty"
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleDownload()"
          >
            <AskAnnaIcon color="secondary" left>mdi-download</AskAnnaIcon>Download file
          </AskAnnaButton>

          <AskAnnaButton
            small
            :disabled="fileStore.loading || fileStore.isFileEmpty"
            outlined
            color="secondary"
            @click="handleCopy()"
            class="mr-1 btn--hover"
          >
            <AskAnnaIcon left color="secondary">mdi-content-copy</AskAnnaIcon>Copy
          </AskAnnaButton>
        </div>
      </AskAnnaFlex>
    </AskAnnaToolbar>
    <AskAnnaFlex>
      <AskAnnaLoadingProgress classes="mx-4 mb-4" :type="'table-row'" :loading="fileStore.loading" fullWidth>
        <PreviewFile
          :maxHeight="`${maxHeight}px`"
          :fileBlob="fileStore.fileBlob"
          :isFileBig="fileStore.isFileBig"
          :currentView="currentView.value"
          :isFileEmpty="fileStore.isFileEmpty"
          :fileExtension="fileStore.fileExtension"
          :loadingFullData="fileStore.loadingFullData"
          :isShowFilePreview="fileStore.isShowFilePreview"
          :isFileBigForRawView="fileStore.isFileBigForRawView"
          :fileSource="fileStore.filePreviewByView(currentView.value)"
          textNoData="There is no input available for this run."
          @onDownload="handleDownload()"
        />
      </AskAnnaLoadingProgress>
    </AskAnnaFlex>
  </div>
</template>
<script setup lang="ts">
const copy = useCopy()
const runStore = useRunStore()
const fileStore = useFileStore()
const { height } = useWindowSize()
const { route, router } = useRouterAskAnna()
const forceFileDownload = useForceFileDownload()

const { view } = route.params

const views = [
  { name: 'Pretty', value: 'pretty', icon: 'mdi-file-outline' },
  { name: 'Raw', value: 'raw', icon: 'mdi-xml' }
]

const currentView = ref(views[0])

const maxHeight = computed(() => height.value - 150)
const runShortId = computed(() => runStore.run.short_uuid)
const payloadUuid = computed(() => runStore.run.payload?.short_uuid)

const handleDownload = async () => {
  const { short_uuid } = runStore.run

  await fileStore.getFullFile({
    serviceName: 'run',
    serviceAction: 'getRunPayload',
    uuid: { runShortId: runShortId.value, payloadUuid: payloadUuid.value }
  })

  forceFileDownload.trigger({ source: fileStore.filePreviewByView('raw'), name: `run_${short_uuid}_payload.json` })
}

const handleCopy = async () => {
  await fileStore.getFullFile({
    serviceName: 'run',
    serviceAction: 'getRunPayload',
    uuid: { runShortId: runShortId.value, payloadUuid: payloadUuid.value }
  })

  copy.handleCopyText(fileStore.fileSourceForCopy(currentView.value.value))
}

const handleChangeView = (currentViewIndex: number) => {
  currentView.value = views[currentViewIndex]
  router.push({ name: 'workspace-project-jobs-job-run-input', params: { view: currentView.value.value } })
}

const fetchData = async () => {
  if (view) {
    currentView.value = views.find(el => el.value === view) || views[0]
  }
}

onBeforeMount(() => fetchData())
</script>
