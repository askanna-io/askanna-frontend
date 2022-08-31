<template>
  <div>
    <v-toolbar v-if="!fileStore.isFileEmpty" dense flat color="grey lighten-4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center" :class="{ 'pr-1': $vuetify.breakpoint.xsOnly }">Payload</div>

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
        </div>
      </v-flex>
    </v-toolbar>
    <v-flex>
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
    </v-flex>
  </div>
</template>
<script setup lang="ts">
import { useRunStore } from '../useRunStore'
import { useWindowSize } from '@/core/plugins/vue-hooks'
import useCopy from '@/core/composition/useCopy'
import { useFileStore } from '@/features/file/useFileStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, computed, onBeforeMount } from '@vue/composition-api'
import PreviewFile from '@/features/file/components/PreviewFile.vue'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

const copy = useCopy()
const runStore = useRunStore()
const fileStore = useFileStore()
const router = useRouterAskAnna()
const { height } = useWindowSize()
const forceFileDownload = useForceFileDownload()

const { view } = router.route.value.params

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
    serviceName: 'jobrun',
    serviceAction: 'getRunPayload',
    uuid: { runShortId: runShortId.value, payloadUuid: payloadUuid.value }
  })

  forceFileDownload.trigger({ source: fileStore.filePreviewByView('raw'), name: `run_${short_uuid}_payload.json` })
}

const handleCopy = async () => {
  await fileStore.getFullFile({
    serviceName: 'jobrun',
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
