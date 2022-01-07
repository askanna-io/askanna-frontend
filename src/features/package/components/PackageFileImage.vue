<template>
  <v-container class="pa-0 fill-height justify-center" fluid>
    <v-fade-transition mode="out-in">
      <v-lazy
        :options="{
          threshold: 0.5
        }"
        transition="fade-transition"
      >
        <img class="code-img" :src="imgSrc" />
      </v-lazy>
    </v-fade-transition>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from '@vue/composition-api'

const props = defineProps({
  dataSource: {
    type: Blob,
    default: function () {
      return ''
    }
  }
})

const imgSrc = computed(() => {
  if (!props.dataSource) return ''

  const urlCreator = window.URL || window.webkitURL
  const imgSrc = urlCreator.createObjectURL(props.dataSource)

  return imgSrc
})
</script>
<style scoped>
.code-img {
  max-width: 100%;
}
</style>
