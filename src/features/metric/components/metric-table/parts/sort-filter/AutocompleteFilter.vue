<template>
  <VAutocomplete
    clearable
    hide-details
    :label="label"
    :items="items"
    density="compact"
    variant="outlined"
    clear-icon="mdi-close"
    :model-value="computedValue"
    class="py-2 px-3 autocomplete-filter"
    @update:modelValue="handleChange"
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
.v-autocomplete .v-field__append-inner .v-autocomplete__menu-icon {
  margin-left: 0px;
}

.v-autocomplete .v-field__clearable {
  margin-right: 0px !important;
}
</style>
