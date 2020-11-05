<template>
  <v-snackbar v-model="snackWithButtons" color="secondary" bottom right timeout="-1">
    New version available!
    <template v-slot:action="{ attrs }">
      <v-btn class="mr-3" small v-bind="attrs" @click="refreshApp">Refresh</v-btn>

      <v-btn dark icon text @click="snackWithButtons = false">
        <v-icon>far fa-times-circle</v-icon>
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
