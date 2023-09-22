<template>
  <AskAnnaDialog
    @onClose="close"
    maxWidth="740px"
    v-model="valueModel"
  >
    <template v-slot:title>
      <p
        v-if="isReplace"
        class="whitespace-pre-wrap sm:truncate"
      >Do you want to replace the code package with this zip file?</p>
      <p
        v-else=""
        class="whitespace-pre-wrap sm:truncate"
      >Do you want to upload this zip file?</p>

    </template>

    <template v-slot:body>
      <div><b>Name:</b> {{ file.name }}</div>
      <div><b>Size:</b> {{ `${humanize.humanizeSize(file.size)}` }}</div>
      <div>
        <b>Date modified:</b> {{ dayjs(file.lastModified).format('Do MMMM YYYY, h:mm:ss a') }}
      </div>
    </template>
    <template v-slot:actions>
      <template v-if="isReplace">
        <AskAnnaButton @click="handleStartUpload">Yes, I want to replace the code package</AskAnnaButton>
        <AskAnnaButton @click="close">No, I don't want to replace the code package</AskAnnaButton>

      </template>
      <template v-else>
        <AskAnnaButton @click="handleStartUpload">Yes, I want to upload the zip file</AskAnnaButton>
        <AskAnnaButton @click="close">No, I don't want to upload the zip file</AskAnnaButton>
      </template>
    </template>
  </AskAnnaDialog>
</template>
<script setup lang="ts">
const props = defineProps({
  value: {
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
  isReplace: {
    type: Boolean,
    default: false
  },
  projectName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onClose', 'uploadStarted'])

const { dayjs } = useDayjs()
const humanize = useSizeHumanize()

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})


const file = computed(() => (props.files.length ? props.files[0].file : { name: '', size: '' }))
const handleStartUpload = () => emit('uploadStarted')

const close = () => emit('onClose')
</script>
