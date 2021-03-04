<template>
  <span>{{ datetimeFormated }}</span>
</template>
<script>
import useMoment from '@/core/composition/useMoment'
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MetricDateTimeType',

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
    // format datetime to next format
    // 11th February 2021, 7:20:45 am
    const datetimeFormated = computed(() => {
      const dateUtc = moment.$moment.utc(props.metricRow.value)
      const localDate = moment.$moment(dateUtc).local()

      return localDate.format('Do MMMM YYYY, h:mm:ss a')
    })

    return { datetimeFormated }
  }
})
</script>
