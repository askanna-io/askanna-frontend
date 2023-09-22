<template>
  <VMain class="overflow-hidden bg-[url('/assets/bg/askanna-bg-01.svg')] bg-cover h-screen flex flex-col">
    <div class="sm:mx-auto sm:w-full h-full overflow-y-scroll">
      <RouterView />
    </div>
    <TheSnackBar />
  </VMain>
</template>
<script setup lang="ts">
if (import.meta.env.VITE_APP_INTERCOM_ID) {
  window.Intercom('boot', {
    app_id: import.meta.env.VITE_APP_INTERCOM_ID
  })
}

onUpdated(() => {
  if (import.meta.env.VITE_APP_INTERCOM_ID) {
    window.Intercom('update')
  }
})
</script>