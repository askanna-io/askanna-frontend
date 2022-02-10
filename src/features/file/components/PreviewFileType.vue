<template>
  <component :is="TypeComponent" v-bind="props" />
</template>
<script setup lang="ts">
import { computed } from '@vue/composition-api'
import PreviewFileTypeHTML from './PreviewFileTypeHTML.vue'
import PreviewFileTypeImage from './PreviewFileTypeImage.vue'
import useFileExtension from '@/core/composition/useFileExtension'
import PreviewFileTypeNotebook from './PreviewFileTypeNotebook.vue'
import PreviewFileTypeLanguage from './PreviewFileTypeLanguage.vue'
import PreviewFileTypeDownloadable from './PreviewFileTypeDownloadable.vue'

const props = defineProps({
  view: {
    type: String,
    default: () => 'pretty'
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
  maxHeight: {
    type: String,
    default: () => '100vh'
  }
})

const ext = useFileExtension()

const types = [
  {
    extensions: ['html'],
    component: PreviewFileTypeHTML
  },
  {
    extensions: ext.images,
    component: PreviewFileTypeImage
  },
  {
    extensions: ['ipynb'],
    component: PreviewFileTypeNotebook
  },
  {
    extensions: ext.noPreview,
    component: PreviewFileTypeDownloadable
  },
  {
    extensions: ext.code,
    component: PreviewFileTypeLanguage
  }
]

const TypeComponent = computed(() => {
  const type = types.find(item => item.extensions.includes(props.fileExtension))
  return type?.component || PreviewFileTypeLanguage
})
</script>