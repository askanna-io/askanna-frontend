<template>
  <div>
    <v-toolbar v-if="!loading && !isJobRunResultEmpty" dense flat color="grey lighten-4">
      <v-flex class="d-flex">
        <div class="cut-text d-flex align-center">
          {{ jobRun.result.original_name }}
        </div>
        <div class="mr-auto d-flex align-center"></div>
        <div>
          <v-btn
            v-if="!$vuetify.breakpoint.xsOnly"
            small
            :disabled="loading || isJobRunResultEmpty"
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleDownload"
          >
            <v-icon color="secondary" left>mdi-download</v-icon>Download file
          </v-btn>
          <v-btn
            v-if="isResultJSON || isFileImg"
            small
            :disabled="loading || isJobRunResultEmpty"
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleCopy()"
          >
            <v-icon left color="secondary">mdi-content-copy</v-icon>Copy
          </v-btn>
        </div>
        <div>
          <v-card class="ml-4" flat width="115" color="grey lighten-4" v-if="isValidJSON || isResultHTML">
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
              <template v-slot:selection="{ item }"> View: {{ item.name }} </template>
            </v-select>
          </v-card>
        </div>
      </v-flex>
    </v-toolbar>
    <v-flex ref="scrolllWrapperRef" :style="scrollerStyles" class="overflow-y-auto" id="scroll-target">
      <ask-anna-loading-progress
        :loading="loading"
        fullWidth
        height="94"
        classes="mx-4 mb-4"
        transition="transition"
        type="list-item-two-line"
      >
        <div>
          <job-run-result-preview
            v-if="!isJobRunResultEmpty"
            :view="currentView.value"
            :maxHeight="`${maxHeight}px`"
            :fileExtension="jobRunResultExt"
            :dataSource="jobRunResultForView"
          />
          <v-flex
            v-if="
              !isJobRunResultEmpty &&
              (isJobRunResultBig || (isResultBigForRawView && currentView.value === 'raw')) &&
              isShowPreview
            "
            class="my-2 mb-2 text-center"
          >
            <p v-if="$vuetify.breakpoint.xsOnly" class="px-2">
              ...this is a preview of the file. To download the file, open this page on a laptop or desktop.
            </p>
            <v-btn
              v-if="!$vuetify.breakpoint.xsOnly"
              text
              small
              outlined
              color="secondary"
              class="mr-1 btn--hover"
              @click="handleDownload"
              :disabled="loading || isJobRunResultEmpty"
            >
              <v-icon color="secondary" left>mdi-download</v-icon>
              ...to show the full result, please download the file
            </v-btn>
          </v-flex>
          <v-flex v-if="!isJobRunResultEmpty && !isShowPreview" class="my-2 mb-2 text-center">
            <p v-if="$vuetify.breakpoint.xsOnly" class="px-2">
              We cannot show a preview of this file. To download the file, open this page on a laptop or desktop.
            </p>
            <v-btn
              v-if="!$vuetify.breakpoint.xsOnly"
              text
              small
              outlined
              color="secondary"
              class="mr-1 btn--hover"
              @click="handleDownload"
              :disabled="loading || isJobRunResultEmpty"
            >
              <v-icon color="secondary" left>mdi-download</v-icon>
              We cannot show a preview of this file. Please download the file.
            </v-btn>
          </v-flex>

          <v-alert v-if="isJobRunResultEmpty" class="ma-4 text-center" dense outlined>
            There is no result available for this run.
          </v-alert>
        </div>
      </ask-anna-loading-progress>
    </v-flex>
  </div>
</template>
<script setup lang="ts">
import { useWindowSize } from '@u3u/vue-hooks'
import { JobRunModel } from '../../store/types'
import useCopy from '@/core/composition/useCopy'
import usePrettyJSON from '@/core/composition/usePrettyJSON'
import useJobRunStore from '../../composition/useJobRunStore'
import JobRunResultPreview from './result/JobRunResultPreview.vue'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, computed, onBeforeMount } from '@vue/composition-api'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

defineProps({
  jobRun: {
    type: Object,
    default: new JobRunModel().state
  }
})

const copy = useCopy()
const { height } = useWindowSize()
const prettyJSON = usePrettyJSON()
const jobRunStore = useJobRunStore()
const router = useRouterAskAnna()
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

const loading = computed(() => jobRunStore.state.resultLoading.value)
const isResultJSON = computed(() => jobRunStore.state.isResultJSON.value)
const isResultHTML = computed(() => jobRunStore.state.isResultHTML.value)

const isShowPreview = computed(() => jobRunStore.state.isShowPreview.value)
const jobRunResultRaw = computed(() => jobRunStore.state.jobRunResult.value)
const jobRunResultExt = computed(() => jobRunStore.state.jobRunResultExt.value)

const imgExts = ['jpg', 'png', 'gif', 'jpeg']
const isFileImg = computed(() => imgExts.includes(jobRunResultExt.value))

const runResultPreview = computed(() =>
  jobRunResultExt.value === 'json'
    ? prettyJSON(jobRunStore.state.jobRunResultPreview.value, 2)
    : jobRunStore.state.jobRunResultPreview.value
)

const isJobRunResultBig = computed(() => jobRunStore.state.isJobRunResultBig.value)
const isResultBigForRawView = computed(() => jobRunStore.state.isResultBigForRawView.value)
const isJobRunResultEmpty = computed(() => !runResultPreview.value && !loading.value)

const isValidJSON = computed(() => runResultPreview.value.isValidJSON)

const jobRunResultFormated = computed(() => runResultPreview.value.prettyJson)
const jobRunResultForView = computed(() => {
  if (!isResultJSON.value) return jobRunStore.state.jobRunResultPreview.value

  return currentView.value.value === 'raw' ? jobRunStore.state.jobRunResultPreview.value : jobRunResultFormated.value
})

const jobRunResultSource = computed(() =>
  currentView.value.value === 'raw' ? jobRunResultRaw.value : prettyJSON(jobRunResultRaw.value, 2).prettyJson
)

const fetchData = async () => {
  if (view) {
    currentView.value = views.find(el => el.value === view) || views[0]
  }
  await jobRunStore.getJobRunResultPreview(jobRunId)
}

const maxHeight = computed(() => height.value - 120)

const scrollerStyles = computed(() => {
  return { 'max-height': `${maxHeight.value}px` }
})

const handleDownload = async () => {
  // download full version of result without formating
  await jobRunStore.getJobRunResult(jobRunId)

  forceFileDownload.trigger({
    source: jobRunResultRaw.value,
    name: `run_${jobRunStore.state.jobRun.value.short_uuid}_result_${jobRunStore.state.jobRun.value.result.original_name}`
  })
}

const handleCopy = async () => {
  if (isFileImg.value) {
    const fileSource = await jobRunStore.actions.getJobRunResultBlob(jobRunId)

    copy.handleCopyElementBySource(fileSource)

    return
  }

  await jobRunStore.actions.getJobRunResult(jobRunId)
  copy.handleCopyText(jobRunResultSource.value)
}

onBeforeMount(() => fetchData())

// change view of cutted html to raw
if (isShowPreview.value && isResultHTML.value && isJobRunResultBig.value) {
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
