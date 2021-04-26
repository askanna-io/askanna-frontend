<template>
  <v-container class="pt-0 pb-0 fill-height" fluid>
    <v-fade-transition mode="out-in">
      <v-row key="0">
        <v-col cols="12" class="pt-0 pb-0">
          <v-card class="text-center file-csv" flat>
            <v-card-text class="pb-1">{{ title }}</v-card-text>
            <v-icon size="60">
              {{ icon }}
            </v-icon>
          </v-card>
        </v-col>
      </v-row>
    </v-fade-transition>
  </v-container>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ResultDownloadableFile',

  props: {
    dataSource: {
      type: String | Blob,
      default: function () {
        return ''
      }
    },
    fileExtension: {
      type: String,
      default: function () {
        return ''
      }
    }
  },

  setup(props, contenxt) {
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

    const icon = computed(() => icons[props.fileExtension])
    const title = computed(() => titles[props.fileExtension])

    return { icon, title }
  }
})
</script>
