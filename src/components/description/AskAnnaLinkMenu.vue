<template>
  <VMenu top eager v-model="editorStore.isMenuOpen" :nudge-top="25" :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <VTooltip top>
        <template v-slot:activator="{ on: onHover }">
          <span v-on="onHover">
            <AskAnnaButton
              v-bind="attrs"
              @click="handleClick"
              v-on="on"
              dark
              icon
              x-small
              :text="!isActive"
              :class="{ 'is-active': isActive }"
              :color="isActive ? 'primary' : 'secondary'"
              class="btn--hover btn--without-text mr-3 link-btn"
            >
              <AskAnnaIcon>mdi-link</AskAnnaIcon>
            </AskAnnaButton>
          </span>
        </template>
        <span>Link</span>
      </VTooltip>
    </template>
    <AskAnnaCard width="340px" flat class="px-2 pt-2">
      <AskAnnaRow>
        <AskAnnaCol cols="12" class="color-picker-col">
          <AskAnnaTextField
            v-model="editorStore.url"
            id="link-input"
            x-small
            dense
            autofocus
            outlined
            label="URL"
            hide-details
            @keyup.native.enter="handleSetLink"
          />
        </AskAnnaCol>
        <AskAnnaCol cols="12" class="py-2">
          <AskAnnaButton small depressed outlined text class="btn--hover mr-2" @click="handleSetLink"
            >Link</AskAnnaButton
          >
          <AskAnnaButton small depressed outlined text class="btn--hover" @click="handleUnlink">Unlink</AskAnnaButton>
        </AskAnnaCol>
      </AskAnnaRow>
    </AskAnnaCard>
  </VMenu>
</template>

<script setup lang="ts">
import { VTooltip } from 'vuetify/lib'

defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onSetLink', 'onUnsetLink'])

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
<style scoped>
.link-btn {
  margin-bottom: 1px;
}
</style>
