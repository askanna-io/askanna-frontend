<template>
  <v-menu :close-on-content-click="false" v-model="menu" :nudge-width="200" nudge-right="60">
    <template v-slot:activator="{ on, attrs }">
      <span v-on="on" class="pr-5 cursor--pointer" @mouseover="handleOnHover" @mouseleave="handleOnBlur">
        Labels
        <span class="mr-5" style="position: relative;">
          <v-icon
            style="left: 3px; top: 1px; right: auto; position: absolute;"
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
          </v-icon>
        </span>
      </span>
    </template>

    <v-card>
      <autocomplete-filter label="Filter by label name" :items="labels" filterName="label_name" />

      <v-divider />

      <filter-name-value class="pt-2" filterName="label_value" label="Filter by label value" />

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
import AutocompleteFilter from './AutocompleteFilter'
import { ref, inject, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'SortFilterByMetricLabel',

  props: {
    labels: {
      type: Array,
      default: () => []
    }
  },

  components: { TableSort, FilterNameValue, AutocompleteFilter },

  setup() {
    const menu = ref()
    const active = ref(false)

    const isActiveLabelFilter = inject('isActiveLabelFilter')

    const isActive = computed(() => active.value || isActiveLabelFilter.value || menu.value)

    const handleOnBlur = () => (active.value = false)
    const handleOnHover = () => (active.value = true)

    const getColor = () => (isActiveLabelFilter.value ? 'primary' : 'secondary')

    const handleApply = () => {}

    return {
      menu,
      getColor,
      isActive,

      handleOnBlur,
      handleOnHover,
      handleApply
    }
  }
})
</script>
