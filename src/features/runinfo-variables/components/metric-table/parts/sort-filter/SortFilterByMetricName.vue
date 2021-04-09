<template>
  <v-menu :close-on-content-click="false" v-model="menu" :nudge-width="200" nudge-right="60">
    <template v-slot:activator="{ on, attrs }">
      <span v-on="on" class="pr-5 cursor--pointer" @mouseover="handleOnHover" @mouseleave="handleOnBlur">
        Name
        <span class="mr-5" style="position: relative;">
          <v-icon
            v-bind="attrs"
            v-show="isActive"
            text
            small
            filter
            outlined
            :color="getColor()"
            text-color="white"
            style="left: 3px; top: 1px; right: auto; position: absolute;"
          >
            mdi-filter-variant
          </v-icon>
        </span>
      </span>
    </template>

    <v-card>
      <table-sort title="Name" sortBy="variable.name" />

      <v-divider />

      <filter-name-value class="mt-2" filterName="variable_name" label="Filter by variable name" />

      <v-card-actions v-if="false">
        <v-spacer></v-spacer>

        <v-btn small outlined text class="btn--hover" @click="menu = false">
          Cancel
        </v-btn>
        <v-btn small outlined color="secondary" text class="btn--hover" @click="handleApply">
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import TableSort from './TableSort'
import FilterNameValue from './FilterNameValue'

import { ref, inject, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'SortFilterByMetricName',

  components: { TableSort, FilterNameValue },

  setup() {
    const menu = ref()
    const active = ref(false)

    const isActiveMetricName = inject('isActiveMetricName')

    const isActive = computed(() => active.value || isActiveMetricName.value || menu.value)

    const handleOnBlur = () => (active.value = false)
    const handleOnHover = () => (active.value = true)

    const getColor = () => (isActiveMetricName.value ? 'primary' : 'secondary')

    const handleApply = () => {}

    return {
      menu,
      getColor,
      isActive,

      handleApply,
      handleOnBlur,
      handleOnHover
    }
  }
})
</script>
