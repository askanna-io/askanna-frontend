<script setup lang="ts">
useAuthStore().logout()

useRouterAskAnna().routerPush({ name: 'signin' })
</script>