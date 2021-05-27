<template>
  <v-btn text small class="mr-4 mt-4 text--secondary" @click="handleOpenForgotPage">
    Forgot my password
  </v-btn>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'

export default defineComponent({
  name: 'ForgotPasswordLink',

  setup(_, context) {
    const router = useRouterAskAnna(context)

    const handleOpenForgotPage = () => router.push({ name: 'forgot-password' })

    return {
      handleOpenForgotPage
    }
  }
})
</script>
