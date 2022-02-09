<template>
  <ask-anna-loading-progress :loading="loading">
    <div>
      <PreviewFileType
        v-if="!isFileEmpty"
        :view="currentView"
        :fileBlob="fileBlob"
        :fileSource="fileSource"
        :maxHeight="`${maxHeight}px`"
        :fileExtension="fileExtension"
      />
      <v-flex
        v-if="!isFileEmpty && (isFileBig || (isFileBigForRawView && currentView === 'raw')) && isShowFilePreview"
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
          :loading="loadingFullData"
          :disabled="loading || isFileEmpty"
        >
          <template v-slot:loader>
            <span>Downloading...</span>
          </template>
          <v-icon color="secondary" left>mdi-download</v-icon>
          ...TO SEE THE FULL CONTENT, PLEASE DOWNLOAD THE FILE.
        </v-btn>
      </v-flex>
      <v-flex v-if="!loading && !isFileEmpty && !isShowFilePreview" class="my-2 mb-2 text-center">
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
          :loading="loadingFullData"
          :disabled="loading || isFileEmpty"
        >
          <template v-slot:loader>
            <span>Downloading...</span>
          </template>
          <v-icon color="secondary" left>mdi-download</v-icon>
          We cannot show a preview of this file. Please download the file.
        </v-btn>
      </v-flex>

      <v-alert v-if="isFileEmpty" class="ma-4 text-center" dense outlined>
        There is no result available for this run.
      </v-alert>
    </div>
  </ask-anna-loading-progress>
</template>
<script setup lang="ts">
import PreviewFileType from './PreviewFileType.vue'

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
    type: String,
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
  }
})

const emit = defineEmits(['onDownload'])

const handleDownload = () => emit('onDownload')
</script>
