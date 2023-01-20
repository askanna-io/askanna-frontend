<template>
  <AskAnnaFlex
    fluid
    class="fill-height"
    :class="{ 'px-0': $vuetify.breakpoint.xsOnly, 'px-5': !$vuetify.breakpoint.xsOnly }"
  >
    <div v-if="fileStore.isEmbedPdfSuccess" id="pdf"></div>
  </AskAnnaFlex>
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
      toolbar: 0,
      statusbar: 0,
      view: 'FitV'
    }
  }

  const file = new Blob([fileStore.fileBlob], { type: 'application/pdf' })
  const fileURL = URL.createObjectURL(file)

  fileStore.isEmbedPdfSuccess = !!pdfobject.embed(fileURL + '#toolbar=0', '#pdf', options)
})
</script>
