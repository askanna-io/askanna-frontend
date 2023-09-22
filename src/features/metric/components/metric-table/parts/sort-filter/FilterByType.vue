<template>
  <AskAnnaTextField
    required
    clearable
    hide-details
    :label="label"
    class="px-3 pb-2"
    :model-value="computedValue"
    @update:modelValue="handleChange"
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
