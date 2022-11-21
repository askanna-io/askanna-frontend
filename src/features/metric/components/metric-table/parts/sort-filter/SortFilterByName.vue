<template>
  <VMenu :close-on-content-click="false" v-model="menu" :nudge-width="200" nudge-right="60">
    <template v-slot:activator="{ on, attrs }">
      <span v-on="on" class="pr-5 cursor--pointer" @mouseover="handleOnHover" @mouseleave="handleOnBlur">
        Name
        <span class="mr-5" style="position: relative">
          <AskAnnaIcon
            v-bind="attrs"
            v-show="isActive"
            text
            small
            filter
            outlined
            :color="getColor()"
            text-color="white"
            style="left: 3px; top: 1px; right: auto; position: absolute"
          >
            mdi-filter-variant
          </AskAnnaIcon>
        </span>
      </span>
    </template>

    <AskAnnaCard>
      <SortByType title="Name" :sortBy="`${typeName}.name`" />

      <AskAnnaDivider />

      <FilterByType class="mt-2" :filterName="`${typeName}_name`" :label="`Filter by ${typeName} name`" />

      <AskAnnaCardActions v-if="false">
        <AskAnnaSpacer />

        <AskAnnaButton small outlined text class="btn--hover" @click="menu = false">Cancel</AskAnnaButton>
        <AskAnnaButton small outlined color="secondary" text class="btn--hover" @click="handleApply">
          Apply
        </AskAnnaButton>
      </AskAnnaCardActions>
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

const handleApply = () => {}
</script>
