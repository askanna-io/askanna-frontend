<template>
  <div />
</template>
<script setup lang="ts">
import { useAuthStore } from '@/features/auth/useAuthStore'
useAuthStore().logout()
</script>
