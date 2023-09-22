<template>
  <div class="text-center pl-1">
    <VMenu
      v-model="menu"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ props }">
        <AskAnnaButton
          v-bind="props"
          variant="elevated"
          colorIcon="primary"
          prependIcon="mdi-plus"
          class="mr-3 rounded-full"
        >
          Create Workspace
        </AskAnnaButton>
      </template>
      <AskAnnaCard class="pt-3 mt-2 px-3">
        <WorkspaceCreateForm
          showCancel
          @onClose="menu = false"
        />
      </AskAnnaCard>
    </VMenu>
  </div>
</template>

<script setup lang="ts">
const menu = ref()
</script>