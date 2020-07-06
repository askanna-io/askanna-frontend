<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        Confirm replace the code
      </v-card-title>
      <v-card-text>
        <v-btn
          v-if="!isUploadStart && !isUploadFinish"
          class="my-2"
          small
          outlined
          @click="uploadFiles"
          color="secondary"
        >
          <v-icon color="secondary" left>mdi-upload</v-icon>I want to upload this file
        </v-btn>

        <v-progress-linear v-if="isUploadStart && !isUploadFinish" :buffer-value="progress" stream color="cyan" />
        <v-alert v-if="isUploadFinish" outlined dense type="success"
          >Upload was started in backgorun process, fell free to use AskAnna.</v-alert
        >
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ConfirmDialog',

  props: {
    progress: {
      type: Number,
      default: 0
    },
    isUploadStart: {
      type: Boolean,
      default: false
    },
    isUploadFinish: {
      type: Boolean,
      default: false
    }
  },

  setup(props, context) {
    const dialog = ref(true)

    const uploadFiles = () => context.emit('uploadFiles')

    watch(dialog, async dialog => {
      if (!dialog) context.emit('confirmationClosed')
    })

    return { dialog, uploadFiles }
  }
})
</script>
