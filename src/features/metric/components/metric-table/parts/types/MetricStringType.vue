<template>
  <v-tooltip top :nudge-left="nudgeLeft">
    <template v-slot:activator="{ on }">
      <div v-on="on" ref="divRef" :style="divStyles">
        {{ metricRow.value }}
      </div>
    </template>
    <span>{{ metricRow.value }}</span>
  </v-tooltip>
</template>
<script>
import { ref, watch, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MetricStringType',

  props: {
    isLabel: {
      type: Boolean,
      default: () => false
    },
    isLabels: {
      type: Boolean,
      default: () => false
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

  setup(props, context) {
    const divRef = ref(null)
    const divStyles = ref({})

    const nudgeLeft = ref(0)

    watch(divRef, async divRef => {
      if (!divRef) return

      const width = divRef.clientWidth || divRef.scrollWidth

      if (props.isLabel) {
        nudgeLeft.value = 10

        return
      }

      if (props.metricRow.value.length > 60) {
        nudgeLeft.value = width / 2 - 80
      } else {
        nudgeLeft.value = 100
      }

      if (!props.isLabels) {
        nudgeLeft.value = 400
      }
      divStyles.value = { maxWidth: `${width}px`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
    })

    return { divRef, nudgeLeft, divStyles }
  }
})
</script>
