<template>
  <AskAnnaTooltip top content-class="opacity-1">
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <template v-if="text"
          ><span class="font-weight-bold">{{ text }}: &nbsp;</span></template
        ><AskAnnaChipStatus :status="value" />
      </div>
    </template>
    Status of the run
  </AskAnnaTooltip>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  }
})
</script>
