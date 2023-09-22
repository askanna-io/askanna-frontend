<template>
  <AskAnnaButtonText
    class=" mt-4"
    @click="handleOpenForgotPage"
  >Forgot my password
  </AskAnnaButtonText>
</template>

<script setup lang="ts">
const { routerPush } = useRouterAskAnna()

const handleOpenForgotPage = () => routerPush({ name: 'forgot-password' })
</script>