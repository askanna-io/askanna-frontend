<template>
  <AskAnnaLoadingProgress :loading="loading">
    <div>
      <PreviewFileType
        v-if="!isFileEmpty"
        :images="images"
        :view="currentView"
        :fileBlob="fileBlob"
        :cdnBaseUrl="cdnBaseUrl"
        :fileSource="fileSource"
        :maxHeight="`${maxHeight}px`"
        :fileExtension="fileExtension"
      />
      <div
        v-if="!isFileEmpty && (isFileBig || (isFileBigForRawView && currentView === 'raw')) && isShowFilePreview"
        class="my-2 mb-2 text-center"
      >
        <p
          v-if="$vuetify.breakpoint.xsOnly"
          class="px-2"
        >
          ...this is a preview of the file. To download the file, open this page on a laptop or desktop.
        </p>
        <AskAnnaButton
          v-if="!$vuetify.breakpoint.xsOnly"
          text
          small
          outlined
          color="secondary"
          class="mr-1 btn--hover"
          @click="handleDownload"
          :loading="loadingFullData"
          :disabled="loading || isFileEmpty"
        >
          <template v-slot:loader>
            <span>Downloading...</span>
          </template>
          <AskAnnaIcon
            color="secondary"
            left
          >mdi-download</AskAnnaIcon>
          ...TO SEE THE FULL CONTENT, PLEASE DOWNLOAD THE FILE.
        </AskAnnaButton>
      </div>
      <AskAnnaFlex
        v-if="(!loading && !isFileEmpty && !isShowFilePreview) || !isEmbedPdfSuccess"
        class="my-2 mb-2 text-center flex-col items-center"
      >
        <p>We cannot show a preview of this file.</p>
        <AskAnnaButton
          text
          small
          outlined
          color="secondary"
          class="mr-1 btn--hover"
          @click="handleDownload"
          :loading="loadingFullData"
          :disabled="loading || isFileEmpty"
        >
          <template v-slot:loader>
            <span>Downloading...</span>
          </template>
          <AskAnnaIcon
            color="secondary"
            left
          >mdi-download</AskAnnaIcon>
          download file
        </AskAnnaButton>
      </AskAnnaFlex>

      <AskAnnaAlert
        v-if="isFileEmpty"
        class="ma-4 text-center"
        dense
        outlined
      >{{ textNoData }}</AskAnnaAlert>
    </div>
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  loadingFullData: {
    type: Boolean,
    default: false
  },
  maxHeight: {
    type: String,
    default: () => ''
  },
  currentView: {
    type: String,
    default: () => ''
  },
  fileBlob: {
    type: Blob
  },
  fileSource: {
    type: [String, Object, Blob],
    default: () => ''
  },
  fileExtension: {
    type: String,
    default: () => ''
  },
  isFileEmpty: {
    type: Boolean,
    default: false
  },
  isFileBig: {
    type: Boolean,
    default: false
  },
  isShowFilePreview: {
    type: Boolean,
    default: false
  },
  isFileBigForRawView: {
    type: Boolean,
    default: false
  },
  isEmbedPdfSuccess: {
    type: Boolean,
    default: false
  },
  textNoData: {
    type: String,
    default: () => 'There is no result available for this run.'
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

const emit = defineEmits(['onDownload'])

const handleDownload = () => emit('onDownload')
</script>
