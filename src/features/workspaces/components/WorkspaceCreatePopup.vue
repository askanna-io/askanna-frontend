<template>
  <div class="text-center pl-1" v-if="true">
    <VMenu
      eager
      offset-y
      v-model="menu"
      :nudge-width="90"
      :nudge-bottom="5"
      :nudge-left="100"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <AskAnnaButton v-bind="attrs" v-on="on" small rounded class="mr-3">
          <AskAnnaIcon color="primary" left>mdi-plus</AskAnnaIcon>
          Create Workspace
        </AskAnnaButton>
      </template>
      <AskAnnaCard>
        <WorkspaceCreateForm showCancel @onClose="menu = false" />
      </AskAnnaCard>
    </VMenu>
  </div>
</template>

<script setup lang="ts">
const menu = ref()
</script>
