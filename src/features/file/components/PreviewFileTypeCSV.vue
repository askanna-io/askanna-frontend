<template>
  <div
    class="fill-height"
    :class="{ 'px-0': $vuetify.breakpoint.xsOnly, 'px-5': !$vuetify.breakpoint.xsOnly }"
  >
    <VFadeTransition mode="out-in">
      <AskAnnaCSV
        :data="tableData.data"
        :headers="tableData.headers"
        :cdnBaseUrl="cdnBaseUrl"
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

    return { data, headers: [] }
  }

  const headers = parsedData.meta.fields
    .filter(el => el)
    .map(el => ({
      text: el,
      value: el,
      width: 'auto',
      sortable: true
    }))

  fileStore.metaInfo.columns = headers.length
  fileStore.metaInfo.rows = parsedData.data.length

  return { data: parsedData.data, headers }
})
</script>
