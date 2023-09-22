<template>
  <AskAnnaDialog
    @onClose="close"
    v-model="valueModel"
    @click:outside="handleCloseOutside"
  >
    <template v-slot:title>
      <p class="whitespace-pre-wrap sm:truncate">The upload is {{ isUploadFinish ? 'finished' : 'in progress' }}</p>
    </template>

    <template v-slot:body>
      <p v-if="isUploadFinish">
        We completed uploading the file {{ file.name }}.
      </p>
      <p v-else>
        The upload runs in the background. You can continue working in AskAnna. You can check the upload status from
         the icon <AskAnnaIcon :icon="uploadStatus.iconStatus" /> in the upper right corner.
      </p>
    </template>

    <template v-slot:actions>
      <AskAnnaButton @click="close">
        Close
      </AskAnnaButton>
      <AskAnnaButton
        v-if="isUploadFinish"
        @click="handleOpenPackage"
      >
        Open the uploaded code
      </AskAnnaButton>
      <AskAnnaButton
        v-else
        @click="handleUploadStop"
      >Stop upload</AskAnnaButton>
    </template>
  </AskAnnaDialog>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  isUploadFinish: {
    type: Boolean,
    default: false
  },
  files: {
    type: Array,
    default: function () {
      return [{
        name: '',
        size: 0,
        type: ''
      }]
    }
  },
})

const emit = defineEmits(['onClose', 'onCloseOutside', 'onUploadStop', 'confirmationClosed'])

const uploadStatus = useUploadStatus()

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})

const file = computed(() => (props.files.length ? props.files[0].file : { name: '', size: '' }))

const close = () => emit('onClose')
const handleUploadStop = () => emit('onUploadStop')
const handleCloseOutside = () => emit('onCloseOutside')

const handleOpenPackage = () => {
  location.reload()
}
</script>
