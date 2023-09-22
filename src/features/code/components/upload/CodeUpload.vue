<template>
  <div>
    <AskAnnaCardTitle
      v-if="isReplace"
      class="px-0"
    >Replace this code package</AskAnnaCardTitle>
    <div
      class="upload"
      ref="uploadContainer"
    >
      <div>
        <div
          @click.stop
          ref="draggable"
          class="is-sortable-disabled is-drag-valid theme-list drop-zone"
        >
          <div class="grid-block-wrapper vue-file-agent file-input-wrapper has-multiple">
            <CodeUploadReplaceInfo
              v-if="isReplace"
              :workspaceId="workspaceId"
              :projectShortUuid="projectShortUuid"
            />
            <CodeUploadPackageInfo
              v-else
              :workspaceId="workspaceId"
              :projectShortUuid="projectShortUuid"
            />
            <canvas style="position: fixed; visibility: hidden; z-index: -3"></canvas>
          </div>
        </div>
        <span ref="browseButton">
          <AskAnnaButton
            class="my-2 mr-2"
            prependIcon="mdi-upload"
          >
            Zip file upload
          </AskAnnaButton>
        </span>

        <AskAnnaButton
          v-if="isReplace"
          class="my-2"
          prependIcon="mdi-cancel"
          @click="handleCancel"
        >
          Cancel
        </AskAnnaButton>
        <CodeUploadDialogConfirm
          :isReplace="isReplace"
          :value="showConfirmation"
          :files="fileRecordsForUpload"
          :projectName="projectStore.project.name"
          @onClose="handleUploadStop"
          @uploadStarted="handleStartUpload"
        />
        <CodeUploadDialogProcessing
          :progress="progress"
          :value="isUploadStart"
          :files="fileRecordsForUpload"
          :projectId="projectShortUuid"
          :packageId="packageShortUuid"
          :isUploadFinish="isUploadFinish"
          @onUploadStop="handleUploadStop"
          @onCloseOutside="handleCloseOutside"
          @onClose="handeUploadProcessingClose"
          @confirmationClosed="handleConfirmationClosed"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { apiUrl } from '@/services/api-settings'

defineProps({
  statusData: {
    type: Object,
    default: function () {
      return {
        status: 'undefined',
        runtime: 0,
        memory: 0,
        return_payload: null,
        stdout: null,
        created_at: '',
        finished_at: ''
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
const projectStore = useProjectStore()
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
    showConfirmation.value = true
  })

  r.value.on('uploadStart', function () {
    isFileAdded.value = false
    isUploadStart.value = true
  })

  r.value.on('fileProgress', file => {
    const prg = Math.floor(file.progress() * 100)

    progress.value = prg
    uploadStatus.setUpload({
      progress: prg,
      name: file.fileName,
      id: file.uniqueIdentifier,
      projectId: projectShortUuid,
      isComplete: file.isComplete(),
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

const handleRegisterPackage = async file => {
  const packageData = await packageStore.registerPackage({
    size: file.size,
    filename: file.name,
    description: file.name,
    project_suuid: projectShortUuid
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

  await packageStore.finishUpload({ suuid, data })

  progress.value = 0
  isUploadFinish.value = true
  isPackageRegister.value = false
}

const handleStartUpload = async () => {
  uploadStatus.addUpload({
    id: file.value.uniqueIdentifier,
    progress: 0,
    workspaceId,
    isComplete: false,
    projectId: projectShortUuid,
    packageId: currentPackageData.value.suuid
  })

  r.value.upload()
  showConfirmation.value = false
  isUploadStart.value = true
}

const handleConfirmationClosed = () => {
  isFileAdded.value = false
  isUploadStart.value = false
  isUploadFinish.value = false
  showConfirmation.value = false
  isPackageRegister.value = false
}

const handleUploadStop = () => {
  handleConfirmationClosed()
  r.value.cancel()
  uploadStatus.deleteLastUpload()
}

const handeUploadProcessingClose = () => {
  isUploadStart.value = false
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
