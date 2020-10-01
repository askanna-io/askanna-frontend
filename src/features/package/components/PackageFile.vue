<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <v-toolbar dense flat v-sticky="sticked" sticky-offset="{top: 52, bottom: 10}">
        <v-btn icon small @click="handleBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <div>{{ currentPath.name }} {{ humanizeSize(currentPath.size) }}</div>

        <v-spacer></v-spacer>
        <v-btn small outlined color="secondary" class="mr-1 btn--hover" @click="handleDownload">
          <v-icon color="secondary" left>mdi-download</v-icon>Download file
        </v-btn>
        <v-btn small outlined color="secondary" class="mr-1 btn--hover" @click="handleCopy">
          <v-icon color="secondary" left>mdi-content-copy</v-icon>Copy file
        </v-btn>
      </v-toolbar>
      <package-file-image v-if="isFileImg" :fileSource="fileSource" />
      <package-notebook v-else-if="isIpynb" :file="file" :fileSource="fileSource" />
      <prism-editor v-else :code="fileComputed" language="js" readonly line-numbers />
    </v-col>
  </v-row>
</template>

<script>
import PrismEditor from 'vue-prism-editor'
import PackageNotebook from './PackageNotebook'
import PackageFileImage from './PackageFileImage'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useSizeHumanize from '@/core/composition/useSizeHumanize'
import { defineComponent, watch, computed } from '@vue/composition-api'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

export default defineComponent({
  name: 'PackageFile',

  components: {
    PrismEditor,
    PackageNotebook,
    PackageFileImage
  },

  props: {
    file: String,
    fileSource: String | Blob,
    breadcrumbs: {
      type: Array,
      default: () => []
    },
    currentPath: {
      type: Object,
      default: () => {}
    },
    sticked: {
      type: Boolean,
      default: true
    }
  },

  setup(props, context) {
    const snackBar = useSnackBar()
    const sizeHumanize = useSizeHumanize()
    const forceFileDownload = useForceFileDownload()

    const fileComputed = computed(() => props.file)
    const handleBack = () => context.root.$router.back(-1)

    const handleCopy = () => {
      context.root.$copyText(props.file).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
        }
      )
    }

    const imgExts = ['jpg', 'png', 'gif']
    const isIpynb = computed(() => props.currentPath.ext === 'ipynb')
    const isFileImg = computed(() => imgExts.includes(props.currentPath.ext))

    const handleDownload = () => forceFileDownload.trigger({ source: props.fileSource, name: props.currentPath.name })

    return {
      ...sizeHumanize,
      isIpynb,
      isFileImg,
      handleBack,
      handleCopy,
      fileComputed,
      handleDownload
    }
  }
})
</script>
<style>
.prism-editor-wrapper .language-js {
  box-shadow: none;
}
</style>
