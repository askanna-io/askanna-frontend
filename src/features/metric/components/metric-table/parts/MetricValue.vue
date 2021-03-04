<script>
import MetricTagType from './types/MetricTagType'
import MetricTimeType from './types/MetricTimeType'
import MetricDateType from './types/MetricDateType'
import MetricFloatType from './types/MetricFloatType'
import { defineComponent } from '@vue/composition-api'
import MetricStringType from './types/MetricStringType'
import MetricBooleanType from './types/MetricBooleanType'
import MetricIntegerType from './types/MetricIntegerType'
import MetricDateTimeType from './types/MetricDateTimeType'
import MetricDictionaryType from './types/MetricDictionaryType'

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
      integer: MetricIntegerType,
      datetime: MetricDateTimeType,
      dictionary: MetricDictionaryType
    }
    const TypeComponent = types[metricRow.type]

    return h(TypeComponent, { props: context.props })
  }
})
</script>
