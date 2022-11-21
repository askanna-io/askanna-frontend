<template>
  <div v-if="isUploadStart">
    <VFileInput
      class="pr-3"
      outlined
      :value="resumableFile.file"
      label="Replace code by:"
      color="deep-purple accent-4"
      @click:clear="handleDeleteFile"
      :show-size="1000"
    >
      <template v-slot:selection="{ index, text }">
        <AskAnnaChip color="primary" dark label small>
          {{ text }}
        </AskAnnaChip>
      </template>
    </VFileInput>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isUploadStart: {
    type: Boolean,
    default: false
  },
  resumableFile: {
    type: Object,
    default: function () {
      return {
        name: '',
        size: 0,
        type: ''
      }
    }
  }
})

const emit = defineEmits(['deleteFile'])

const handleDeleteFile = () => emit('deleteFile', props.resumableFile.uniqueIdentifier)
</script>
<style>
.askanna-alert.v-alert {
  width: 360px;
  font-size: 14px;
}
.askanna-alert.v-alert.v-alert--dense {
  padding-top: 3px;
}
.askanna-alert.v-alert--text:before {
  background-color: initial;
}
</style>
