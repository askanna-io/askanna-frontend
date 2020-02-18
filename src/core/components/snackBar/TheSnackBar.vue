<template>
  <v-snackbar
    v-model="snackbar.open"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    :multi-line="snackbar.message && snackbar.message.length > 60"
    top
  >
    {{ snackbar.message }}
    <v-btn color="pink" text @click="closeSnackBar">
      <v-icon>far fa-times-circle</v-icon>
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import useSnackBar from './useSnackBar'

export default {
  name: 'TheSnackBar',

  setup() {
    const state = useSnackBar()

    return {
      ...state
    }
  }
}
</script>
