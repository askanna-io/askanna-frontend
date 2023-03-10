<template>
  <VDataTable
    fixed-header
    :items="data"
    :search="search"
    class="csv-table"
    :headers="headers"
    :items-per-page="-1"
    hide-default-footer
    :height="tableHeight"
    :mobile-breakpoint="-1"
    :group-by.sync="activeGroup"
  >
    <template v-slot:top>
      <AskAnnaContainer v-if="headers.length" fluid class="py-0">
        <AskAnnaRow justify="end">
          <AskAnnaCol class="d-flex" cols="12" sm="3">
            <AskAnnaSelect
              label="Group by"
              dense
              v-model="activeGroup"
              hide-details
              no-data-text=""
              item-text="text"
              item-value="value"
              :items="groupItems"
              width="100px"
            >
            </AskAnnaSelect>
          </AskAnnaCol>

          <AskAnnaCol v-if="!$vuetify.breakpoint.xsOnly" class="d-flex" cols="12" sm="3">
            <AskAnnaTextField
              dense
              v-model="search"
              hide-details
              label="Search"
              append-icon="mdi-magnify"
            ></AskAnnaTextField>
          </AskAnnaCol>
        </AskAnnaRow>
      </AskAnnaContainer>
    </template>

    <template v-slot:body="{ items, options, groupedItems }">
      <TableGroupedTable
        v-if="options.groupBy.length"
        ref="tableRef"
        :key="'TableGroupedTable'"
        :items="groupedItems"
        :groupBy="options.groupBy"
        :headersLength="headers.length"
      />

      <tbody v-else ref="tableRef">
        <template v-for="(item, index) in items">
          <tr :key="index">
            <template v-for="(value, index2) in item">
              <td v-if="index2" :key="index2">{{ value }}</td>
            </template>
          </tr>
        </template>
      </tbody>
    </template>
  </VDataTable>
</template>
<script setup lang="ts">
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  headers: {
    type: Array,
    default: () => []
  }
})

const { height } = useWindowSize()

const search = ref()
const activeGroup = ref()
const tableRef = ref(null)
const tableHeight = ref('')

const groupItems = computed(() => {
  const items = props.headers.map(el => ({ text: el.text, value: el.value }))

  return [{ text: 'No group by', value: [] }, ...items]
})

const handleOnScroll = () => {
  window.scrollTo(0, window.pageYOffset + 10)
}

watch(tableRef, tableRef => {
  if (!tableRef || !tableRef.parentElement) return

  tableHeight.value = height.value - tableRef.offsetTop - 60

  tableRef.parentElement.parentElement.onscroll = () => handleOnScroll()
})
</script>
<style lang="scss">
.csv-table {
  td {
    white-space: nowrap;
  }

  th {
    white-space: pre;
    font-size: 0.875rem !important;
  }
}
</style>
