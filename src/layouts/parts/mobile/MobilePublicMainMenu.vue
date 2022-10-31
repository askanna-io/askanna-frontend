<template>
  <AskAnnaCard
    v-sticky="true"
    class="mx-auto askAnna-main-menu"
    :class="{ 'sticky-fox': isSticky }"
    sticky-offset="{top: 58, bottom: 10}"
  >
    <v-list dense flat>
      <v-list-item href="https://askanna.io" link @click="handleClickOnMenuItem" key="find out" target="_blank">
        <v-list-item-title>Find out more about AskAnna</v-list-item-title>
      </v-list-item>

      <v-list-item to="/workspaces" @click="handleClickOnMenuItem" key="workspaces">
        <v-list-item-title>Workspaces</v-list-item-title>
      </v-list-item>

      <v-list-item to="/projects" @click="handleClickOnMenuItem" key="projects">
        <v-list-item-title>Projects</v-list-item-title>
      </v-list-item>

      <v-list-item to="/signin" @click="handleClickOnMenuItem" key="signin">
        <v-list-item-title>Sign in</v-list-item-title>
      </v-list-item>

      <v-list-item to="/signup" @click="handleClickOnMenuItem" key="signup">
        <v-list-item-title>Sign up</v-list-item-title>
      </v-list-item>

      <v-list-item @click="handleClickOnMenuItem" href="https://docs.askanna.io" target="_blank">
        <v-list-item-title>Documentation</v-list-item-title>
      </v-list-item>
    </v-list>
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
