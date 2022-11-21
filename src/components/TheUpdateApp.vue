<template>
  <VSnackbar v-model="snackWithButtons" color="secondary" bottom right timeout="-1">
    A new version of AskAnna is available!
    <template v-slot:action="{ attrs }">
      <AskAnnaButton class="mr-3" small v-bind="attrs" @click="refreshApp">Refresh</AskAnnaButton>

      <AskAnnaButton dark icon text @click="snackWithButtons = false">
        <AskAnnaIcon>far fa-times-circle</AskAnnaIcon>
      </AskAnnaButton>
    </template>
  </VSnackbar>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const snackWithButtons = ref(false)

const { updateServiceWorker } = useRegisterSW({
  immediate: true,

  onNeedRefresh() {
    snackWithButtons.value = true
  }
})

const refreshApp = () => {
  snackWithButtons.value = false
  updateServiceWorker()
}
</script>
