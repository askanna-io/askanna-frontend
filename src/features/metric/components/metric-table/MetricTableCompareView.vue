<template>
  <VDataTable
    class="pt-2"
    fixed-header
    :height="height"
    disable-pagination
    hide-default-footer
    :items="metricData"
    :mobile-breakpoint="-1"
  >
    <template v-slot:header>
      <thead v-if="metricData.length || isSorted">
        <tr>
          <th
            :style="{ width: '20%', minWidth: '150px' }"
            :class="{ 'AskAnna-box-shadow--none': isLabels }"
            class="text-left text-subtitle-2 font-weight-bold h-20"
          >
            <SortFilterByName />
          </th>

          <th
            v-for="index in count"
            :key="index"
            :style="rowValueStyle"
            :class="{ 'AskAnna-box-shadow--none': isLabels }"
            class="text-left text-subtitle-2 font-weight-bold h-20"
          >
            <SortFilterByValue />
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
          <th :colspan="count + 1" class="h-30 text-left" />
          <template>
            <th class="h-30 text-left text-subtitle-2 font-weight-bold" v-for="label in labels" :key="label.name">
              {{ label.name }}
            </th>
          </template>
        </tr>
      </thead>
    </template>
    <template v-slot:body="{ items }">
      <tbody ref="tableRef">
        <template v-for="(item, index) in items">
          <tr :key="index">
            <td>{{ item.metric[0].name }}</td>
            <td class="text-left" v-for="(metric, index2) in item.metric" :key="index2">
              <MetricValue :metricRow="metric" :fullText="true" :isLabels="isLabels" />
            </td>

            <template v-if="labels.length">
              <MetricTableLabelTd
                v-for="label in labels"
                :key="label.name + index"
                :label="label.name"
                :isLabel="true"
                :labels="item.label"
                :isLabels="isLabels"
              />
            </template>
          </tr>
        </template>
      </tbody>
    </template>
  </VDataTable>
</template>
<script lang="ts">
import MetricValue from './parts/MetricValue.vue'
import MetricTableLabelTd from './parts/MetricTableLabelTd.vue'
import SortFilterByName from './parts/sort-filter/SortFilterByName.vue'
import SortFilterByValue from './parts/sort-filter/SortFilterByValue.vue'

export default defineComponent({
  name: 'MetricTableCompareView',

  props: {
    count: {
      type: Number,
      default: 4
    },
    labels: {
      type: Array,
      default: () => []
    },
    height: Number,
    loading: Boolean,
    sticked: Boolean,
    metricData: Array,
    isSorted: Boolean
  },

  components: {
    MetricValue,
    MetricTableLabelTd,
    SortFilterByName,
    SortFilterByValue
  },

  setup(props, context) {
    const tableRef = ref(null)
    const { lastScrollTop } = useSortFilterTable({
      context,
      typeName: 'metric',
      routeName: 'workspace-project-jobs-job-run-metrics'
    })

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

    watch(tableRef, tableRef => {
      if (!tableRef || !tableRef.parentElement) return
      tableRef.parentElement.parentElement.onscroll = e => handleOnScroll(e)
    })

    return { isLabels, tableRef, isFullText, rowValueStyle, handleOnScroll }
  }
})
</script>
<style scoped>
.h-30 {
  height: 30px !important;
}
</style>
