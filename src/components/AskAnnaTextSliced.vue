<template>
  <span>
    <v-tooltip v-if="isSliced" top content-class="opacity-1">
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <span>{{ valueSliced }}</span>
        </div>
      </template>
      <div>{{ value }}</div>
    </v-tooltip>

    <template v-else>
      {{ valueSliced }}
    </template>
  </span>
</template>
<script setup lang="ts">
const props = defineProps({
  value: {
    type: String,
    default: () => ''
  },
  maxLength: {
    type: Number,
    default: () => 23
  },
  maxLengthStart: {
    type: Number,
    default: () => 35
  },
  params: {
    type: Object,
    default: () => ({
      fullValue: false,
      slicedFromStart: false
    })
  }
})

const slicedText = useSlicedText()
const slicedStartText = useStartSlicedText()

const valueSliced = computed(() =>
  props.params.slicedFromStart
    ? slicedStartText(props.value, props.maxLengthStart)
    : slicedText(props.value, props.maxLength)
)

const isSliced = computed(
  () => props.value.length > (props.params.slicedFromStart ? props.maxLengthStart : props.maxLength)
)
</script>
