<template>
  <AskAnnaCard
    class="mx-auto"
    :class="{ 'fixed z-10  w-full': isSticky }"
  >
    <VList density="compact">
      <VListItem
        key="find out"
        target="_blank"
        href="https://askanna.io"
        @click="handleClickOnMenuItem"
      >
        <VListItemTitle class="font-medium">Find out more about AskAnna</VListItemTitle>
      </VListItem>
      <VListItem
        to="/workspaces"
        key="workspaces"
        @click="handleClickOnMenuItem"
      >
        <VListItemTitle class="font-medium">Workspaces</VListItemTitle>
      </VListItem>
      <VListItem
        to="/projects"
        key="projects"
        @click="handleClickOnMenuItem"
      >
        <VListItemTitle class="font-medium">Projects</VListItemTitle>
      </VListItem>
      <VListItem
        to="/signin"
        key="signin"
        @click="handleClickOnMenuItem"
      >
        <VListItemTitle class="font-medium">Sign in</VListItemTitle>
      </VListItem>
      <VListItem
        to="/signup"
        key="signup"
        @click="handleClickOnMenuItem"
      >
        <VListItemTitle class="font-medium">Sign up</VListItemTitle>
      </VListItem>
      <VListItem
        target="_blank"
        @click="handleClickOnMenuItem"
        href="https://docs.askanna.io"
      >
        <VListItemTitle class="font-medium">Documentation</VListItemTitle>
      </VListItem>
    </VList>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const emits = defineEmits('onClose')

const mobileStore = useMobileStore()

const isSticky = computed(() => mobileStore.isMenuOpen && mobileStore.isMenuSticked)

const handleClickOnMenuItem = () => emits('onClose')
</script>