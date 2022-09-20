<template>
  <v-snackbar
    top
    v-model="state.snackbar.open"
    :color="state.snackbar.color"
    :timeout="state.snackbar.timeout"
    :multi-line="state.snackbar.message && state.snackbar.message.length > 60"
  >
    {{ state.snackbar.message }}
    <template v-slot:action>
      <v-btn dark icon text @click="state.snackbar.open = false">
        <v-icon>far fa-times-circle</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script ref setup lang="ts">
const state = useSnackBar()
</script>
