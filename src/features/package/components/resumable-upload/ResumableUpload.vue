<template>
  <v-row no-gutters class="upload mb-2" ref="uploadContainer">
    <v-col cols="12">
      <div ref="draggable" @click.stop class="is-sortable-disabled is-drag-valid theme-list drop-zone">
        <div class="grid-block-wrapper vue-file-agent file-input-wrapper has-multiple">
          <replace-info :projectShortUuid="projectShortUuid" :workspaceId="workspaceId" />
          <canvas style="position: fixed; visibility: hidden; z-index: -3;"></canvas>
          <div transitionduration="300" pressdelay="0" helperclass="active-sorting-item">
            <div>
              <file-preview
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
        <v-btn class="my-2 mr-2" v-if="!isFileAdded" small outlined color="secondary">
          <v-icon color="secondary" left>mdi-upload</v-icon>Browse
        </v-btn>
      </span>
      <span>
        <v-btn
          class="my-2 mr-2"
          v-if="isFileAdded && fileRecordsForUpload && fileRecordsForUpload.length"
          small
          outlined
          @click="handleConfirmUpload"
          color="secondary"
        >
          <v-icon color="secondary" left>mdi-upload</v-icon>Upload
        </v-btn>
      </span>
      <v-btn class="my-2" small outlined @click="handleCancel" color="secondary">
        <v-icon color="secondary" left>mdi-cancel</v-icon>Cancel
      </v-btn>
      <confirm-dialog
        v-if="showConfirmation"
        @uploadStarted="handleStartUpload"
        @cancelUploadStarted="handleCancelUploadStarted"
      />
      <upload-process-dialod
        v-if="isUploadStart"
        :progress="progress"
        :projectId="projectShortUuid"
        :packageId="packageShortUuid"
        :isUploadFinish="isUploadFinish"
        @confirmationClosed="handleConfirmationClosed"
      />
    </v-col>
  </v-row>
</template>

<script>
import FilePreview from './FilePreview.vue'
import ReplaceInfo from './ReplaceInfo.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import UploadProcessDialod from './UploadProcessDialod.vue'

import Resumablejs from '@/core/plugins/resumable.js'
import useUploadStatus from '@/core/components/uploadStatus/useUploadStatus'
import usePackageStore from '@/features/package/composition/usePackageStore'

import { ref, watch, reactive, computed, defineComponent, onMounted } from '@vue/composition-api'

export default defineComponent({
  name: 'ResumableUpload',

  components: { ReplaceInfo, FilePreview, ConfirmDialog, UploadProcessDialod },

  props: {
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
    }
  },

  setup(props, context) {
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
      uuid: '',
      short_uuid: ''
    })

    const packageShortUuid = computed(() => currentPackageData.value.short_uuid)

    const { projectId: projectShortUuid, workspaceId } = context.root.$route.params

    const projectUuid = computed(() => packageStore.packageData.value.project)

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

          packageId: currentPackageData.value.short_uuid
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
      const { short_uuid } = currentPackageData.value
      const url = `https://api.askanna.eu/v1/package/${short_uuid}/packagechunk/${uuid}/chunk/`

      return url
    }

    const preprocess = async r => {
      const { uuid } = await handleRegisterChunkPackage(r)
      currentChunkData.value = { uuid }
      r.preprocessFinished()
    }

    const preupload = async () => {
      const { uuid, short_uuid } = await handleRegisterPackage(file.value)

      currentPackageData.value = { uuid, short_uuid }
      isPackageRegister.value = true
    }

    const generateUniqueIdentifier = file => `${file.name}.${Date.now()}`

    const handleConfirmUpload = () => {
      showConfirmation.value = true
    }

    const handleRegisterPackage = async file => {
      const packageData = await packageStore.registerPackage({
        project: projectUuid.value,
        filename: file.name,
        size: file.size,
        title: file.name,
        description: file.name
      })

      return packageData
    }

    const handleRegisterChunkPackage = async r => {
      const { uuid, short_uuid } = currentPackageData.value
      const isLastChunk = r.offset + 1 === r.fileObj.chunks.length

      const registerChunk = await packageStore.registerChunkPackage({
        uuid: short_uuid,
        data: {
          filename: r.offset + 1,
          size: r.fileObjSize,
          file_no: r.offset + 1,
          is_last: isLastChunk,
          package: uuid
        }
      })

      return registerChunk
    }

    const handleFinishUpload = async r => {
      const { short_uuid } = currentPackageData.value

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

      const result = await packageStore.finishUpload({ uuid: short_uuid, data })

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
        packageId: currentPackageData.value.short_uuid
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

    const handleCancel = () => context.emit('cancelUpload')
    const getIndex = () => Date.now()

    return {
      progress,
      draggable,
      workspaceId,
      isFileAdded,
      browseButton,
      handleCancel,
      isUploadStart,
      isUploadFinish,
      uploadContainer,
      projectShortUuid,
      packageShortUuid,
      showConfirmation,
      handleStartUpload,
      handleConfirmUpload,
      handleCancelUploadStarted,
      fileRecordsForUpload,
      handleDeleteFile,
      getIndex,
      handleConfirmationClosed
    }
  }
})
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