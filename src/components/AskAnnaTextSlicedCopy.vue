<template>
  <div class="group">
    {{ valueSliced }}
    <AskAnnaTooltip v-if="isSliced">
      {{ value }}
    </AskAnnaTooltip>
    <AskAnnaCopyText
      icon
      :text="value"
      :showText="false"
      :buttonType="{ text: true }"
      :class="'invisible group-hover:visible px-0 '"
    />
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
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
  () => props.value?.length > (props.params.slicedFromStart ? props.maxLengthStart : props.maxLength)
)
</script>
