<template>
  <div>
    <span class="font-weight-bold">{{ text }}:&nbsp;</span>
    <AskAnnaCopyText
      :text="value"
      :iconColor="'grey lighten-2'"
      :buttonType="{ text: true }"
      :styleClasses="'px-0 white primary--black font-weight-regular  body-1'"
    />
  </div>
</template>
<script setup lang="ts">
import AskAnnaCopyText from '@/core/components/shared/AskAnnaCopyText.vue'

defineProps({
  text: {
    type: String,
    default: ''
  },
  value: {
    type: String | Number,
    default: ''
  }
})
</script>
