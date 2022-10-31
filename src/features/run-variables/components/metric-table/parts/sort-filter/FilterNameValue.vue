<template>
  <AskAnnaTextField
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

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: ''
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
