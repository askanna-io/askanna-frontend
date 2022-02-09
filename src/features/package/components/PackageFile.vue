<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <v-toolbar dense flat v-sticky="sticked" :sticky-offset="stickyParams" :sticky-z-index="1">
        <v-btn icon small @click="handleBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <div>
          {{ currentPath.name }}<span class="pl-3">({{ `${humanize.humanizeSize(currentPath.size)}` }})</span>
        </div>

        <v-spacer></v-spacer>
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
        :fileBlob="file"
        :loading="loading"
        :fileSource="fileSource"
        :maxHeight="`${maxHeight}px`"
        :isFileBig="fileStore.isFileBig"
        :currentView="currentView.value"
        :fileExtension="currentPath.ext"
        :isFileEmpty="fileStore.isFileEmpty"
        :loadingFullData="fileStore.loadingFullData"
        :isShowFilePreview="fileStore.isShowFilePreview"
        :isFileBigForRawView="fileStore.isFileBigForRawView"
        @onDownload="handleDownload"
      />
      <v-alert v-else class="ma-4 text-center" dense outlined>This file is empty.</v-alert>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from '@vue/composition-api'
import { useRouter, useWindowSize } from '@u3u/vue-hooks'
import { useFileStore } from '@/features/file/useFileStore'
import { useMobileStore } from '@/core/store/useMobileStore'
import useSizeHumanize from '@/core/composition/useSizeHumanize'
import PreviewFile from '@/features/file/components/PreviewFile.vue'

defineProps({
  file: Blob,
  fileSource: String,
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
  }
})

const emit = defineEmits(['onCopy', 'onDownload'])

const { router } = useRouter()
const fileStore = useFileStore()
const { height } = useWindowSize()
const humanize = useSizeHumanize()
const mobileStore = useMobileStore()

const currentView = { value: 'pretty' }

const stickyParams = computed(() =>
  mobileStore.isMenuOpen && mobileStore.isMenuSticked ? '{top: 252, bottom: 10}' : '{top: 52, bottom: 10}'
)

const maxHeight = computed(() => height.value - 120)

const handleBack = () => router.back()

const handleCopy = () => emit('onCopy')

const handleDownload = () => emit('onDownload')
</script>
