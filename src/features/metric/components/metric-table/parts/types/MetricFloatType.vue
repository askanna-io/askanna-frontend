<template>
  <v-tooltip top left :nudge-left="nudgeLeft">
    <template v-slot:activator="{ on }">
      <div v-on="on" ref="divRef">
        {{ slicedNumber }}
      </div>
    </template>
    <span>{{ metricRow.value }}</span>
  </v-tooltip>
</template>
<script>
import useNumeral from '@/core/composition/useNumeral'
import { ref, watch, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MetricFloatType',

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

  setup(props) {
    const numeral = useNumeral()

    const divRef = ref(null)
    const nudgeLeft = ref(0)

    const slicedNumber = computed(() => numeral.numberFormated(props.metricRow.value))

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
        if (!props.isLabels) {
          nudgeLeft.value = 420

          return
        }
      }

      if (!props.isLabels) {
        nudgeLeft.value = 400
      }
    })

    return { divRef, nudgeLeft, slicedNumber }
  }
})
</script>
