<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        Upload was started in backgorun process.
        <p class="body-1">Fell free to use AskAnna.</p>
      </v-card-title>
      <v-card-text>
        <v-progress-linear v-if="!isUploadFinish" :buffer-value="progress" stream color="primary" />
        <v-alert v-else outlined dense type="success">Upload was finished.</v-alert>
      </v-card-text>

      <v-card-actions>
        <v-btn color="secondary" small outlined text @click="dialog = false">
          <v-icon color="secondary" left>mdi-close</v-icon>Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'UploadProcessDialod',

  props: {
    progress: {
      type: Number,
      default: 0
    },
    isUploadFinish: {
      type: Boolean,
      default: false
    }
  },

  setup(props, context) {
    const dialog = ref(true)

    watch(dialog, async dialog => {
      if (!dialog) context.emit('confirmationClosed')
    })

    return { dialog }
  }
})
</script>
