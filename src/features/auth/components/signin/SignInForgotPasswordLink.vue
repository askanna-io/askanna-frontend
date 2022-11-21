<template>
  <AskAnnaButton text small class="mr-4 mt-4 text--secondary" @click="handleOpenForgotPage"
    >Forgot my password
  </AskAnnaButton>
</template>
<script setup lang="ts">
const { routerPush } = useRouterAskAnna()

const handleOpenForgotPage = () => routerPush({ name: 'forgot-password' })
</script>
