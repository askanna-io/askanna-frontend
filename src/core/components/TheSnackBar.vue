<template>
  <v-snackbar v-model="openComputed" :timeout="timeout" :multi-line="message && message.length > 60" bottom>
    {{ message }}
    <v-btn color="pink" text @click="snackbar = false">
      <v-icon>far fa-times-circle</v-icon>
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import useSnackBar from './useSnackBar'

export default {
  name: 'TheSnackBar',

  computed: {
    openComputed: {
      get() {
        return this.open
      },
      set() {
        this.closeSnackBar()
      }
    }
  },

  setup() {
    let state = useSnackBar()

    return {
      ...state
    }
  }
}
</script>
