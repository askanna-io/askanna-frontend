<template>
  <AskAnnaDialog
    v-model="valueModel"
    max-width="500px"
    @onClose="close"
  >
    <template v-slot:title>
      <p class="whitespace-pre-wrap sm:truncate">
        Do you want to delete the variable <span class="text-primary">{{ variableName }}</span>
      </p>
      ?
    </template>
    <template v-slot:actions>
      <AskAnnaButton @click="close">Cancel</AskAnnaButton>
      <AskAnnaButton
        color="error"
        @click="deleteItemConfirm"
      >Delete variable{{ $vuetify.display.xs ? '' : `: ${slicedText(variableName, 25)}` }}</AskAnnaButton>
    </template>
  </AskAnnaDialog>
</template>
<script setup lang="ts">
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  variableName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onDelete', 'onClose'])

const slicedText = useSlicedText()

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})

const close = () => emit('onClose')
const deleteItemConfirm = () => emit('onDelete')
</script>
