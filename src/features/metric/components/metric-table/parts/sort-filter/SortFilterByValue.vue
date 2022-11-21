<template>
  <VMenu :close-on-content-click="false" v-model="menu" :nudge-width="200" nudge-right="60">
    <template v-slot:activator="{ on, attrs }">
      <span v-on="on" class="pr-5 cursor--pointer" @mouseover="handleOnHover" @mouseleave="handleOnBlur">
        Value
        <span class="mr-5" style="position: relative">
          <AskAnnaIcon
            style="left: 3px; top: 1px; right: auto; position: absolute"
            v-show="isActive"
            v-bind="attrs"
            text
            outlined
            small
            :color="getColor()"
            text-color="white"
            filter
          >
            mdi-filter-variant
          </AskAnnaIcon>
        </span>
      </span>
    </template>

    <AskAnnaCard>
      <SortByType title="Value" :sortBy="`${typeName}.value`" />

      <AskAnnaDivider />

      <AutocompleteFilter label="Filter by data type" :items="typeValues" :filterName="`${typeName}_type`" />

      <AskAnnaDivider />
    </AskAnnaCard>
  </VMenu>
</template>

<script setup lang="ts">
defineProps({
  typeName: {
    type: String,
    default: 'metric'
  }
})

const typeValues = ['boolean', 'date', 'datetime', 'dictionary', 'float', 'integer', 'string', 'tag', 'time', 'list']

const menu = ref()
const active = ref(false)

const isActiveMetricValue = inject('isActiveMetricValue')

const isActive = computed(() => active.value || isActiveMetricValue.value || menu.value)

const handleOnBlur = () => (active.value = false)
const handleOnHover = () => (active.value = true)

const getColor = () => (isActiveMetricValue.value ? 'primary' : 'secondary')

const handleApply = () => {}
</script>
