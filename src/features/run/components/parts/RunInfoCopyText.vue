<template>
  <div class="group flex items-center">
    <span class="font-bold mr-1">{{ title }}:</span>
    <AskAnnaCopyText
      :text="value"
      class="flex items-center"
      :copyTitle="copyTitle"
      :iconColor="'grey lighten-2'"
      :buttonType="{ text: true }"
      :styleClasses="'px-0 text-main font-normal'"
    />
  </div>
</template>
<script setup lang="ts">
defineProps({
  title: String,
  value: String,
  copyTitle: {
    type: String,
    default: 'Copy'
  }
})
</script>
