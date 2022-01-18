<template>
  <div>
    <v-dialog
      v-if="dialog"
      content-class="editor--dialog"
      v-model="dialog"
      fullscreen
      persistent
      no-click-animation
      transition="dialog-bottom-transition"
    >
      <v-card flat>
        <v-toolbar extension-height="10" dense flat tile dark color="primary" class="fullscreen--toplbar">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer />
          <v-btn class="mr-3" dark text small outlined @click="handleSave">Save my changes</v-btn>

          <v-btn dark text small outlined @click="handleExitFullScreen">Exit full screen</v-btn>
          <template v-slot:extension></template>
        </v-toolbar>

        <slot />
      </v-card>
    </v-dialog>

    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from '@vue/composition-api'

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
