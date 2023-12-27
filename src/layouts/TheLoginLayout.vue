<template>
  <VMain class="overflow-hidden bg-[url('/assets/bg/askanna-bg-01.svg')] bg-cover h-screen flex flex-col">
    <div class="sm:mx-auto sm:w-full h-full overflow-y-scroll">
      <RouterView />
    </div>
    <TheSnackBar />
  </VMain>
</template>
<script setup lang="ts">
</script>