<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="handleCloseOutside">
    <AskAnnaCard>
      <AskAnnaCardTitle>
        Successfully started the upload
        <p class="body-1">
          The upload is running in the background. You can continue working in AskAnna. If you do, you can check the
          status via <AskAnnaIcon>{{ uploadStatus.iconStatus }}</AskAnnaIcon> in the right upper corner.
        </p>
      </AskAnnaCardTitle>
      <AskAnnaCardText>
        <v-progress-linear v-if="!isUploadFinish" :buffer-value="progress" stream color="primary" />
        <AskAnnaAlert v-else outlined height="40" dense type="success">Upload was finished</AskAnnaAlert>
      </AskAnnaCardText>

      <AskAnnaCardActions class="ml-4">
        <AskAnnaButton
          v-if="!isUploadFinish"
          class="btn--hover"
          color="secondary"
          small
          outlined
          text
          @click="dialog = false"
        >
          <AskAnnaIcon color="secondary" left>mdi-close</AskAnnaIcon>Close
        </AskAnnaButton>
        <AskAnnaButton v-else color="primary" small outlined text @click="handleOpenPackage">
          <AskAnnaIcon small color="secondary" left>mdi-link-box-outline</AskAnnaIcon>Open the uploaded code
        </AskAnnaButton>
      </AskAnnaCardActions>
    </AskAnnaCard>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps({
  progress: {
    type: Number,
    default: 0
  },
  isUploadFinish: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onCloseOutside', 'confirmationClosed'])

const dialog = ref(true)
const uploadStatus = useUploadStatus()

watch(dialog, async dialog => {
  if (!dialog) emit('confirmationClosed')
})

const handleCloseOutside = () => emit('onCloseOutside')

const handleOpenPackage = () => {
  location.reload()
}
</script>
