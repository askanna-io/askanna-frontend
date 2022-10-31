<template>
  <v-menu :close-on-content-click="false" v-model="menu" :nudge-width="200" nudge-right="60">
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
      <table-sort title="Name" sortBy="variable.name" />

      <AskAnnaDivider />

      <filter-name-value class="mt-2" filterName="variable_name" label="Filter by variable name" />

      <AskAnnaCardActions v-if="false">
        <AskAnnaSpacer />

        <AskAnnaButton small outlined text class="btn--hover" @click="menu = false"> Cancel </AskAnnaButton>
        <AskAnnaButton small outlined color="secondary" text class="btn--hover" @click="handleApply">
          Apply
        </AskAnnaButton>
      </AskAnnaCardActions>
    </AskAnnaCard>
  </v-menu>
</template>

<script setup lang="ts">
const menu = ref()
const active = ref(false)

const isActiveMetricName = inject('isActiveMetricName')

const isActive = computed(() => active.value || isActiveMetricName.value || menu.value)

const handleOnBlur = () => (active.value = false)
const handleOnHover = () => (active.value = true)

const getColor = () => (isActiveMetricName.value ? 'primary' : 'secondary')

const handleApply = () => {}
</script>
