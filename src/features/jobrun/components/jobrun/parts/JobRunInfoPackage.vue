<template>
  <div>
    <span class="font-weight-bold">{{ text }}:</span
    ><v-btn
      color="primary"
      class="pl-1 pr-0 text-body-1 text-transform--initial AskAnna-text--initial text-body-1"
      text
      x-small
      :to="{
        name: 'workspace-project-jobs-job-jobrun-code'
      }"
    >
      {{ value }}</v-btn
    >
    <ask-anna-copy-text
      :text="value"
      :showText="false"
      :iconColor="'grey lighten-2'"
      :buttonType="{ text: true }"
      :styleClasses="'px-0 white font-weight-regular text--regular body-1'"
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
    type: String,
    default: ''
  }
})
</script>
