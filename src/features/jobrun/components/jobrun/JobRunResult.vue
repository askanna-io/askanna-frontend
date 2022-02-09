<template>
  <div>
    <v-toolbar v-if="!fileStore.loading && !fileStore.isFileEmpty" dense flat color="grey lighten-4">
      <v-flex class="d-flex">
        <div class="cut-text d-flex align-center">
          {{ jobRun.result.original_name
          }}<span v-if="!$vuetify.breakpoint.xsOnly" class="pl-3"
            >({{ `${humanize.humanizeSize(fileStore.size)}` }})</span
          >
        </div>
        <div class="mr-auto d-flex align-center"></div>
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
        <div>
          <v-card
            class="ml-4"
            flat
            width="115"
            color="grey lighten-4"
            v-if="fileStore.isValidJSON || fileStore.isFileHTML"
          >
            <v-select
              dense
              hide-details
              return-object
              :items="views"
              persistent-hint
              item-text="name"
              item-value="value"
              v-model="viewModel"
              :menu-props="{ bottom: true, offsetY: true }"
            >
              <template v-slot:selection="{ item }">View: {{ item.name }} </template>
            </v-select>
          </v-card>
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
          :fileSource="fileStore.filePreviewByView(currentView)"
          :isFileBigForRawView="fileStore.isFileBigForRawView"
          @onDownload="handleDownload"
        />
      </ask-anna-loading-progress>
    </v-flex>
  </div>
</template>
<script setup lang="ts">
import { useWindowSize } from '@u3u/vue-hooks'
import { JobRunModel } from '../../store/types'
import useCopy from '@/core/composition/useCopy'
import { useFileStore } from '@/features/file/useFileStore'
import useJobRunStore from '../../composition/useJobRunStore'
import useSizeHumanize from '@/core/composition/useSizeHumanize'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, computed, onBeforeMount } from '@vue/composition-api'
import PreviewFile from '@/features/file/components/PreviewFile.vue'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

defineProps({
  jobRun: {
    type: Object,
    default: new JobRunModel().state
  }
})

const copy = useCopy()
const fileStore = useFileStore()
const router = useRouterAskAnna()
const { height } = useWindowSize()
const humanize = useSizeHumanize()
const jobRunStore = useJobRunStore()
const forceFileDownload = useForceFileDownload()

const views = [
  { name: 'Pretty', value: 'pretty' },
  { name: 'Raw', value: 'raw' }
]
const { view, jobRunId } = router.route.value.params

const currentView = ref(views[0])
const scrolllWrapperRef = ref(null)

const viewModel = computed({
  get: () => currentView.value,
  set: view => {
    if (view.value === currentView.value.value) return
    currentView.value = view
    router.push({ name: 'workspace-project-jobs-job-jobrun-result', params: { view: view.value } })
  }
})

const runResult = computed(() => jobRunStore.state.jobRun.value.result)

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
    uuid: jobRunId,
    serviceName: 'jobrun',
    size: runResult.value.size,
    serviceAction: 'getJobRunResult',
    extension: runResult.value.extension
  })
}

const maxHeight = computed(() => height.value - 120)
const scrollerStyles = computed(() => ({ 'max-height': `${maxHeight.value}px` }))

const handleDownload = async () => {
  // download full version of result without formating
  await fileStore.getFullFile({
    uuid: jobRunId,
    serviceName: 'jobrun',
    serviceAction: 'getJobRunResult'
  })

  forceFileDownload.trigger({
    source: fileStore.rawFile,
    name: `run_${jobRunStore.state.jobRun.value.short_uuid}_result_${jobRunStore.state.jobRun.value.result.original_name}`
  })
}

const handleCopy = async () => {
  const fileSource = await fileStore.getFullFile({
    uuid: jobRunId,
    serviceName: 'jobrun',
    serviceAction: 'getJobRunResult'
  })

  if (fileStore.isFileImg) {
    copy.handleCopyElementBySource(fileSource)

    return
  }

  copy.handleCopyText(fileStore.fileSourceForCopy(currentView.value.value))
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
