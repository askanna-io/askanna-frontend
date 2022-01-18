<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pb-0 pt-0">
      <div class="page">
        <div>
          <TheHighlight v-if="jsonString" :value="jsonString" languageName="json" />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import TheHighlight from '@/core/components/highlight/TheHighlight.vue'

defineProps({
  jsonString: String
})
</script>
