<template>
  <v-row no-gutters class="upload mb-2" ref="uploadContainer">
    <v-col cols="12">
      <div ref="draggable" @click.stop class="is-sortable-disabled is-drag-valid theme-list drop-zone">
        <div class="grid-block-wrapper vue-file-agent file-input-wrapper has-multiple">
          <replace-info :projectShortUuid="projectShortUuid" />
          <canvas style="position: fixed; visibility: hidden; z-index: -3;"></canvas>
          <div transitionduration="300" pressdelay="0" helperclass="active-sorting-item">
            <div>
              <file-preview
                v-for="(resumableFile, index) in fileRecordsForUpload"
                :resumableFile="resumableFile"
                :key="index"
                @deleteFile="handleDeleteFile"
              />
            </div>
          </div>
        </div>
      </div>
      <span ref="browseButton">
        <v-btn
          class="my-2 mr-2"
          v-if="fileRecordsForUpload && !fileRecordsForUpload.length"
          small
          outlined
          color="secondary"
        >
          <v-icon color="secondary" left>mdi-upload</v-icon>Browse
        </v-btn>
      </span>
      <span ref="uploadFiles">
        <v-btn
          class="my-2 mr-2"
          v-if="fileRecordsForUpload && fileRecordsForUpload.length"
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
        :progress="progress"
        :isUploadStart="isUploadStart"
        :isUploadFinish="isUploadFinish"
        @uploadFiles="uploadFiles"
        @confirmationClosed="handleConfirmationClosed"
      />
    </v-col>
  </v-row>
</template>

<script>
import FilePreview from './FilePreview.vue'
import ReplaceInfo from './ReplaceInfo.vue'
import ConfirmDialog from './ConfirmDialog.vue'

import Resumablejs from '@/core/plugins/resumable.js'
import useUploadStatus from '@/core/components/uploadStatus/useUploadStatus'
import usePackageStore from '@/features/package/composition/usePackageStore'

import { ref, watch, reactive, computed, defineComponent, onMounted } from '@vue/composition-api'

export default defineComponent({
  name: 'ResumableUpload',

  components: { ReplaceInfo, FilePreview, ConfirmDialog },

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

    const { projectId: projectShortUuid } = context.root.$route.params

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
        file.value = r.file
      })

      r.value.on('uploadStart', function () {
        isUploadStart.value = true
      })

      r.value.on('fileProgress', file => {
        const prg = Math.floor(file.progress() * 100)

        progress.value = prg
        uploadStatus.setUpload({
          id: file.uniqueIdentifier,
          name: file.fileName,
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

    const handleConfirmUpload = () => {
      showConfirmation.value = true
    }

    const handleRegisterPackage = async file => {
      const packageData = await packageStore.registerPackage({
        project: projectUuid.value,
        filename: file.name,
        size: file.size
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
      isUploadStart.value = false
      isPackageRegister.value = false
    }

    const uploadFiles = async () => {
      uploadStatus.addUpload({
        id: file.value.uniqueIdentifier,
        progress: 0,
        projectId: projectShortUuid,
        packageId: currentPackageData.value.short_uuid
      })

      r.value.upload()
      handleConfirmationClosed()
    }

    const handleDeleteFile = uniqueIdentifier => {
      const file = r.value.getFromUniqueIdentifier(uniqueIdentifier)

      r.value.removeFile(file)
      isUploadStart.value = false
      isPackageRegister.value = false
    }

    const handleConfirmationClosed = () => {
      isUploadStart.value = false
      showConfirmation.value = false
      isPackageRegister.value = false

      if (!isUploadStart.value) {
        return
      }
      console.log(file.value)
      handleDeleteFile(file.value.uniqueIdentifier)

      /*   context.root.$router.push({
        name: 'workspace-project-package',
        params: {
          projectId: projectShortUuid,
          packageId: currentPackageData.value.short_uuid
        }
      }) */
    }

    const handleCancel = () => context.emit('cancelUpload')

    return {
      progress,
      draggable,
      uploadFiles,
      browseButton,
      handleCancel,
      isUploadStart,
      isUploadFinish,
      uploadContainer,
      projectShortUuid,
      showConfirmation,
      handleConfirmUpload,
      fileRecordsForUpload,
      handleDeleteFile,
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
