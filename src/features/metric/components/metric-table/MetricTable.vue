<template>
  <VDataTableServer
    :itemsLength="0"
    :items="metricData"
    :mobile-breakpoint="0"
    :options.sync="options"
    class="askanna-table"
  >
    <template v-slot:headers>
      <template v-if="metricData.length || isSorted">
        <tr>
          <th
            :style="{ width: '20%', minWidth: '110px' }"
            :class="{ 'shadow-none border-none h-8': isLabels }"
            class="text-left text-subtitle-2 font-bold px-4"
          >
            <SortFilterByName />
          </th>
          <th
            :style="rowValueStyle"
            :class="{ 'shadow-none border-none h-8': isLabels }"
            class="text-left text-subtitle-2 font-bold px-4"
          >
            <SortFilterByValue />
          </th>
          <th
            v-if="isLabels"
            :colspan="labels?.length"
            class="h-8 text-left text-subtitle-2 font-bold shadow-none border-none px-4"
          >
            Labels
          </th>
        </tr>
        <tr v-if="isLabels">
          <th
            colspan="2"
            class="h-6 text-left"
          />
          <th
            v-for="label in labels"
            :key="label.name"
            class="h-6 text-left text-subtitle-2 font-bold px-4 w-1/6"
          >
            {{ label.name }}
          </th>
        </tr>
      </template>
    </template>
    <template v-slot:body="{ items }">
      <template
        v-for="(item, index) in items"
        :key="index"
      >
        <tr class="pointer hover:bg-third max-w-max">
          <AskAnnaTableItem><span class="whitespace-nowrap">{{ item.raw.metric.name }}</span></AskAnnaTableItem>

          <AskAnnaTableItem>
            <MetricValue
              :fullText="true"
              :isLabels="isLabels"
              :metricRow="item.raw.metric"
              :labelsCount="labels?.length"
            />
          </AskAnnaTableItem>

          <template v-if="labels.length">
            <MetricTableLabelTd
              v-for="label in labels"
              :isLabel="true"
              :label="label.name"
              :isLabels="isLabels"
              :labels="item.raw.label"
              :key="label.name + index"
            />
          </template>
        </tr>
      </template>
    </template>
    <template v-slot:bottom>
    </template>
  </VDataTableServer>
</template>
<script setup lang="ts">
import MetricValue from './parts/MetricValue.vue'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import MetricTableLabelTd from './parts/MetricTableLabelTd.vue'
import SortFilterByName from './parts/sort-filter/SortFilterByName.vue'
import SortFilterByValue from './parts/sort-filter/SortFilterByValue.vue'

const emit = defineEmits(['onSort', 'onScroll'])

const props = defineProps({
  labels: Array,
  height: Number,
  loading: Boolean,
  metricData: Array,
  isSorted: Boolean,
  options: Object
})

useSortFilterTable({
  emit,
  typeName: 'metric',
  routeName: 'workspace-project-jobs-job-run-metrics'
})

const isLabels = computed(() => Boolean(props.labels.length))

const rowValueStyle = computed(() => {
  let style = {
    width: '80%',
    minWidth: '240px'
  }
  if (props.labels?.length) {
    style = {
      width: '15%',
      minWidth: '240px'
    }
  }

  return style
})
</script>