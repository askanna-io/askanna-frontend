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
import { snackbar } from './store'
import useSnackBar from './useSnackBar'
import { defineComponent } from '@vue/composition-api'
const snackbarStore = 'snackbarStore'

export default defineComponent({
  name: 'TheSnackBar',

  setup(props, context) {
    const state = useSnackBar()

    return {
      ...state
    }
  }
})
</script>
