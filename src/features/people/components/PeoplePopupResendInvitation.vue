<template>
  <AskAnnaDialog
    @onClose="close"
    v-model="valueModel"
  >
    <template v-slot:title>
      <p class="whitespace-pre-wrap sm:truncate">Do you want to resend the invitation?</p>
    </template>
    <template v-slot:body>
      <p>You are about to resend the invitation for <b>{{ peopleName }}</b>. Here's what will happen when you continue
        with
        this action:
      </p>
      <ul>
        <li>
          <b>{{ peopleName }}</b> will receive a new invitation to join this workspace
        </li>
      </ul>
    </template>
    <template v-slot:actions>
      <AskAnnaButton @click="close">Cancel</AskAnnaButton>
      <AskAnnaButton @click="resendConfirm">Resend invitation</AskAnnaButton>
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
    default: () => 'this member'
  }
})

const emit = defineEmits(['onClose', 'onResendConfirm'])

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})

const close = () => emit('onClose')
const resendConfirm = () => emit('onResendConfirm')
</script>