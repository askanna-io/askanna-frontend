<template>
  <v-menu :close-on-content-click="false" v-model="menu" :nudge-width="200" nudge-right="60">
    <template v-slot:activator="{ on, attrs }">
      <span v-on="on" class="pr-5 cursor--pointer" @mouseover="handleOnHover" @mouseleave="handleOnBlur">
        Value
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
      <table-sort title="Value" sortBy="metric.value" />

      <v-divider />

      <autocomplete-filter label="Filter by data type" :items="typeValues" filterName="metric_type" />

      <v-divider />

      <filter-name-value v-if="false" class="pt-2" filterName="metric_value" label="Filter by metric value" />

      <v-card-actions v-if="false">
        <v-spacer />

        <v-btn small outlined text class="btn--hover" @click="menu = false">Cancel</v-btn>
        <v-btn small outlined color="secondary" text class="btn--hover" @click="handleApply">Apply</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
const typeValues = ['boolean', 'date', 'datetime', 'dictionary', 'float', 'integer', 'string', 'tag', 'time']

const menu = ref()
const active = ref(false)

const isActiveMetricValue = inject('isActiveMetricValue')

const isActive = computed(() => active.value || isActiveMetricValue.value || menu.value)

const handleOnBlur = () => (active.value = false)
const handleOnHover = () => (active.value = true)

const getColor = () => (isActiveMetricValue.value ? 'primary' : 'secondary')

const handleApply = () => {}
</script>
