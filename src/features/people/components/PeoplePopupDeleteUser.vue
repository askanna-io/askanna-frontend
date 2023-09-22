<template>
  <AskAnnaDialog
    @onClose="close"
    v-model="valueModel"
  >
    <template v-slot:title>
      <p class="whitespace-pre-wrap sm:truncate">Do you want to remove <span class="text-primary">{{ peopleName
      }}</span>?</p>
    </template>
    <template v-slot:body>
      <p>
        You are about to remove the member <b>{{ peopleName }}</b>. Here's what will happen when you remove <b>{{
          peopleName }}</b>:</p>
      <ul>
        <li>
          <b>{{ peopleName }}</b> will be removed from this workspace and projects in this workspace
        </li>
        <li>
          <b>{{ peopleName }}</b> will not be able to open this workspace anymore
        </li>
        <li>
          If <b>{{ peopleName }}</b> has access to other workspaces, <b>{{ peopleName }}</b> will still have access to
          these workspaces
        </li>
        <li>
          Everything <b>{{ peopleName }}</b> has done will remain in place
        </li>
      </ul>
      <p>The removal action cannot be undone! Please confirm that you want to remove <b>{{ peopleName }}</b>:</p>
    </template>
    <template v-slot:actions>
      <AskAnnaButton @click="close">Cancel</AskAnnaButton>
      <AskAnnaButton
        color="error"
        @click="deleteItemConfirm"
      >Remove{{ $vuetify.display.xs ? '' : `: ${name}` }}</AskAnnaButton>
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

const emit = defineEmits(['onCloseDeletePopup', 'onCloseDeletePopup', 'onDeleteConfirm'])

const slicedText = useSlicedText()

const name = computed(() => slicedText(props.peopleName, 17))

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onCloseDeletePopup')
})

const close = () => emit('onCloseDeletePopup')
const deleteItemConfirm = () => emit('onDeleteConfirm')
</script>