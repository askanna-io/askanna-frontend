<template>
  <AskAnnaCard
    v-sticky="true"
    class="mx-auto askAnna-main-menu"
    :class="{ 'sticky-fox': isSticky }"
    sticky-offset="{top: 58, bottom: 10}"
  >
    <VList dense flat>
      <VListItem href="https://askanna.io" link @click="handleClickOnMenuItem" key="find out" target="_blank">
        <VListItemTitle>Find out more about AskAnna</VListItemTitle>
      </VListItem>

      <VListItem to="/workspaces" @click="handleClickOnMenuItem" key="workspaces">
        <VListItemTitle>Workspaces</VListItemTitle>
      </VListItem>

      <VListItem to="/projects" @click="handleClickOnMenuItem" key="projects">
        <VListItemTitle>Projects</VListItemTitle>
      </VListItem>

      <VListItem to="/signin" @click="handleClickOnMenuItem" key="signin">
        <VListItemTitle>Sign in</VListItemTitle>
      </VListItem>

      <VListItem to="/signup" @click="handleClickOnMenuItem" key="signup">
        <VListItemTitle>Sign up</VListItemTitle>
      </VListItem>

      <VListItem @click="handleClickOnMenuItem" href="https://docs.askanna.io" target="_blank">
        <VListItemTitle>Documentation</VListItemTitle>
      </VListItem>
    </VList>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const emits = defineEmits('onClose')

const mobileStore = useMobileStore()

const isSticky = computed(() => mobileStore.isMenuOpen && mobileStore.isMenuSticked)

const handleClickOnMenuItem = () => {
  emits('onClose')
}
</script>
