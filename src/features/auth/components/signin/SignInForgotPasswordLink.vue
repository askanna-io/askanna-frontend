<template>
  <AskAnnaButton text small class="mr-4 mt-4 text--secondary" @click="handleOpenForgotPage"
    >Forgot my password
  </AskAnnaButton>
</template>
<script setup lang="ts">
const { router } = useRouterAskAnna()

const handleOpenForgotPage = () => router.push({ name: 'forgot-password' })
</script>
