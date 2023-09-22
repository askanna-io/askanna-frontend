<template>
  <AskAnnaToolbar
    color="white"
    class="askanna-sticky z-10"
  >
    <div class="flex pr-1 w-full justify-between">
      <slot name="left" />

      <AskAnnaBreadcrumbs
        listClass="pt-0"
        contentClass="pl-4"
        :items="breadcrumbs"
      />
      <slot name="rigth" />
    </div>
  </AskAnnaToolbar>
</template>
<script setup lang="ts">
defineProps({
  breadcrumbs: {
    type: Array,
    default: () => []
  }
})
</script>