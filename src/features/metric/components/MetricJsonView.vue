<template>
  <div class="flex items-center justify-center">
    <div class="w-full">
      <div class="page">
        <div>
          <TheHighlight
            v-if="jsonString"
            :value="jsonString"
            languageName="json"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  jsonString: String
})
</script>
