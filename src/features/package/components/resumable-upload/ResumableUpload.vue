<template>
  <AskAnnaRow no-gutters class="upload mb-2" ref="uploadContainer">
    <AskAnnaCol cols="12">
      <div ref="draggable" @click.stop class="is-sortable-disabled is-drag-valid theme-list drop-zone">
        <div class="grid-block-wrapper vue-file-agent file-input-wrapper has-multiple">
          <ReplaceInfo v-if="isReplace" :projectShortUuid="projectShortUuid" :workspaceId="workspaceId" />
          <NewPackageInfo v-else :projectShortUuid="projectShortUuid" :workspaceId="workspaceId" />
          <canvas style="position: fixed; visibility: hidden; z-index: -3"></canvas>
          <div transitionduration="300" pressdelay="0" helperclass="active-sorting-item">
            <div>
              <FilePreview
                v-for="(resumableFile, index) in fileRecordsForUpload"
                :isUploadStart="isFileAdded"
                :resumableFile="resumableFile"
                :key="index + getIndex()"
                @deleteFile="handleDeleteFile"
              />
            </div>
          </div>
        </div>
      </div>
      <span ref="browseButton">
        <AskAnnaButton class="my-2 mr-2 btn--hover" v-if="!isFileAdded" small outlined color="secondary">
          <AskAnnaIcon left color="secondary">mdi-upload</AskAnnaIcon>Browse
        </AskAnnaButton>
      </span>
      <span>
        <AskAnnaButton
          class="my-2 mr-2 btn--hover"
          v-if="isFileAdded && fileRecordsForUpload && fileRecordsForUpload.length"
          small
          outlined
          @click="handleConfirmUpload"
          color="secondary"
        >
          <AskAnnaIcon color="secondary" left>mdi-upload</AskAnnaIcon>Upload
        </AskAnnaButton>
      </span>
      <AskAnnaButton class="my-2 btn--hover" v-if="isReplace" small outlined @click="handleCancel" color="secondary">
        <AskAnnaIcon color="secondary" left>mdi-cancel</AskAnnaIcon>Cancel
      </AskAnnaButton>
      <ConfirmDialog
        v-if="showConfirmation"
        :isReplace="isReplace"
        @uploadStarted="handleStartUpload"
        @cancelUploadStarted="handleCancelUploadStarted"
      />
      <UploadProcessDialog
        v-if="isUploadStart"
        :progress="progress"
        :projectId="projectShortUuid"
        :packageId="packageShortUuid"
        :isUploadFinish="isUploadFinish"
        @onCloseOutside="handleCloseOutside"
        @confirmationClosed="handleConfirmationClosed"
      />
    </AskAnnaCol>
  </AskAnnaRow>
</template>

<script setup lang="ts">
import { apiUrl } from '@/services/api-settings'

defineProps({
  statusData: {
    type: Object,
    default: function () {
      return {
        status: 'UNDEFINED',
        runtime: 0,
        memory: 0,
        return_payload: null,
        stdout: null,
        created: '',
        finished: ''
      }
    }
  },
  id: {
    type: String,
    default: () => ''
  },
  isReplace: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cancelUpload', 'onCloseOutside'])

const Resumablejs = useResumable()
const { route } = useRouterAskAnna()
const packageStore = usePackageStore()
const uploadStatus = useUploadStatus()

const r = ref(null)
const draggable = ref(null)
const browseButton = ref(null)
const uploadContainer = ref(null)

const file = ref(null)
const progress = ref(0)
const isFileAdded = ref(false)
const isUploadStart = ref(false)
const isUploadFinish = ref(false)
const showConfirmation = ref(false)
const isPackageRegister = ref(false)

const currentChunkData = ref({
  uuid: ''
})
const currentPackageData = ref({
  suuid: ''
})

const packageShortUuid = computed(() => currentPackageData.value.suuid)

const { projectId: projectShortUuid, workspaceId } = route.params

const token = localStorage.getItem('token')
const uploadHeaders = { Authorization: `Token ${token}` }

onMounted(async () => {
  r.value = new Resumablejs({
    target: getTarget,
    testChunks: false,
    testMethod: 'POST',
    preupload: preupload,
    preprocess: preprocess,
    generateUniqueIdentifier: generateUniqueIdentifier,
    maxChunkRetries: 3,
    maxFiles: 1,
    fileType: ['zip'],
    simultaneousUploads: 4,
    chunkSize: 1 * 1024 * 1024,
    headers: uploadHeaders
  })
})

const fileRecordsForUpload = computed(() => r.value && r.value.files)

watch(uploadContainer, async uploadContainer => {
  if (!uploadContainer) return

  r.value.on('fileAdded', async function (r, event) {
    event.preventDefault()
    r.file['systemId'] = getIndex()
    file.value = r.file
    isFileAdded.value = true
    isUploadStart.value = false
    isUploadFinish.value = false
    showConfirmation.value = false
  })

  r.value.on('uploadStart', function () {
    isFileAdded.value = false
    isUploadStart.value = true
  })

  r.value.on('fileProgress', file => {
    const prg = Math.floor(file.progress() * 100)

    progress.value = prg
    uploadStatus.setUpload({
      id: file.uniqueIdentifier,
      name: file.fileName,
      isComplete: file.isComplete(),
      progress: prg,
      projectId: projectShortUuid,
      packageId: currentPackageData.value.suuid
    })
  })

  r.value.on('fileSuccess', async file => {
    handleFinishUpload(file)
  })

  r.value.assignBrowse(browseButton.value)
  r.value.assignDrop(draggable.value)
})

const getTarget = async () => {
  const { uuid } = currentChunkData.value
  const { suuid: packageSuuid } = currentPackageData.value
  const url = `${apiUrl}/v1/package/${packageSuuid}/packagechunk/${uuid}/chunk/`

  return url
}

const preprocess = async r => {
  const { uuid } = await handleRegisterChunkPackage(r)
  currentChunkData.value = { uuid }
  r.preprocessFinished()
}

const preupload = async () => {
  const { suuid } = await handleRegisterPackage(file.value)

  currentPackageData.value = { suuid }
  isPackageRegister.value = true
}

const generateUniqueIdentifier = file => `${file.name}.${Date.now()}`

const handleConfirmUpload = () => {
  showConfirmation.value = true
}

const handleRegisterPackage = async file => {
  const packageData = await packageStore.registerPackage({
    size: file.size,
    filename: file.name,
    description: file.name,
    project: projectShortUuid
  })

  return packageData
}

const handleRegisterChunkPackage = async r => {
  const { suuid } = currentPackageData.value
  const isLastChunk = r.offset + 1 === r.fileObj.chunks.length

  const registerChunk = await packageStore.registerChunkPackage({
    suuid,
    data: {
      filename: r.offset + 1,
      size: r.fileObjSize,
      file_no: r.offset + 1,
      is_last: isLastChunk
    }
  })

  return registerChunk
}

const handleFinishUpload = async r => {
  const { suuid } = currentPackageData.value

  const data = {
    resumableChunkSize: 1024 * 1024,
    resumableTotalSize: r.file.size,
    resumableType: 'application/zip',
    resumableIdentifier: r.file.uniqueIdentifier,
    resumableFilename: r.relativePath,
    resumableRelativePath: r.relativePath,
    resumableTotalChunks: r.chunks.length,
    resumableChunkNumber: 1,
    resumableCurrentChunkSize: 1
  }

  const result = await packageStore.finishUpload({ suuid, data })

  isUploadFinish.value = true
  // isUploadStart.value = false
  isPackageRegister.value = false
}

const handleStartUpload = async () => {
  uploadStatus.addUpload({
    id: file.uniqueIdentifier,
    progress: 0,
    isComplete: false,
    projectId: projectShortUuid,
    packageId: currentPackageData.value.suuid
  })

  r.value.upload()
  showConfirmation.value = false
  isUploadStart.value = true
}

const handleDeleteFile = uniqueIdentifier => {
  const file = r.value.getFromUniqueIdentifier(uniqueIdentifier)

  r.value.removeFile(file)
  isFileAdded.value = false
  isUploadStart.value = false
  isUploadFinish.value = false
  showConfirmation.value = false
  isPackageRegister.value = false
}

const handleConfirmationClosed = () => {
  isFileAdded.value = false
  isUploadStart.value = false
  isUploadFinish.value = false
  showConfirmation.value = false
  isPackageRegister.value = false
}

const handleCancelUploadStarted = () => {
  showConfirmation.value = false
}

const handleCancel = () => emit('cancelUpload')
const getIndex = () => Date.now()

const handleCloseOutside = () => emit('onCloseOutside')
</script>
<style scoped>
.drop-zone {
  border-radius: 2px;
  border: 2px dashed #ccc;
}

.vue-file-agent.file-input-wrapper {
  border: none;
}

.upload .file-input {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 10;
  cursor: pointer;
}
</style>
