<template>
  <VMenu
    v-model="menu"
    location="end"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <span
        v-bind="props"
        class="pr-5 cursor-pointer"
        @mouseover="handleOnHover"
        @mouseleave="handleOnBlur"
      >
        Value
        <span
          class="mr-5"
          style="position: relative"
        >
          <AskAnnaIcon
            style="left: 3px; top: 1px; right: auto; position: absolute"
            filter
            size="small"
            v-show="isActive"
            variant="outlined"
            text-color="white"
            :color="getColor()"
            icon="mdi-filter-variant"
          />
        </span>
      </span>
    </template>

    <AskAnnaCard min-width="300">
      <SortByType
        title="Value"
        :sortBy="`${typeName}.value`"
      />

      <AskAnnaDivider />

      <AutocompleteFilter
        :items="typeValues"
        label="Filter by data type"
        :filterName="`${typeName}_type`"
      />

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
</script>
