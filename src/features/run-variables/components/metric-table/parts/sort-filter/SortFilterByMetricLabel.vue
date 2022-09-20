<template>
  <v-menu :close-on-content-click="false" v-model="menu" :nudge-width="200" nudge-right="60">
    <template v-slot:activator="{ on, attrs }">
      <span v-on="on" class="pr-5 cursor--pointer" @mouseover="handleOnHover" @mouseleave="handleOnBlur">
        Labels
        <span class="mr-5" style="position: relative">
          <v-icon
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

        <v-btn small outlined text class="btn--hover" @click="menu = false"> Cancel </v-btn>
        <v-btn small outlined color="secondary" text class="btn--hover" @click="handleApply"> Apply </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
defineProps({
  labels: {
    type: Array,
    default: () => []
  }
})

const menu = ref()
const active = ref(false)

const isActiveLabelFilter = inject('isActiveLabelFilter')

const isActive = computed(() => active.value || isActiveLabelFilter.value || menu.value)

const handleOnBlur = () => (active.value = false)
const handleOnHover = () => (active.value = true)

const getColor = () => (isActiveLabelFilter.value ? 'primary' : 'secondary')

const handleApply = () => {}
</script>
