<template>
  <AskAnnaDialog
    @onClose="close"
    v-model="valueModel"
  >
    <template v-slot:title>
      <p class="whitespace-pre-wrap sm:truncate">Do you want to remove the <span class="text-primary">{{ projectName
      }}</span>&nbsp;project?</p>
    </template>

    <template v-slot:body>
      You are about to remove the <b>{{ projectName }}</b> project. Here's what will happen when you remove the
      <b>{{ projectName }}</b> project:
      <ul>
        <li>
          The <b>{{ projectName }}</b> project will be removed from this workspace.
        </li>
        <li>
          All data related to the <b>{{ projectName }}</b> project will be removed.
        </li>
        <li>
          If other projects or systems use jobs, files or other parts of the <b>{{ projectName }}</b> project, they
          are not able to use it anymore.
        </li>
      </ul>
      After 30 days, the system will entirely delete the project from the backend. Within 30 days, you can
      <a
        href="mailto:support@askanna.io"
        target="_blank"
      >contact us</a>
      if you want to undo the removal.
      <p>Please confirm that you want to remove the <b>{{ projectName }}</b> project.</p>
    </template>
    <template v-slot:actions>
      <AskAnnaButton @click="close">Cancel</AskAnnaButton>

      <AskAnnaButton
        color="error"
        @click="deleteItemConfirm"
      >Remove project{{ $vuetify.display.xs ? '' : `: ${name}` }}
      </AskAnnaButton>
    </template>
  </AskAnnaDialog>
</template>
<script setup lang="ts">
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  projectName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onClose', 'onDeleteConfirm'])

const slicedText = useSlicedText()

const name = computed(() => slicedText(props.projectName, 17))
const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})

const close = () => emit('onClose')
const deleteItemConfirm = () => emit('onDeleteConfirm')
</script>
