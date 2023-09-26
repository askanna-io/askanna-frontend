<template>
  <AskAnnaToolbar class="z-10 askanna-sticky">
    <div class="flex w-full items-center justify-between ">
      <div class="flex items-center">
        <AskAnnaButtonIcon @click="handleBack">
          <AskAnnaIcon icon="mdi-arrow-left" />
        </AskAnnaButtonIcon>
        <div>
          {{ currentPath.name
          }}<span class="pl-3">({{ `${humanize.humanizeSize(currentPath.size)}` }}{{ metaInfo }})</span>
        </div>
      </div>
      <div>
        <AskAnnaButtonScrollToTop class="mr-1" />
        <AskAnnaBtnToggle
          v-if="fileStore.isRenderedExt || fileStore.isValidJSON"
          class="mr-1 h-7"
          :modelValue="currentView.index"
        >
          <AskAnnaButtonIcon
            v-for="(view, index) in views"
            class="border-main"
            @click="handleChangeView(index)"
          >
            <AskAnnaIcon
              size="small"
              :icon="view.icon"
            />
            <AskAnnaTooltip :key="index">
              {{ view.name }}
            </AskAnnaTooltip>
          </AskAnnaButtonIcon>
        </AskAnnaBtnToggle>

        <AskAnnaButton
          v-if="!$vuetify.display.xs"
          class="mr-1"
          variant="outlined"
          prependIcon="mdi-download"
          :disabled="fileStore.loadingFullData"
          @click="handleDownload"
        >
          Download file
        </AskAnnaButton>
        <AskAnnaButton
          v-if="!$vuetify.display.xs && fileStore.isShowCopyBtn"
          class="mr-1"
          prependIcon="mdi-content-copy"
          @click="handleCopy"
        >
          Copy
        </AskAnnaButton>
      </div>
    </div>
  </AskAnnaToolbar>
  <PreviewFile
    v-if="!fileStore.isFileEmpty"
    :images="images"
    :fileBlob="file"
    :loading="loading"
    :cdnBaseUrl="cdnBaseUrl"
    :maxHeight="`${maxHeight}`"
    :isFileBig="fileStore.isFileBig"
    :currentView="currentView.value"
    :fileExtension="currentPath.ext"
    :isFileEmpty="fileStore.isFileEmpty"
    :loadingFullData="fileStore.loadingFullData"
    :isEmbedPdfSuccess="fileStore.isEmbedPdfSuccess"
    :isShowFilePreview="fileStore.isShowFilePreview"
    :isFileBigForRawView="fileStore.isFileBigForRawView"
    :fileSource="fileStore.filePreviewByView(currentView.value)"
    @onDownload="handleDownload"
  />
  <AskAnnaAlert
    v-else
    class="m-4 text-center"
  >This file is empty.</AskAnnaAlert>
</template>

<script setup lang="ts">
const props = defineProps({
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
const humanize = useSizeHumanize()
const { height } = useAskAnnaWindowSize()
const { route, routerPush } = useRouterAskAnna()

const views = [
  { name: 'Pretty', value: 'pretty', index: 0, icon: 'mdi-file-outline' },
  { name: 'Raw', value: 'raw', index: 1, icon: 'mdi-xml' }
]

const currentView = ref(views[0])

const metaInfo = computed(() =>
  ['csv', 'tsv'].includes(fileStore.fileExtension)
    ? `, ${numeral.numberFormated(fileStore.metaInfo.columns)} columns,${fileStore.isFileBig ? 'preview ' : ''
    } ${numeral.numberFormated(fileStore.metaInfo.rows)} rows`
    : ''
)

const maxHeight = computed(() => height.value - 120)

const handleBack = () => {
  const { folderName, ...routeParams } = route?.params

  routerPush({ name: route.name, params: { ...routeParams, folderName: props.currentPath.parent } })
}

const handleCopy = () => emit('onCopy', currentView.value.value)

const handleDownload = () => emit('onDownload')

const handleChangeView = (currentViewIndex: number) => (currentView.value = views[currentViewIndex])
</script>
