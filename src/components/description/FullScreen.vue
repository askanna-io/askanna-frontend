<template>
  <div>
    <VDialog
      v-if="dialog"
      v-model="dialog"
      fullscreen
      persistent
      no-click-animation
      content-class="editor--dialog"
      transition="dialog-bottom-transition"
    >
      <AskAnnaCard>
        <AskAnnaToolbar
          color="primary"
          density="compact"
          extension-height="10"
          class="fullscreen--toplbar"
        >
          <AskAnnaToolbarTitle>{{ title }}</AskAnnaToolbarTitle>
          <AskAnnaSpacer />
          <AskAnnaButton
            class="mr-3"
            color="white"
            variant="text"
            @click="handleSave"
          >Save my changes</AskAnnaButton>

          <AskAnnaButton
            color="white"
            variant="text"
            @click="handleExitFullScreen"
          >Exit full screen</AskAnnaButton>
          <template v-slot:extension></template>
        </AskAnnaToolbar>

        <slot />
      </AskAnnaCard>
    </VDialog>

    <slot v-else />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onSave', 'onExitFullScreen'])

const dialog = ref(false)

const isFullScreen = computed(() => props.value)

watch(isFullScreen, value => (dialog.value = value))

const handleSave = () => emit('onSave')
const handleExitFullScreen = () => emit('onExitFullScreen')
</script>
<style lang="scss">
.fullscreen--toplbar {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;

  .v-toolbar__extension {
    padding: 0;
    background-color: white;
  }
}

.mobile-view .v-dialog--fullscreen {
  margin: 0 !important;
}
</style>
