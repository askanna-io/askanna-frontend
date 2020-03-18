<template>
  <v-chip class="ma-2" small label outlined :color="statusColor">
    <v-avatar left>
      <v-icon small>{{ statusIcon }}</v-icon>
    </v-avatar>
    {{ statusValue }}
  </v-chip>
</template>

<script>
import { reactive, computed, createComponent } from '@vue/composition-api'

export default createComponent({
  name: 'AskAnnaChipStatus',

  props: {
    status: String
  },

  setup(props) {
    const COLORS = reactive({ SUCCESS: 'success', UNDIFENED: 'grey', FAILURE: 'error' })
    const ICONS = reactive({
      UNDIFENED: 'mdi-do-not-disturb',
      FAILURE: 'mdi-close-circle-outline',
      SUCCESS: 'mdi-checkbox-marked-circle'
    })
    const status = props.status ? props.status : 'UNDIFENED'

    const statusColor = computed(() => {
      return COLORS[status]
    })

    const statusIcon = computed(() => {
      return ICONS[status]
    })

    return { statusColor, statusIcon, statusValue: status }
  }
})
</script>
