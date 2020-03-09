<template>
  <v-card flat class="mx-3 mt-2" outlined>
    <the-packages />
  </v-card>
</template>

<script>
import ThePackages from '@/features/packages/views/ThePackages'
export default {
  name: 'Code',

  components: {
    ThePackages
  },

  data() {
    return {}
  }
}
</script>
