<template>
  <div class="flex fill-height justify-center">
    <VFadeTransition mode="out-in">
      <VLazy
        :options="{
          threshold: 0.5
        }"
        transition="fade-transition"
      >
        <img
          class="code-img"
          :src="imgSrc"
        />
      </VLazy>
    </VFadeTransition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  fileBlob: {
    type: Blob,
    default: () => ''
  }
})

const imgSrc = computed(() => {
  if (!props.fileBlob) return ''

  const urlCreator = window.URL || window.webkitURL
  const imgSrc = urlCreator.createObjectURL(props.fileBlob)

  return imgSrc
})
</script>
<style scoped>
.code-img {
  max-width: 100%;
}
</style>
