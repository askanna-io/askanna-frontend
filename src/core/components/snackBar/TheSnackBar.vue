<template>
  <v-snackbar
    v-model="openVmodel"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    :multi-line="snackbar.message && snackbar.message.length > 60"
    top
  >
    {{ snackbar.message }}
    <v-btn dark text @click="closeSnackBar">
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
