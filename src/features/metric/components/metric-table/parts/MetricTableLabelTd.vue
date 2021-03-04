<template>
  <td class="text-left" :key="label" :style="labelStyles">
    <metric-value :metricRow="labelValue" :isLabels="isLabels" :isLabel="isLabel" />
  </td>
</template>
<script>
import MetricValue from './MetricValue'

import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'MetricTableLabelTd',

  props: {
    isLabel: {
      type: Boolean,
      default: () => false
    },
    labels: Array,
    label: String,
    isLabels: Boolean
  },

  components: { MetricValue },

  setup(props, context) {
    const types = {
      tag: {},
      date: { minWidth: '160px' },
      time: { minWidth: '110px' },
      float: {},
      string: { minWidth: '190px' },
      boolean: { minWidth: '95px' },
      integer: {},
      datetime: { minWidth: '240px' },
      dictionary: { minWidth: '190px' }
    }

    const labelValue = computed(() => {
      const value = props.labels.find(item => item.name === props.label)

      return { ...value }
    })

    const labelStyles = computed(() => {
      return types[labelValue.value.type]
    })

    return { labelValue, labelStyles }
  }
})
</script>
