<template>
  <v-card flat class="mx-3 mt-2" outlined>
    <the-packages />
  </v-card>
</template>

<script>
import ThePackages from '@packages/views/ThePackages'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'code',

  components: {
    ThePackages
  }
})
</script>
