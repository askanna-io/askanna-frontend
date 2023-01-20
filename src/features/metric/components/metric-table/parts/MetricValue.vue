<template>
  <Component :is="TypeComponent" v-bind="props" />
</template>
<script setup lang="ts">
import { get } from 'lodash'
import MetricTagType from './types/MetricTagType.vue'
import MetricTimeType from './types/MetricTimeType.vue'
import MetricDateType from './types/MetricDateType.vue'
import MetricFloatType from './types/MetricFloatType.vue'
import MetricStringType from './types/MetricStringType.vue'
import MetricBooleanType from './types/MetricBooleanType.vue'
import MetricIntegerType from './types/MetricIntegerType.vue'
import MetricDateTimeType from './types/MetricDateTimeType.vue'
import MetricDictionaryType from './types/MetricDictionaryType.vue'

const props = defineProps({
  isShowName: {
    type: Boolean,
    default: () => false
  },
  preview: {
    type: Boolean,
    default: () => true
  },
  isLabel: {
    type: Boolean,
    default: () => false
  },
  fullText: {
    type: Boolean,
    default: () => false
  },
  isLabels: {
    type: Boolean,
    default: () => false
  },
  maxStringLength: {
    type: Number,
    default: () => 20
  },
  metricRow: {
    type: Object,
    default: function () {
      return {
        name: '',
        type: '',
        value: ''
      }
    }
  }
})

const { metricRow } = props
const types = {
  tag: MetricTagType,
  date: MetricDateType,
  time: MetricTimeType,
  float: MetricFloatType,
  string: MetricStringType,
  boolean: MetricBooleanType,
  list: MetricDictionaryType,
  integer: MetricIntegerType,
  datetime: MetricDateTimeType,
  list_time: MetricDictionaryType,
  list_date: MetricDictionaryType,
  list_float: MetricDictionaryType,
  dictionary: MetricDictionaryType,
  list_string: MetricDictionaryType,
  list_boolean: MetricDictionaryType,
  list_integer: MetricDictionaryType,
  list_datetime: MetricDictionaryType
}
const TypeComponent = get(types, metricRow.type)
</script>
