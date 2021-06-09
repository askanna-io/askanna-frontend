<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="handleCloseOutside">
    <v-card>
      <v-card-title>
        Successfully started the upload
        <p class="body-1">
          The upload is running in the background. You can continue working in AskAnna. If you do, you can check the
          status via <v-icon>{{ iconStatus }}</v-icon> in the right upper corner.
        </p>
      </v-card-title>
      <v-card-text>
        <v-progress-linear v-if="!isUploadFinish" :buffer-value="progress" stream color="primary" />
        <v-alert v-else outlined height="40" dense type="success">Upload was finished</v-alert>
      </v-card-text>

      <v-card-actions class="ml-4">
        <v-btn v-if="!isUploadFinish" class="btn--hover" color="secondary" small outlined text @click="dialog = false">
          <v-icon color="secondary" left>mdi-close</v-icon>Close
        </v-btn>
        <v-btn v-else color="primary" small outlined text @click="handleOpenPackage">
          <v-icon small color="secondary" left>mdi-link-box-outline</v-icon>Open the uploaded code
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, watch, computed, defineComponent } from '@vue/composition-api'
import useUploadStatus from '@/core/components/uploadStatus/useUploadStatus'

export default defineComponent({
  name: 'UploadProcessDialod',

  props: {
    progress: {
      type: Number,
      default: 0
    },
    projectId: {
      type: String,
      default: ''
    },
    packageId: {
      type: String,
      default: ''
    },
    isUploadFinish: {
      type: Boolean,
      default: false
    }
  },

  setup(props, context) {
    const dialog = ref(true)
    const uploadStatus = useUploadStatus()
    const router = useRouterAskAnna(context)

    watch(dialog, async dialog => {
      if (!dialog) context.emit('confirmationClosed')
    })

    const handleCloseOutside = () => context.emit('onCloseOutside')

    const iconStatus = computed(() => uploadStatus.iconStatus.value)

    const handleOpenPackage = () => {
      location.reload()
    }

    return { dialog, iconStatus, handleCloseOutside, handleOpenPackage }
  }
})
</script>
