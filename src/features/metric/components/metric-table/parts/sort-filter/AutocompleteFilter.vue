<template>
  <VAutocomplete
    dense
    outlined
    clearable
    hide-details
    class="py-2 px-3 autocomplete-filter"
    :label="label"
    :items="items"
    :value="computedValue"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
const props = defineProps({
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
})

const state = inject('state')
const changeState = inject('changeState')

const computedValue = computed(() => state[props.filterName])

const handleChange = value => changeState({ path: props.filterName, value })
</script>
<style>
.autocomplete-filter .v-input__append-inner .v-input__icon.v-input__icon--append {
  cursor: pointer;
}
</style>
