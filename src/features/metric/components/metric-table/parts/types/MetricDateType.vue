<template>
  <span>{{ dateFormated }}</span>
</template>
<script>
import useMoment from '@/core/composition/useMoment'
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MetricDateType',

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

    // format date to next format
    // 11th February 2021
    const dateFormated = computed(() => {
      const dateUtc = moment.$moment.utc(props.metricRow.value)
      const localDate = moment.$moment(dateUtc).local()

      return localDate.format('Do MMMM YYYY')
    })

    return { dateFormated }
  }
})
</script>
