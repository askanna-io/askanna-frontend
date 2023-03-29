<template>
  <VDataTable
    class="pt-2"
    :height="height"
    disable-pagination
    :items="metricData"
    hide-default-footer
    :mobile-breakpoint="-1"
  >
    <template v-slot:header>
      <thead v-if="metricData.length || isSorted">
        <tr>
          <th
            :style="{ width: '20%', minWidth: '110px' }"
            :class="{ 'AskAnna-box-shadow--none': isLabels }"
            class="text-left text-subtitle-2 font-weight-bold"
          >
            <SortFilterByName typeName="variable" />
          </th>
          <th
            :style="rowValueStyle"
            :class="{ 'AskAnna-box-shadow--none': isLabels }"
            class="text-left text-subtitle-2 font-weight-bold"
          >
            <SortFilterByValue typeName="variable" />
          </th>
          <th
            v-if="isLabels"
            :colspan="labels?.length"
            class="text-left text-subtitle-2 font-weight-bold AskAnna-box-shadow--none"
          >
            Labels
          </th>
        </tr>
        <tr v-if="isLabels">
          <th
            colspan="2"
            class="h-30 text-left"
          />
          <template>
            <th
              class="h-30 text-left text-subtitle-2 font-weight-bold"
              v-for="(label, index) in labels"
              :key="label.name + index"
            >
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
            <td>{{ item.variable.name }}</td>
            <td class="text-left">
              <MetricValue
                :metricRow="item.variable"
                :fullText="true"
                :isLabels="isLabels"
              />
            </td>
            <template v-if="labels?.length">
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
import MetricValue from '@/features/metric/components/metric-table/parts/MetricValue.vue'
import MetricTableLabelTd from '@/features/metric/components/metric-table/parts/MetricTableLabelTd.vue'
import SortFilterByName from '@/features/metric/components/metric-table/parts/sort-filter/SortFilterByName.vue'
import SortFilterByValue from '@/features/metric/components/metric-table/parts/sort-filter/SortFilterByValue.vue'

export default defineComponent({
  name: 'VariablesTableView',

  props: {
    labels: Array,
    height: Number,
    loading: Boolean,
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
      typeName: 'variable',
      routeName: 'workspace-project-jobs-job-run-variables'
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

    const isFullText = computed(() => props.labels?.length <= 1)
    const isLabels = computed(() => Boolean(props.labels?.length))

    const rowValueStyle = computed(() => {
      let style = {
        width: '35%',
        minWidth: '240px'
      }
      if (!props.labels?.length) {
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
<style scoped>.h-30 {
  height: 30px !important;
}</style>
