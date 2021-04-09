<template>
  <v-text-field
    dense
    outlined
    required
    clearable
    class="px-3 pb-2"
    hide-details
    :label="label"
    @input="handleChange"
    :value="computedValue"
  />
</template>

<script>
import { inject, defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'FilterNameValue',

  props: {
    label: {
      type: String,
      default: ''
    },
    filterName: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const state = inject('state')
    const changeState = inject('changeState')

    const computedValue = computed(() => state[props.filterName])

    const handleChange = value => changeState({ path: props.filterName, value })

    return {
      handleChange,
      computedValue
    }
  }
})
</script>
