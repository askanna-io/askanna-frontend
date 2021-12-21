<template>
  <div>
    <span class="font-weight-bold">{{ text }}:&nbsp;</span>
    <ask-anna-copy-text
      :text="value"
      :iconColor="'grey lighten-2'"
      :buttonType="{ text: true }"
      :styleClasses="'px-0 white primary--black font-weight-regular  body-1'"
    />
  </div>
</template>
<script setup lang="ts">
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
