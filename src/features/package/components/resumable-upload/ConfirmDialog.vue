<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title> Please confirm that you want to {{ text }} the code </v-card-title>
      <v-card-text>
        <v-btn class="my-2" small outlined @click="handleStartUpload" color="primary">
          <v-icon color="primary" left>mdi-upload</v-icon>Yes, I want to {{ text }} the code
        </v-btn>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" class="ml-4" small outlined text @click="handleCancelStartUpload">
          <v-icon color="secondary" left>mdi-close</v-icon>No, I don't want to {{ text }} the code
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ConfirmDialog',
  props: {
    isReplace: {
      type: Boolean,
      default: false
    }
  },

  setup(props, context) {
    const dialog = ref(true)

    const text = computed(() => (props.isReplace ? 'replace' : 'upload'))

    const handleStartUpload = () => context.emit('uploadStarted')
    const handleCancelStartUpload = () => {
      context.emit('cancelUploadStarted')
      dialog.value = false
    }

    return { text, dialog, handleStartUpload, handleCancelStartUpload }
  }
})
</script>
