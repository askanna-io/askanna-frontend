<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MetricBooleanType',

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
    const { metricRow } = context.props

    let icon = 'mdi-close'

    if (metricRow.value === 'null') {
      icon = 'mdi-record'
    }
    if (metricRow.value === true) {
      icon = 'mdi-check'
    }

    return <v-icon>{icon}</v-icon>
  }
})
</script>
