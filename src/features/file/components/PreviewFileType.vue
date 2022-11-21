<template>
  <Component :is="TypeComponent" v-bind="props" />
</template>
<script setup lang="ts">
import PreviewFileTypeXLS from './PreviewFileTypeXLS.vue'
import PreviewFileTypeCSV from './PreviewFileTypeCSV.vue'
import PreviewFileTypeHTML from './PreviewFileTypeHTML.vue'
import PreviewFileTypeImage from './PreviewFileTypeImage.vue'
import PreviewFileTypeMardown from './PreviewFileTypeMardown.vue'
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
    type: [String, Object, Blob],
    default: () => ''
  },
  fileExtension: {
    type: String,
    default: () => ''
  },
  maxHeight: {
    type: String,
    default: () => '100vh'
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
    extensions: ext.xls,
    component: PreviewFileTypeXLS
  },
  {
    extensions: ext.noPreview,
    component: PreviewFileTypeDownloadable
  },
  {
    extensions: 'md',
    component: PreviewFileTypeMardown
  },
  {
    extensions: ['csv', 'tsv'],
    component: PreviewFileTypeCSV
  },

  {
    extensions: ext.code,
    component: PreviewFileTypeLanguage
  }
]

const TypeComponent = computed(() => {
  if (props.view !== 'pretty') return PreviewFileTypeLanguage

  const type = types.find(item => item.extensions.includes(props.fileExtension))
  return type?.component || PreviewFileTypeLanguage
})
</script>
