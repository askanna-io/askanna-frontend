<template>
  <v-btn text small class="mr-4 mt-4 text--secondary" @click="handleOpenForgotPage">
    Forgot my password
  </v-btn>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ForgotPasswordLink',

  setup(props, context) {
    const handleOpenForgotPage = () => context.root.$router.push({ name: 'forgot-password' })

    return {
      handleOpenForgotPage
    }
  }
})
</script>
