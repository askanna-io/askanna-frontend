<template>
  <v-btn text small class="mr-4 mt-4 text--secondary" @click="handleOpenForgotPage">Forgot my password </v-btn>
</template>
<script setup lang="ts">
const { router } = useRouterAskAnna()

const handleOpenForgotPage = () => router.push({ name: 'forgot-password' })
</script>
