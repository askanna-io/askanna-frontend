<template>
  <AskAnnaRow align="center" justify="center">
    <AskAnnaCol cols="12" class="pt-0 pb-0">
      <AskAnnaToolbar dense flat v-sticky="sticked" :sticky-offset="stickyParams" :sticky-z-index="1">
        <AskAnnaButton icon small @click="handleBack">
          <AskAnnaIcon>mdi-arrow-left</AskAnnaIcon>
        </AskAnnaButton>

        <div>
          {{ currentPath.name
          }}<span class="pl-3">({{ `${humanize.humanizeSize(currentPath.size)}` }}{{ metaInfo }})</span>
        </div>

        <AskAnnaSpacer />

        <VBtnToggle v-if="fileStore.isRenderedExt || fileStore.isValidJSON" mandatory class="mr-1">
          <AskAnnaTooltip v-for="(view, index) in views" top :key="index">
            <template v-slot:activator="{ on }">
              <AskAnnaButton
                v-on="on"
                small
                class="btn--hover"
                outlined
                color="secondary"
                @click="handleChangeView(index)"
              >
                <AskAnnaIcon color="secondary">{{ view.icon }}</AskAnnaIcon>
              </AskAnnaButton>
            </template>
            <span>{{ view.name }}</span>
          </AskAnnaTooltip>
        </VBtnToggle>

        <AskAnnaButton
          v-if="!$vuetify.breakpoint.xsOnly"
          small
          outlined
          color="secondary"
          class="mr-1 btn--hover"
          :disabled="fileStore.loadingFullData"
          @click="handleDownload"
        >
          <AskAnnaIcon color="secondary" left>mdi-download</AskAnnaIcon>Download file
        </AskAnnaButton>
        <AskAnnaButton
          v-if="!$vuetify.breakpoint.xsOnly && fileStore.isShowCopyBtn"
          small
          outlined
          color="secondary"
          class="mr-1 btn--hover"
          @click="handleCopy"
        >
          <AskAnnaIcon color="secondary" left>mdi-content-copy</AskAnnaIcon>Copy
        </AskAnnaButton>
      </AskAnnaToolbar>
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
      <AskAnnaAlert v-else class="ma-4 text-center" dense outlined>This file is empty.</AskAnnaAlert>
    </AskAnnaCol>
  </AskAnnaRow>
</template>

<script setup lang="ts">
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
        parent: '/',
        last_modified: '',
        type: 'directory'
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
