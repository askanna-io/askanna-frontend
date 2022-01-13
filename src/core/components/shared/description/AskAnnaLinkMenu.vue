<template>
  <v-menu top v-model="editorStore.isMenuOpen" :nudge-top="25" :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <v-tooltip top>
        <template v-slot:activator="{ on: onHover }">
          <span v-on="onHover">
            <v-btn
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
              <v-icon>mdi-link</v-icon>
            </v-btn>
          </span>
        </template>
        <span>Link</span>
      </v-tooltip>
    </template>
    <v-card width="340px" flat class="px-2 pt-2">
      <div v-if="false" class="text-body-1 font-weight-bold">Set the link</div>
      <v-row>
        <v-col cols="12" class="color-picker-col">
          <v-text-field
            v-model="editorStore.url"
            x-small
            dense
            autofocus
            outlined
            label="URL"
            hide-details
            @keyup.native.enter="handleSetLink"
          />
        </v-col>
        <v-col cols="12" class="py-2">
          <v-btn small depressed outlined text class="btn--hover mr-2" @click="handleSetLink">Link</v-btn>
          <v-btn small depressed outlined text class="btn--hover" @click="handleUnlink">Unlink</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/core/store/useEditorStore'

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
