<template>
  <v-flex class="fill-height px-5" fluid>
    <v-fade-transition mode="out-in">
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
    </v-fade-transition>
  </v-flex>
</template>

<script setup lang="ts">
import Markdown from '@/core/components/markdown/index.vue'

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
