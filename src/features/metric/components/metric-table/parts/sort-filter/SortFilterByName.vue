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
        Name
        <span
          class="mr-5"
          style="position: relative"
        >
          <AskAnnaIcon
            v-show="isActive"
            filter
            size="small"
            variant="outlined"
            text-color="white"
            :color="getColor()"
            icon="mdi-filter-variant"
            style="left: 3px; top: 1px; right: auto; position: absolute"
          />
        </span>
      </span>
    </template>

    <AskAnnaCard min-width="300">
      <SortByType
        title="Name"
        :sortBy="`${typeName}.name`"
      />

      <AskAnnaDivider />

      <FilterByType
        class="mt-2"
        :filterName="`${typeName}_name`"
        :label="`Filter by ${typeName} name`"
      />
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

const menu = ref()
const active = ref(false)

const isActiveMetricName = inject('isActiveMetricName')

const isActive = computed(() => active.value || isActiveMetricName.value || menu.value)

const handleOnBlur = () => (active.value = false)
const handleOnHover = () => (active.value = true)

const getColor = () => (isActiveMetricName.value ? 'primary' : 'secondary')
</script>
