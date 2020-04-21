<template>
  <v-card flat class="mx-3 mt-2" outlined>
    <ask-anna-divider text="Project Activity" />
    <ask-anna-time-lines text="Latest Activity" />
  </v-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'RunsCode'
})
</script>
