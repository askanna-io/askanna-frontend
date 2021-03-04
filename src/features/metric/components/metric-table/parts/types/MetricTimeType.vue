<template>
  <span>{{ timeFormated }}</span>
</template>
<script>
import useMoment from '@/core/composition/useMoment'
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MetricTimeType',

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

  setup(props, context) {
    const moment = useMoment(context)
    // format time to next format
    // h:m:s
    //  moment.$moment(Date.parse(props.metricRow.value)).format(' Do MMMM YYYY, h:mm:ss a')
    //2174-11-21T14:32:59
    const timeFormated = computed(() => {
      const timeUtc = moment.$moment.utc(`1987-08-30T${props.metricRow.value}`)
      const localTime = moment.$moment(timeUtc).local(true)

      return localTime.format('h:mm:ss a')
    })

    return { timeFormated }
  }
})
</script>
