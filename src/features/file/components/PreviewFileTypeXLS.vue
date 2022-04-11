<template>
  <v-flex
    class="fill-height pb-3 br-4 pt-0"
    fluid
    :class="{ 'px-0': $vuetify.breakpoint.xsOnly, 'px-5 pa-2': !$vuetify.breakpoint.xsOnly }"
  >
    <v-tabs v-model="currentSheet" left show-arrows center-active>
      <v-tab v-for="(tab, index) of data" :key="index">Sheet: {{ tab.name }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="currentSheet">
      <template v-for="(tab, index) in data">
        <v-tab-item :key="index" :value="index">
          <v-data-table
            :fixed-header="!!tab.headers.length"
            class="xls-table"
            :search="search"
            :items="tab.data"
            hide-default-footer
            :items-per-page="-1"
            :height="tableHeight"
            :headers="tab.headers"
            :mobile-breakpoint="-1"
            :group-by.sync="activeGroup"
          >
            <template v-slot:top>
              <v-container v-if="tab.headers.length" fluid class="py-0">
                <v-row justify="end">
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      label="Group by"
                      dense
                      v-model="activeGroup"
                      hide-details
                      no-data-text=""
                      item-text="text"
                      item-value="value"
                      :items="groupItems(tab.headers)"
                      width="100px"
                    >
                    </v-select>
                  </v-col>

                  <v-col v-if="!$vuetify.breakpoint.xsOnly" class="d-flex" cols="12" sm="3">
                    <v-text-field dense v-model="search" hide-details label="Search" append-icon="mdi-magnify" />
                  </v-col>
                </v-row>
              </v-container>
            </template>

            <template v-slot:body="{ items, options, groupedItems }">
              <TableGroupedTable
                v-if="options.groupBy.length"
                :key="index"
                :items="groupedItems"
                :groupBy="options.groupBy"
                :headersLength="tab.headers.length"
              />
              <tbody v-else-if="items.length" ref="tableRefs" :id="index">
                <template v-for="(item, index) in items">
                  <tr :key="index">
                    <template v-for="(value, index2) in item">
                      <td v-if="index2" :key="index2">{{ value }}</td>
                    </template>
                  </tr>
                </template>
              </tbody>
              <template v-else>
                <tr>
                  <td :colspan="tab.headers.length">
                    <v-alert class="my-4 text-center v-flex" dense outlined>
                      <template v-if="search"> There is no data available for this search. </template>
                      <template v-else>
                        This sheet doesn't seem to contain data, or we don't support viewing this type of data.<br />
                        In case you have a question about this, or you need support, send us a message:
                        <a href="mailto:support@askanna.io" target="_blank">support@askanna.io</a>
                      </template>
                    </v-alert>
                  </td>
                </tr>
              </template>
            </template>
          </v-data-table>
        </v-tab-item>
      </template>
    </v-tabs-items>
  </v-flex>
</template>

<script setup lang="ts">
import { utils, read } from 'xlsx'
import { useWindowSize } from '@u3u/vue-hooks'
import TableGroupedTable from './TableGroupedTable.vue'
import { ref, watch, computed, watchEffect } from '@vue/composition-api'

const props = defineProps({
  fileSource: {
    type: [String, Object, Blob],
    default: () => ''
  },
  fileBlob: {
    type: Blob
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

const { height } = useWindowSize()

const search = ref()
const activeGroup = ref()
const tableRefs = ref([])
const tableHeight = ref('')
const currentSheet = ref('sheet')

const data = ref([
  {
    name: '',
    data: [],
    headers: []
  }
])

const groupItems = headers => {
  const items = headers.map(el => ({ text: el.text, value: el.value })).filter(el => el.text)

  return [{ text: 'No group by', value: [] }, ...items]
}

const getData = () => {
  const reader = new FileReader()

  reader.readAsBinaryString(props.fileBlob)

  reader.onload = e => {
    const result = e.target.result
    const workbook = read(result, {
      type: 'binary'
    })

    data.value = workbook.SheetNames.map(name => {
      let data = utils.sheet_to_json(workbook.Sheets[name])

      if (!data || !data.length) {
        return {
          name: 'Empty',
          data: [],
          headers: []
        }
      }

      const isNoHeaderPresent = [0, 1, '0', '1'].includes(Object.keys(data[0])[0])
      const header = isNoHeaderPresent ? 1 : 0

      if (isNoHeaderPresent) {
        data = utils.sheet_to_json(workbook.Sheets[name], { header })

        return { name, data: data.map(el => ({ ...el })), headers: [] }
      }

      const headers = Object.keys(data[0]).map(el => ({
        text: el === '__EMPTY' ? '' : el,
        sortable: true,
        width: '110px',
        value: el
      }))

      return {
        name,
        data,
        headers
      }
    })
  }
}

const handleOnScroll = () => {
  window.scrollTo(0, window.pageYOffset + 10)
}

watchEffect(() => {
  if (!props.fileBlob) return

  getData()
})

watch(tableRefs, tableRefs => {
  if (!tableRefs.length) return

  const tableRef = tableRefs.find(el => el.id == currentSheet.value)

  if (!tableRef || !tableRef.parentElement) return

  tableHeight.value = height.value - tableRef.offsetTop - 70

  tableRef.parentElement.parentElement.onscroll = () => handleOnScroll()
})
</script>
<style lang="scss">
.xls-table {
  td {
    white-space: nowrap;
  }

  th {
    white-space: pre;
    font-size: 0.875rem !important;
  }
}
</style>
