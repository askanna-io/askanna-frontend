<template>
  <AskAnnaRow align="center" justify="center">
    <AskAnnaCol cols="12" class="pb-0 pt-0">
      <div class="page">
        <div>
          <TheHighlight v-if="jsonString" :value="jsonString" languageName="json" />
        </div>
      </div>
    </AskAnnaCol>
  </AskAnnaRow>
</template>

<script setup lang="ts">
defineProps({
  jsonString: String
})
</script>
