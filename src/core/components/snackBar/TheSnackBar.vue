<template>
  <v-snackbar
    top
    v-model="openVmodel"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    :multi-line="snackbar.message && snackbar.message.length > 60"
  >
    {{ snackbar.message }}
    <template v-slot:action>
      <v-btn dark icon text @click="openVmodel = false">
        <v-icon>far fa-times-circle</v-icon>
      </v-btn>
    </template>
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
