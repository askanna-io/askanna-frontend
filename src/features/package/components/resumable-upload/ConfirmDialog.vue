<template>
  <VDialog v-model="dialog" max-width="500px">
    <AskAnnaCard>
      <AskAnnaCardTitle>Please confirm that you want to {{ text }} the code </AskAnnaCardTitle>
      <AskAnnaCardText>
        <AskAnnaButton class="my-2 btn--hover" small outlined @click="handleStartUpload" color="primary">
          <AskAnnaIcon color="primary" left>mdi-upload</AskAnnaIcon>Yes, I want to {{ text }} the code
        </AskAnnaButton>
      </AskAnnaCardText>
      <AskAnnaCardActions>
        <AskAnnaButton color="secondary" class="ml-4 btn--hover" small outlined text @click="handleCancelStartUpload">
          <AskAnnaIcon color="secondary" left>mdi-close</AskAnnaIcon>No, I don't want to {{ text }} the code
        </AskAnnaButton>
      </AskAnnaCardActions>
    </AskAnnaCard>
  </VDialog>
</template>

<script setup lang="ts">
const props = defineProps({
  isReplace: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['uploadStarted', 'cancelUploadStarted'])

const dialog = ref(true)

const text = computed(() => (props.isReplace ? 'replace' : 'upload'))

const handleStartUpload = () => emit('uploadStarted')

const handleCancelStartUpload = () => {
  emit('cancelUploadStarted')
  dialog.value = false
}
</script>
