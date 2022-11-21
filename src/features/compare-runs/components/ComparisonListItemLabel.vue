<template>
  <VChipGroup active-class="primary--text" column>
    <AskAnnaChip v-for="label in value.labels" :key="label.name" small pill>
      <MetricValue :metricRow="label" isShowName isLabels isLabel :preview="false" />
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
