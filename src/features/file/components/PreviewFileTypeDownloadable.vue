<template>
  <div class="fill-height">
    <VFadeTransition mode="out-in">
      <div
        key="0"
        class="flex"
      >
        <div class="w-full">
          <AskAnnaCard
            class="text-center file-csv"
            flat
          >
            <AskAnnaCardText class="pb-1">{{ title }}</AskAnnaCardText>
            <AskAnnaIcon size="60">
              {{ icon }}
            </AskAnnaIcon>
          </AskAnnaCard>
        </div>
      </div>
    </VFadeTransition>
  </div>
</template>
<script setup lang="ts">
import { get } from 'lodash'

const props = defineProps({
  fileExtension: {
    type: String,
    default: () => ''
  }
})

const icons = {
  pdf: 'mdi-file-pdf-outline',
  xls: 'mdi-file-table-outline',
  xlsx: 'mdi-file-table-outline',
  csv: 'mdi-file-table-outline'
}

const titles = {
  pdf: 'PDF file',
  csv: 'CSV file',
  xls: 'Excel file',
  xlsx: 'Excel file'
}

const icon = computed(() => get(icons, props.fileExtension))
const title = computed(() => get(titles, props.fileExtension))
</script>
