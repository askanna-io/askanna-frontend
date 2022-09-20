<template>
  <v-chip-group active-class="primary--text" column>
    <v-chip v-for="label in value.labels" :key="label.name" small pill @click="handleClick">
      <MetricValue :metricRow="label" isShowName isLabels isLabel :preview="false" />
    </v-chip>
  </v-chip-group>
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
  },
  count: {
    type: Number,
    default: 4
  }
})

const show = ref(false)

const handleClick = () => (show.value = !show.value)
</script>
<style lang="scss">
.label-item {
  display: flex;
  height: 100%;
  align-items: center;
}
</style>
