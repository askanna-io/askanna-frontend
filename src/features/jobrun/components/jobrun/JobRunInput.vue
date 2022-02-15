<template>
  <div>
    <v-toolbar v-if="!fileStore.isFileEmpty" dense flat color="grey lighten-4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center" :class="{ 'pr-1': $vuetify.breakpoint.xsOnly }">Payload</div>
        <div class="d-flex">
          <v-btn
            v-if="!$vuetify.breakpoint.xsOnly"
            small
            :disabled="fileStore.loading || fileStore.isFileEmpty"
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleDownload()"
          >
            <v-icon color="secondary" left>mdi-download</v-icon>Download file
          </v-btn>

          <v-btn
            small
            :disabled="fileStore.loading || fileStore.isFileEmpty"
            outlined
            color="secondary"
            @click="handleCopy()"
            class="mr-1 btn--hover"
          >
            <v-icon left color="secondary">mdi-content-copy</v-icon>Copy
          </v-btn>

          <div v-if="fileStore.isValidJSON || fileStore.isFileHTML">
            <v-card class="ml-4" flat width="115" color="grey lighten-4">
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
        </div>
      </v-flex>
    </v-toolbar>
    <v-flex>
      <ask-anna-loading-progress classes="mx-4 mb-4" :type="'table-row'" :loading="fileStore.loading" fullWidth>
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
      </ask-anna-loading-progress>
    </v-flex>
  </div>
</template>
<script setup lang="ts">
import { useWindowSize } from '@u3u/vue-hooks'
import useCopy from '@/core/composition/useCopy'
import { useFileStore } from '@/features/file/useFileStore'
import useJobRunStore from '../../composition/useJobRunStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, computed, onBeforeMount } from '@vue/composition-api'
import PreviewFile from '@/features/file/components/PreviewFile.vue'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

const copy = useCopy()
const fileStore = useFileStore()
const router = useRouterAskAnna()
const { height } = useWindowSize()
const jobRunStore = useJobRunStore()
const forceFileDownload = useForceFileDownload()

const views = [
  { name: 'Pretty', value: 'pretty' },
  { name: 'Raw', value: 'raw' }
]
const { view } = router.route.value.params

const currentView = ref(views[0])

const viewModel = computed({
  get: () => currentView.value,
  set: view => {
    if (view.value === currentView.value.value) return
    currentView.value = view
    router.push({ name: 'workspace-project-jobs-job-jobrun-input', params: { view: view.value } })
  }
})

const maxHeight = computed(() => height.value - 150)
const jobRunShortId = computed(() => jobRunStore.state.jobRun.value.short_uuid)
const payloadUuid = computed(() => jobRunStore.state.jobRun.value.payload.short_uuid)

const handleDownload = async () => {
  const { short_uuid } = jobRunStore.state.jobRun.value

  await fileStore.getFullFile({
    serviceName: 'jobrun',
    serviceAction: 'getJobRunPayload',
    uuid: { jobRunShortId: jobRunShortId.value, payloadUuid: payloadUuid.value }
  })

  forceFileDownload.trigger({ source: fileStore.filePreviewByView('raw'), name: `run_${short_uuid}_payload.json` })
}

const handleCopy = async () => {
  await fileStore.getFullFile({
    serviceName: 'jobrun',
    serviceAction: 'getJobRunPayload',
    uuid: { jobRunShortId: jobRunShortId.value, payloadUuid: payloadUuid.value }
  })

  copy.handleCopyText(fileStore.fileSourceForCopy(currentView.value.value))
}

const fetchData = async () => {
  if (view) {
    currentView.value = views.find(el => el.value === view) || views[0]
  }
}

onBeforeMount(() => fetchData())
</script>
