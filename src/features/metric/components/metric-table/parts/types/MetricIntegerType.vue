<script>
import { defineComponent } from '@vue/composition-api'
import useNumeral from '@/core/composition/useNumeral'

export default defineComponent({
  name: 'MetricIntegerType',

  functional: true,

  props: {
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
    const numeral = useNumeral()

    const { metricRow } = context.props

    return <span>{numeral.numberFormated(metricRow.value)}</span>
  }
})
</script>
