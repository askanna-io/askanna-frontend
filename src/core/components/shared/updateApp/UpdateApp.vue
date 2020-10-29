<template>
  <v-snackbar v-model="snackWithButtons" bottom left timeout="-1">
    {{ snackWithBtnText }}
    <v-btn dark text @click="snackWithButtons = false">
      <v-icon>far fa-times-circle</v-icon>
      Close
    </v-btn>
    <template v-slot:action="{ attrs }">
      <v-btn text color="#00f500" v-bind="attrs" @click.stop="refreshApp">
        {{ snackBtnText }}
      </v-btn>
      <v-btn icon class="ml-4" @click="snackWithButtons = false">
        <v-icon>close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import useUpdateApp from './useUpdateApp'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'UpdateApp',

  setup(props, context) {
    const updateApp = useUpdateApp()

    return {
      ...updateApp
    }
  }
})
</script>
