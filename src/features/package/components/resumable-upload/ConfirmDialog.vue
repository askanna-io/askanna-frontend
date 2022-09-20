<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title> Please confirm that you want to {{ text }} the code </v-card-title>
      <v-card-text>
        <v-btn class="my-2 btn--hover" small outlined @click="handleStartUpload" color="primary">
          <v-icon color="primary" left>mdi-upload</v-icon>Yes, I want to {{ text }} the code
        </v-btn>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" class="ml-4 btn--hover" small outlined text @click="handleCancelStartUpload">
          <v-icon color="secondary" left>mdi-close</v-icon>No, I don't want to {{ text }} the code
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
