<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <v-toolbar dense flat v-sticky="sticked" sticky-offset="{top: 52, bottom: 10}">
        <v-btn icon small @click="handleBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <div>
          {{ currentPath.name }}<span class="pl-3">({{ `${humanizeSize(currentPath.size)}` }})</span>
        </div>

        <v-spacer></v-spacer>
        <v-btn small outlined color="secondary" class="mr-1 btn--hover" @click="handleDownload">
          <v-icon color="secondary" left>mdi-download</v-icon>Download file
        </v-btn>
        <v-btn small outlined color="secondary" class="mr-1 btn--hover" @click="handleCopy">
          <v-icon color="secondary" left>mdi-content-copy</v-icon>Copy
        </v-btn>
      </v-toolbar>
      <package-file-image v-if="isFileImg" :fileSource="fileSource" />
      <package-notebook v-else-if="isIpynb" :file="file" :fileSource="fileSource" />
      <the-highlight v-else-if="fileComputed" :value="fileComputed" :languageName="languageName" />
      <v-alert v-else class="ma-4 text-center" dense outlined color="grey">
        This file is empty.
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import useCopy from '@/core/composition/useCopy'
import PackageNotebook from './PackageNotebook'
import PackageFileImage from './PackageFileImage'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useSizeHumanize from '@/core/composition/useSizeHumanize'
import { defineComponent, computed } from '@vue/composition-api'
import TheHighlight from '@/core/components/highlight/TheHighlight'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

export default defineComponent({
  name: 'PackageFile',

  components: {
    TheHighlight,
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
      default: () => {
        return {
          ext: '',
          is_dir: true,
          last_modified: '',
          name: '',
          parent: '/',
          path: '',
          size: 0,
          type: ''
        }
      }
    },
    sticked: {
      type: Boolean,
      default: true
    }
  },

  setup(props, context) {
    const allowedLangs = ['json', 'md', 'py', 'txt', 'yml', 'ini', 'toml', 'markdown']
    const copy = useCopy(context)
    const snackBar = useSnackBar()
    const sizeHumanize = useSizeHumanize()
    const forceFileDownload = useForceFileDownload()

    const fileComputed = computed(() => props.file)
    const handleBack = () => context.root.$router.back(-1)

    const handleCopy = () => {
      copy.handleCopyText(props.file || ' ')
    }

    const imgExts = ['jpg', 'png', 'gif', 'jpeg']
    const isIpynb = computed(() => props.currentPath.ext === 'ipynb')
    const isFileImg = computed(() => imgExts.includes(props.currentPath.ext))
    const languageName = computed(() =>
      allowedLangs.includes(props.currentPath.ext) ? props.currentPath.ext : 'markdown'
    )

    const handleDownload = () => forceFileDownload.trigger({ source: props.fileSource, name: props.currentPath.name })

    return {
      languageName,
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
