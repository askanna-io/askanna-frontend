<script lang="ts">
import MetricTagType from './types/MetricTagType.vue'
import { defineComponent } from '@vue/composition-api'
import MetricTimeType from './types/MetricTimeType.vue'
import MetricDateType from './types/MetricDateType.vue'
import MetricFloatType from './types/MetricFloatType.vue'
import MetricStringType from './types/MetricStringType.vue'
import MetricBooleanType from './types/MetricBooleanType.vue'
import MetricIntegerType from './types/MetricIntegerType.vue'
import MetricDateTimeType from './types/MetricDateTimeType.vue'
import MetricDictionaryType from './types/MetricDictionaryType.vue'

export default defineComponent({
  name: 'MetricValue',

  functional: true,

  props: {
    isLabel: {
      type: Boolean,
      default: () => false
    },
    fullText: {
      type: Boolean,
      default: () => false
    },
    isLabels: {
      type: Boolean,
      default: () => false
    },
    maxStringLength: {
      type: Number,
      default: () => 20
    },
    metricRow: {
      type: Object,
      default: function () {
        return {
          name: '',
          type: '',
          value: ''
        }
      }
    }
  },

  render(h, context) {
    const { metricRow } = context.props
    const types = {
      tag: MetricTagType,
      date: MetricDateType,
      time: MetricTimeType,
      float: MetricFloatType,
      string: MetricStringType,
      boolean: MetricBooleanType,
      list: MetricDictionaryType,
      integer: MetricIntegerType,
      datetime: MetricDateTimeType,
      dictionary: MetricDictionaryType
    }
    const TypeComponent = types[metricRow.type]

    return h(TypeComponent, { props: context.props })
  }
})
</script>
