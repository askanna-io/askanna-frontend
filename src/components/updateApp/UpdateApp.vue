<template>
  <v-snackbar v-model="snackWithButtons" color="secondary" bottom right timeout="-1">
    A new version of AskAnna is available!
    <template v-slot:action="{ attrs }">
      <v-btn class="mr-3" small v-bind="attrs" @click="refreshApp">Refresh</v-btn>

      <v-btn dark icon text @click="snackWithButtons = false">
        <v-icon>far fa-times-circle</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
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
