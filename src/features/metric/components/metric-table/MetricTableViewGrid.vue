<template>
  <v-container fluid class="metric--grid">
    <v-row justify="start" v-sticky="sticked" sticky-offset="{top: 68, bottom: 10}">
      <v-col class="text-left text-subtitle-2 font-weight-bold h-20 text--secondary">
        <TableFilter title="Name" sortBy="metric.name" @onSort="handleOnSort" />
      </v-col>

      <v-col class="text-left text-subtitle-2 font-weight-bold h-20 text--secondary">
        <TableFilter title="Value" sortBy="metric.value" @onSort="handleOnSort" />
      </v-col>

      <v-col cols="8">
        <span class="text-left text-subtitle-2 font-weight-bold h-20 text--secondary">
          Labels
        </span>
        <v-row no-gutters class="">
          <v-col class="text-left text-subtitle-2 text--secondary" v-for="label in labels" :key="label">
            <lable-filter :title="label" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <ask-anna-loading-progress :type="'table-row'" :loading="loading">
      <div>
        <template v-for="(item, index) in items">
          <v-hover v-slot="{ hover }" :key="`${index}`">
            <v-row
              class="metric--row cursor--pointer"
              :class="{ 'metric--row--first': index === 0, 'metric--row--hover': hover }"
              justify="start"
              v-for="(metric, index2) in item.metric"
              :key="`${index}-${index2}`"
            >
              <v-col class="metric--item">{{ metric.name }}</v-col>
              <v-col class="metric--item"><metric-value :metricRow="metric" /></v-col>

              <v-col cols="8">
                <v-row no-gutters>
                  <v-col class="text-left text-subtitle-2 metric--item" v-for="label in labels" :key="label">
                    <metric-value :metricRow="getLabelValue({ labels: item.label, label })" />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-hover>
        </template>
      </div>
    </ask-anna-loading-progress>
  </v-container>
</template>
<script>
import MetricValue from './parts/MetricValue'
import LableFilter from './parts/LableFilter'
import TableFilter from './parts/TableFilter'

import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MetricTableViewGrid',

  props: {
    items: Array,
    labels: Array,
    loading: Boolean,
    sticked: Boolean
  },

  components: { MetricValue, LableFilter, TableFilter },

  setup(props, context) {
    const getLabelValue = ({ label, labels }) => {
      const value = labels.find(item => item.name === label)
      if (!value) return { name: null, value: null, type: 'undefined' }

      return { ...value }
    }

    const handleOnSort = data => context.emit('onSort', data)

    return { getLabelValue, handleOnSort }
  }
})
</script>
<style lang="scss">
.grid--container {
  &main--row {
    display: grid;
    justify-content: start;
    grid-template-columns: 25% auto auto;
    grid-template-rows: 25% 100px auto;
  }
}
.sub-grid {
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(auto-fill, 120px);
  grid-row-gap: 0.5em;
  grid-column-gap: 1em;
}

.metric--grid {
  .metric--row {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);

    &--hover {
      background: #eeeeee;
    }

    &--first {
      border-top: thin solid rgba(0, 0, 0, 0.12);
    }
  }
  .metric--item {
    font-size: 14px;
  }
}
</style>
