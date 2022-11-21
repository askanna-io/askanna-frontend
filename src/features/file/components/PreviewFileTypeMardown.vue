<template>
  <AskAnnaFlex class="fill-height px-5" fluid>
    <VFadeTransition mode="out-in">
      <Markdown
        :images="images"
        :source="fileSource"
        :cdnBaseUrl="cdnBaseUrl"
        html
        breaks
        langPrefix
        linkify
        quotes
        typographer
        xhtmlOut
      />
    </VFadeTransition>
  </AskAnnaFlex>
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
