<template>
  <VSnackbar
    location="top"
    v-model="state.snackbar.open"
    :color="state.snackbar.color"
    :timeout="state.snackbar.timeout"
    :multi-line="state.snackbar.message && state.snackbar.message.length > 60"
  >
    {{ state.snackbar.message }}
    <template v-slot:actions>
      <AskAnnaButton
        size="default"
        variant="text"
        colorIcon="white"
        icon="mdi-close-circle-outline"
        @click="state.snackbar.open = false"
      />
    </template>
  </VSnackbar>
</template>

<script ref setup lang="ts">
const state = useSnackBar()
</script>