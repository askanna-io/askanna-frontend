<template>
  <v-autocomplete
    dense
    outlined
    clearable
    class="py-2 px-3 autocomplete-filter"
    hide-details
    :label="label"
    :items="items"
    :value="computedValue"
    @change="handleChange"
  />
</template>

<script>
import { inject, defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'AutocompleteFilter',

  props: {
    label: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => []
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
<style>
.autocomplete-filter .v-input__append-inner .v-input__icon.v-input__icon--append {
  cursor: pointer;
}
</style>
