<template>
  <VMenu
    location="top"
    v-model="editorStore.isMenuOpen"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <AskAnnaButton
        v-bind="props"
        variant="plain"
        icon="mdi-link"
        density="compact"
        @click="handleClick"
        class="opacity-100 z-10 mr-4"
        :colorIcon="isActive ? 'primary' : 'secondary'"
      >
        <AskAnnaTooltip>Link</AskAnnaTooltip>
      </AskAnnaButton>

    </template>
    <AskAnnaCard width="340px">
      <div class="p-2">
        <AskAnnaTextField
          v-model="editorStore.url"
          autofocus
          label="URL"
          hide-details
          id="link-input"
          @keyup.enter="handleSetLink"
        />
        <div class="mt-2">
          <AskAnnaButton
            class="mr-2 "
            @click="handleSetLink"
          >Link</AskAnnaButton>
          <AskAnnaButton @click="handleUnlink">Unlink</AskAnnaButton>
        </div>
      </div>
    </AskAnnaCard>
  </VMenu>
</template>

<script setup lang="ts">
defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onOpen', 'onSetLink', 'onUnsetLink'])

const editorStore = useEditorStore()

const handleUnlink = () => {
  editorStore.isMenuOpen = false
  editorStore.url = ''

  emit('onSetLink')
}

const handleClick = () => emit('onOpen')

const handleSetLink = () => {
  editorStore.isMenuOpen = false
  emit('onSetLink')
}
</script>