<template>
  <v-alert text outlined dense :type="statusType" class="d-flex mb-0">
    Last run on <strong> {{ ago(statusData.finished) }}</strong> was <strong>{{ statusValue }}</strong>
  </v-alert>
</template>

<script>
import { reactive, computed, createComponent } from '@vue/composition-api'
import useMoment from '@/core/composition/useMoment.js'

export default createComponent({
  name: 'AskAnnaAlertStatus',

  props: {
    statusData: {
      type: Object,
      default: function() {
        return {
          status: 'UNDIFENED',
          runtime: 0,
          memory: 0,
          return_payload: null,
          stdout: null,
          created: '',
          finished: ''
        }
      }
    }
  },

  setup(props, context) {
    const moment = useMoment(context)

    const TYPES = reactive({ SUCCESS: 'success', UNDIFENED: 'warning', FAILURE: 'error' })

    const status = props.statusData.status ? props.statusData.status : 'UNDIFENED'

    const statusType = computed(() => {
      return TYPES[status]
    })

    return { statusType, statusValue: status, ...moment }
  }
})
</script>
