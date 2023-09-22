<template>
  <AskAnnaButton
    :disabled="loading"
    @click="startLoading()"
  >Trigger load</AskAnnaButton>

  <AskAnnaLoadingProgress :loading="loading">
    <div class="flex w-full">Content</div>
  </AskAnnaLoadingProgress>
</template>
<script setup>
const loading = ref(true)


const startLoading = () => {
  loading.value = true
  stopLoading()
}

const stopLoading = () => {
  setTimeout(() => loading.value = false, 3000)
}

stopLoading()
</script>