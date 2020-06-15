<template>
  <v-row no-gutters class="upload" ref="uploadContainer">
    <v-col cols="12">
      <div ref="draggable" class="is-sortable-disabled is-drag-valid theme-list">
        <div class="grid-block-wrapper vue-file-agent file-input-wrapper has-multiple">
          <canvas style="position: fixed; visibility: hidden; z-index: -3;"></canvas>
          <div transitionduration="300" pressdelay="0" helperclass="active-sorting-item">
            <div>
              <file-preview v-for="(file, index) in fileRecordsForUpload" :fileData="file" :key="index" />
              <div ref="browseButton" class="file-preview-wrapper grid-box-item grid-block file-preview-new">
                <span class="file-preview"
                  ><span style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"
                    ><svg viewBox="0 0 1000 1000">
                      <path
                        d="M745,353c-5.6,0-11.3,0.2-17.2,0.7C687.4,237.3,577.8,157,451,157c-162.1,0-294,131.9-294,294c0,2.1,0,4.1,0,6.2C72.6,479,10,555.8,10,647c0,108.1,87.9,196,196,196h245V618.3l-63.4,63.4c-9.6,9.6-22.1,14.4-34.6,14.4s-25.1-4.8-34.6-14.4c-19.2-19.2-19.2-50.1,0-69.3l147-147c4.6-4.6,9.9-8.1,16-10.6c12-4.9,25.5-4.9,37.4,0c6,2.5,11.4,6.1,16,10.6l147,147c19.2,19.2,19.2,50.1,0,69.3c-9.6,9.6-22.1,14.4-34.6,14.4s-25.1-4.8-34.6-14.4L549,618.3V843h196c135.1,0,245-109.9,245-245S880.1,353,745,353z"
                      ></path></svg
                    ><span class="help-text">Choose zip files</span></span
                  ></span
                >
              </div>
            </div>
          </div>
          <input title="" type="file" multiple="multiple" accept="image/*,.zip" class="file-input" />
        </div>
      </div>

      <div ref="results" class="panel"></div>

      <v-btn
        ref="uploadFiles"
        class="my-2"
        :disabled="!fileRecordsForUpload.length"
        small
        outlined
        @click="uploadFiles()"
        color="secondary"
      >
        <v-icon color="secondary" left>mdi-upload</v-icon>Upload
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import Resumablejs from 'resumablejs'
import FilePreview from './FilePreview.vue'
import { ref, watch, reactive, computed, defineComponent, onMounted } from '@vue/composition-api'

export default defineComponent({
  name: 'AskAnnaResumableUpload',

  components: { FilePreview },

  props: {
    statusData: {
      type: Object,
      default: function () {
        return {
          status: 'UNDIFENED',
          runtime: 0,
          memory: 0,
          return_payload: null,
          stdout: null,
          created: '',
          finished: ''
        }
      }
    }
  },

  setup(props, context) {
    const r = ref(null)
    const results = ref(null)
    const draggable = ref(null)
    const uploadFile = ref(null)
    const uploadContainer = ref(null)
    const browseButton = ref(null)
    const nothingToUpload = ref(null)

    const token = localStorage.getItem('token')
    const uploadHeaders = { Authorization: `Token ${token}` }

    onMounted(async () => {
      r.value = new Resumablejs({
        target: getTarget,
        query: {},
        maxChunkRetries: 2,
        maxFiles: 3,
        prioritizeFirstAndLastChunk: true,
        simultaneousUploads: 4,
        chunkSize: 1 * 1024 * 1024,
        headers: uploadHeaders
      })
    })

    watch(uploadContainer, async uploadContainer => {
      if (!uploadContainer) return
      r.value.on('filesAdded', function (file, event) {
        console.log('filesAdded')
      })

      r.value.on('fileAdded', function (file, event) {
        event.preventDefault()
        console.log('fileAdded')
      })
      r.value.on('uploadStart', function (file, event) {})

      r.value.on('uploadStart', function () {
        console.log('uploadStart')
      })
      console.log(browseButton)
      r.value.assignDrop(draggable.value)
      r.value.assignBrowse(browseButton.value)
    })

    const getTarget = async () => {
      const { projectId, packageId } = context.root.$route.params
      const [fileMetaData] = r.value.files
      const packageData = await packageStore.uploadPackage({
        project: 'f1e2144a-87f9-4936-8562-4304c51332ea',
        filename: fileMetaData.file.name,
        size: fileMetaData.file.size
      })
      return `https://api.askanna.eu/v1/package/${packageData.uuid}/packagechunk/`
    }

    const fileRecordsForUpload = computed(() => r.value && r.value.files)
    const uploadFiles = async () => {
      console.log('uploadFiles')
      const { projectId, packageId } = context.root.$route.params
      const [fileMetaData] = r.value.files

      r.value.upload()
    }

    return { draggable, results, browseButton, uploadContainer, fileRecordsForUpload }
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
