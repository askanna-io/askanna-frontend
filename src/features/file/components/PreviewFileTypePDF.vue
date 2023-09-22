<template>
  <div
    class="fill-height"
    :class="{ 'px-4': !$vuetify.display.xs }"
  >
    <div
      v-if="fileStore.isEmbedPdfSuccess"
      id="pdf"
    ></div>
  </div>
</template>

<script setup lang="ts">
import pdfobject from 'pdfobject'

const fileStore = useFileStore()
const loading = computed(() => fileStore.loading)

watch(loading, value => {
  if (value) return

  const options = {
    height: '100vh',
    pdfOpenParams: {
      navpanes: 0,
      toolbar: 1,
      statusbar: 0,
      view: "FitV"
    }
  }

  fileStore.isEmbedPdfSuccess = !!pdfobject.embed(fileStore.cdnUrl, '#pdf', options)
})
</script>
