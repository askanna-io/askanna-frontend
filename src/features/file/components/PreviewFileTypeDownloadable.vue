<template>
  <AskAnnaContainer class="pt-0 pb-0 fill-height" fluid>
    <v-fade-transition mode="out-in">
      <AskAnnaRow key="0">
        <AskAnnaCol cols="12" class="pt-0 pb-0">
          <AskAnnaCard class="text-center file-csv" flat>
            <AskAnnaCardText class="pb-1">{{ title }}</AskAnnaCardText>
            <AskAnnaIcon size="60">
              {{ icon }}
            </AskAnnaIcon>
          </AskAnnaCard>
        </AskAnnaCol>
      </AskAnnaRow>
    </v-fade-transition>
  </AskAnnaContainer>
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
