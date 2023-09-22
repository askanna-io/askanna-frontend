<template>
  <VChipGroup
    column
    selected-class="text-primary"
  >
    <AskAnnaChip
      v-for="label in value.labels"
      pill
      size="small"
      :key="label.name"
    >
      <MetricValue
        isLabel
        isLabels
        :isShowName="true"
        :preview="false"
        :metricRow="label"
      />
    </AskAnnaChip>
  </VChipGroup>
</template>
<script setup lang="ts">
defineProps({
  value: {
    type: Object,
    default: () => ({
      labels: [],
      label: '',
      metricName: '',
      isLabels: false
    })
  }
})
</script>
<style lang="scss">
.label-item {
  display: flex;
  height: 100%;
  align-items: center;
}
</style>
