<template>
  <v-row no-gutters class="upload mb-2" ref="uploadContainer">
    <v-col cols="12">
      <div ref="draggable" class="is-sortable-disabled is-drag-valid theme-list">
        <div ref="browseButton" class="grid-block-wrapper vue-file-agent file-input-wrapper has-multiple">
          <canvas style="position: fixed; visibility: hidden; z-index: -3;"></canvas>
          <div transitionduration="300" pressdelay="0" helperclass="active-sorting-item">
            <div>
              <file-preview
                v-for="(resumableFile, index) in fileRecordsForUpload"
                :resumableFile="resumableFile"
                :key="index"
                @deleteFile="handleDeleteFile"
              />
              <div class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                <span class="file-preview">
                  <span style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;">
                    <svg viewBox="0 0 1000 1000">
                      <path
                        d="M745,353c-5.6,0-11.3,0.2-17.2,0.7C687.4,237.3,577.8,157,451,157c-162.1,0-294,131.9-294,294c0,2.1,0,4.1,0,6.2C72.6,479,10,555.8,10,647c0,108.1,87.9,196,196,196h245V618.3l-63.4,63.4c-9.6,9.6-22.1,14.4-34.6,14.4s-25.1-4.8-34.6-14.4c-19.2-19.2-19.2-50.1,0-69.3l147-147c4.6-4.6,9.9-8.1,16-10.6c12-4.9,25.5-4.9,37.4,0c6,2.5,11.4,6.1,16,10.6l147,147c19.2,19.2,19.2,50.1,0,69.3c-9.6,9.6-22.1,14.4-34.6,14.4s-25.1-4.8-34.6-14.4L549,618.3V843h196c135.1,0,245-109.9,245-245S880.1,353,745,353z"
                      />
                    </svg>
                    <span class="help-text">Choose zip files</span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-btn
        ref="uploadFiles"
        class="my-2"
        :disabled="fileRecordsForUpload && !fileRecordsForUpload.length"
        small
        outlined
        @click="handleConfirmUpload"
        color="secondary"
      >
        <v-icon color="secondary" left>mdi-upload</v-icon>Upload
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
import ConfirmDialog from './ConfirmDialog.vue'
import Resumablejs from '@/core/plugins/resumable.js'
import usePackageStore from '@/features/package/composition/usePackageStore'

import { ref, watch, reactive, computed, defineComponent, onMounted } from '@vue/composition-api'

export default defineComponent({
  name: 'AskAnnaResumableUpload',

  components: { FilePreview, ConfirmDialog },

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
    },
    finishUpload: {
      type: Function,
      default: () => ''
    }
  },

  setup(props, context) {
    const packageStore = usePackageStore()

    const r = ref(null)
    const draggable = ref(null)
    const browseButton = ref(null)
    const uploadContainer = ref(null)

    const progress = ref(0)
    const isUploadStart = ref(false)
    const isUploadFinish = ref(false)
    const showConfirmation = ref(false)

    const currentChunkData = ref({
      uuid: '',
      short_uuid: '',
      index: 0,
      isLastChunk: false
    })

    const currentPackageData = ref({
      uuid: '',
      short_uuid: ''
    })

    const token = localStorage.getItem('token')
    const uploadHeaders = { Authorization: `Token ${token}` }

    onMounted(async () => {
      r.value = new Resumablejs({
        target: getTarget,
        testChunks: false,
        testMethod: 'POST',
        preprocess: preprocess,
        maxChunkRetries: 3,
        maxFiles: 1,
        fileType: ['zip'],
        prioritizeFirstAndLastChunk: true,
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

        const { uuid, short_uuid } = await handleRegisterPackage(r.file)
        currentPackageData.value = { uuid, short_uuid }
      })

      r.value.on('uploadStart', function () {
        isUploadStart.value = true
      })

      r.value.on('fileProgress', file => (progress.value = Math.floor(file.progress() * 100)))

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

    const handleConfirmUpload = () => {
      showConfirmation.value = true
    }

    const handleRegisterPackage = async file => {
      const packageData = await packageStore.registerPackage({
        project: 'f1e2144a-87f9-4936-8562-4304c51332ea',
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
    }

    const uploadFiles = async () => {
      r.value.upload()
    }

    const handleDeleteFile = uniqueIdentifier => {
      const file = r.value.getFromUniqueIdentifier(uniqueIdentifier)

      r.value.removeFile(file)
    }

    const handleConfirmationClosed = () => {
      showConfirmation.value = false
    }

    return {
      progress,
      draggable,
      uploadFiles,
      browseButton,
      isUploadStart,
      isUploadFinish,
      uploadContainer,
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
.upload.--drop-zone {
  text-align: center;
  border-radius: 2px;
  border: 2px dashed #ccc;
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
