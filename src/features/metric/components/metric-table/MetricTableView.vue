<template>
  <v-data-table fixed-header :height="height" class="pt-2" disable-pagination hide-default-footer :items="metricData">
    <template v-slot:header>
      <thead v-if="metricData.length">
        <tr>
          <th
            :style="{ width: '20%' }"
            :class="{ 'AskAnna-box-shadow--none': isLabels }"
            class="text-left text-subtitle-2 font-weight-bold h-20"
          >
            <TableFilter title="Name" sortBy="metric.name" @onSort="handleOnSort" />
          </th>
          <th
            :style="rowValueStyle"
            :class="{ 'AskAnna-box-shadow--none': isLabels }"
            class="text-left text-subtitle-2 font-weight-bold h-20"
          >
            <TableFilter title="Value" sortBy="metric.value" disabled @onSort="handleOnSort" />
          </th>
          <th
            v-if="isLabels"
            :colspan="labels.length"
            class="text-left text-subtitle-2 font-weight-bold h-20 AskAnna-box-shadow--none"
          >
            Labels
          </th>
        </tr>
        <tr v-if="isLabels">
          <th colspan="2" class="h-30 text-left" />
          <template>
            <th class="h-30 text-left text-subtitle-2 font-weight-bold" v-for="label in labels" :key="label">
              <lable-filter :title="label" />
            </th>
          </template>
        </tr>
      </thead>
    </template>
    <template v-slot:body="{ items }">
      <tbody ref="tableRef" v-if="!loading">
        <template v-for="(item, index) in items">
          <tr :key="index">
            <td>{{ item.metric.name }}</td>
            <td class="text-left">
              <metric-value :metricRow="item.metric" :fullText="true" :isLabels="isLabels" />
            </td>
            <template v-if="labels.length">
              <metric-table-label-td
                v-for="label in labels"
                :key="label + index2"
                :label="label"
                :isLabel="true"
                :labels="item.label"
                :isLabels="isLabels"
              />
            </template>
          </tr>
        </template>
      </tbody>
    </template>
  </v-data-table>
</template>
<script>
import MetricValue from './parts/MetricValue'
import LableFilter from './parts/LableFilter'
import TableFilter from './parts/TableFilter'
import MetricTableLabelTd from './parts/MetricTableLabelTd'

import { ref, watch, defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'MetricTableView',

  props: {
    labels: Array,
    height: Number,
    loading: Boolean,
    sticked: Boolean,
    metricData: Array
  },

  components: { MetricValue, LableFilter, TableFilter, MetricTableLabelTd },

  setup(props, context) {
    const tableRef = ref(null)

    const handleOnSort = data => context.emit('onSort', data)

    const lastScrollTop = ref(0)

    const handleOnScroll = data => {
      if (data.target.scrollTop > 0 && data.target.scrollTop !== lastScrollTop.value) {
        if (data.target.scrollTop > lastScrollTop.value) {
          window.scrollTo(0, window.pageYOffset + 10)
          context.emit('onScroll', data)
        }
        lastScrollTop.value = data.target.scrollTop
      }
    }

    const isFullText = computed(() => props.labels.length <= 1)
    const isLabels = computed(() => Boolean(props.labels.length))

    const rowValueStyle = computed(() => {
      let style = {
        width: '35%',
        minWidth: '240px'
      }
      if (!props.labels.length) {
        style = {
          width: '80%',
          minWidth: '240px'
        }
      }

      return { ...style }
    })

    watch(tableRef, async tableRef => {
      if (!tableRef) return

      tableRef.parentElement.parentElement.onscroll = e => handleOnScroll(e)
    })

    return { isLabels, tableRef, isFullText, rowValueStyle, handleOnSort, handleOnScroll }
  }
})
</script>
<style scoped>
.h-30 {
  height: 30px !important;
}
</style>
