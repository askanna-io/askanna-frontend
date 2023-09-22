<template>
  <div
    class="fill-height"
    :class="{ 'px-4': !$vuetify.display.xs }"
  >
    <VFadeTransition mode="out-in">
      <AskAnnaCSV
        :data="tableData.data"
        :cdnBaseUrl="cdnBaseUrl"
        :headers="tableData.headers"
        :isNoHeaderPresent="tableData.isNoHeaderPresent"
      />
    </VFadeTransition>
  </div>
</template>

<script setup lang="ts">
import { parse } from 'papaparse'

const props = defineProps({
  fileSource: {
    type: [String, Object, Blob],
    default: () => ''
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

const fileStore = useFileStore()

const tableData = computed(() => {
  const isNoHeaderPresent = [0, 1, '0', '1'].includes(props.fileSource.charAt(0))
  const parsedData = parse(props.fileSource, { header: !isNoHeaderPresent, skipEmptyLines: 'greedy' })

  if (isNoHeaderPresent) {
    const data = parsedData.data.map(el => ({ ...el }))
    fileStore.metaInfo.columns = Object.keys(data[0]).length
    fileStore.metaInfo.rows = data.length


    const headers = Object.keys(data[0])
      .filter(key => key)
      .map(key => ({
        key,
        title: '',
        width: 'auto',
        sortable: false,
      }))

    return { data, headers, isNoHeaderPresent: true }
  }

  const headers = parsedData.meta.fields
    .filter(key => key)
    .map(key => ({
      key,
      title: key,
      width: 'auto',
      sortable: true,
    }))

  fileStore.metaInfo.columns = headers.length
  fileStore.metaInfo.rows = parsedData.data.length

  return { data: parsedData.data, headers, isNoHeaderPresent: false }
})
</script>
