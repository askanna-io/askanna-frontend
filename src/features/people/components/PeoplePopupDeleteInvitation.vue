<template>
  <AskAnnaDialog
    @onClose="close"
    v-model="valueModel"
  >
    <template v-slot:title>
      <p class="whitespace-pre-wrap sm:truncate">Do you want to delete the invitation?</p>
    </template>
    <template v-slot:body>
      <p>You are about to delete the invitation for <b>{{ peopleName }}</b>. Here's what happens when you continue with
        this action:</p>
      <ul>
        <li>
          <b>{{ peopleName }}</b> cannot accept the send invite to join the workspace
        </li>
      </ul>
      <p>The action cannot be undone! Please confirm that you want to delete the invitation for <b>{{ peopleName }}</b>:
      </p>
    </template>
    <template v-slot:actions>
      <AskAnnaButton @click="close">Cancel</AskAnnaButton>
      <AskAnnaButton
        color="error"
        @click="deleteItemConfirm"
      >Delete invitation</AskAnnaButton>
    </template>
  </AskAnnaDialog>
</template>
<script setup lang="ts">
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  peopleName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onClose', 'onDeleteConfirm'])

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})

const close = () => emit('onClose')
const deleteItemConfirm = () => emit('onDeleteConfirm')
</script>