<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <v-toolbar dense flat v-sticky="sticked" :sticky-offset="stickyParams" :sticky-z-index="1">
        <v-btn icon small @click="handleBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <div>
          {{ currentPath.name
          }}<span class="pl-3">({{ `${humanize.humanizeSize(currentPath.size)}` }}{{ metaInfo }})</span>
        </div>

        <v-spacer />

        <v-btn-toggle v-if="fileStore.isRenderedExt || fileStore.isValidJSON" mandatory class="mr-1">
          <v-tooltip v-for="(view, index) in views" top :key="index">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" small class="btn--hover" outlined color="secondary" @click="handleChangeView(index)">
                <v-icon color="secondary">{{ view.icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ view.name }}</span>
          </v-tooltip>
        </v-btn-toggle>

        <v-btn
          v-if="!$vuetify.breakpoint.xsOnly"
          small
          outlined
          color="secondary"
          class="mr-1 btn--hover"
          :disabled="fileStore.loadingFullData"
          @click="handleDownload"
        >
          <v-icon color="secondary" left>mdi-download</v-icon>Download file
        </v-btn>
        <v-btn
          v-if="!$vuetify.breakpoint.xsOnly && fileStore.isShowFilePreview"
          small
          outlined
          color="secondary"
          class="mr-1 btn--hover"
          @click="handleCopy"
        >
          <v-icon color="secondary" left>mdi-content-copy</v-icon>Copy
        </v-btn>
      </v-toolbar>
      <PreviewFile
        v-if="!fileStore.isFileEmpty"
        :images="images"
        :fileBlob="file"
        :loading="loading"
        :maxHeight="`${maxHeight}`"
        :cdnBaseUrl="cdnBaseUrl"
        :isFileBig="fileStore.isFileBig"
        :currentView="currentView.value"
        :fileExtension="currentPath.ext"
        :isFileEmpty="fileStore.isFileEmpty"
        :loadingFullData="fileStore.loadingFullData"
        :isShowFilePreview="fileStore.isShowFilePreview"
        :isFileBigForRawView="fileStore.isFileBigForRawView"
        :fileSource="fileStore.filePreviewByView(currentView.value)"
        @onDownload="handleDownload"
      />
      <v-alert v-else class="ma-4 text-center" dense outlined>This file is empty.</v-alert>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useWindowSize } from '@u3u/vue-hooks'
import { ref, computed } from '@vue/composition-api'
import useNumeral from '@/core/composition/useNumeral'
import { useFileStore } from '@/features/file/useFileStore'
import { useMobileStore } from '@/core/store/useMobileStore'
import useSizeHumanize from '@/core/composition/useSizeHumanize'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import PreviewFile from '@/features/file/components/PreviewFile.vue'

defineProps({
  file: Blob,
  fileSource: [String, Object, Blob],
  breadcrumbs: {
    type: Array,
    default: () => []
  },
  sticked: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: true
  },
  currentPath: {
    type: Object,
    default: () => {
      return {
        ext: '',
        size: 0,
        name: '',
        path: '',
        type: '',
        parent: '/',
        is_dir: true,
        last_modified: ''
      }
    }
  },
  images: {
    type: Array,
    default: () => []
  },
  cdnBaseUrl: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onCopy', 'onDownload'])

const numeral = useNumeral()
const fileStore = useFileStore()
const router = useRouterAskAnna()
const { height } = useWindowSize()

const humanize = useSizeHumanize()
const mobileStore = useMobileStore()

const views = [
  { name: 'Pretty', value: 'pretty', icon: 'mdi-file-outline' },
  { name: 'Raw', value: 'raw', icon: 'mdi-xml' }
]

const currentView = ref(views[0])

const metaInfo = computed(() =>
  ['csv', 'tsv'].includes(fileStore.fileExtension)
    ? `, ${numeral.numberFormated(fileStore.metaInfo.columns)} columns,${
        fileStore.isFileBig ? 'preview ' : ''
      } ${numeral.numberFormated(fileStore.metaInfo.rows)} rows`
    : ''
)

const stickyParams = computed(() =>
  mobileStore.isMenuOpen && mobileStore.isMenuSticked ? '{top: 252, bottom: 10}' : '{top: 52, bottom: 10}'
)

const maxHeight = computed(() => height.value - 120)

const handleBack = () => router.router.back()

const handleCopy = () => emit('onCopy', currentView.value.value)

const handleDownload = () => emit('onDownload')

const handleChangeView = (currentViewIndex: number) => (currentView.value = views[currentViewIndex])
</script>
