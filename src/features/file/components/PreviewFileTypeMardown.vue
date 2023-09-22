<template>
  <div class="flex fill-height px-4">
    <VFadeTransition mode="out-in">
      <Marked
        :images="images"
        :source="fileSource"
        :cdnBaseUrl="cdnBaseUrl"
      />
    </VFadeTransition>
  </div>
</template>

<script setup lang="ts">
defineProps({
  fileSource: {
    type: [String, Object, Blob],
    default: () => ''
  },
  images: {
    type: Array,
    default: () => []
  },
  cdnBaseUrl: {
    type: String,
    default: () => ''
  }
})
</script>
