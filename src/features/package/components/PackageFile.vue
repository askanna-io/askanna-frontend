<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <v-toolbar dense flat v-sticky="sticked" :sticky-offset="stickyParams" :sticky-z-index="1">
        <v-btn icon small @click="handleBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <div>
          {{ currentPath.name }}<span class="pl-3">({{ `${humanize.humanizeSize(currentPath.size)}` }})</span>
        </div>

        <v-spacer></v-spacer>
        <v-btn
          v-if="!$vuetify.breakpoint.xsOnly"
          small
          outlined
          color="secondary"
          class="mr-1 btn--hover"
          @click="handleDownload"
        >
          <v-icon color="secondary" left>mdi-download</v-icon>Download file
        </v-btn>
        <v-btn
          v-if="!$vuetify.breakpoint.xsOnly"
          small
          outlined
          color="secondary"
          class="mr-1 btn--hover"
          @click="handleCopy"
        >
          <v-icon color="secondary" left>mdi-content-copy</v-icon>Copy
        </v-btn>
      </v-toolbar>
      <PackageFileImage v-if="isFileImg" :dataSource="fileSource" />
      <package-notebook v-else-if="isIpynb" :file="file" :fileSource="fileSource" />
      <the-highlight v-else-if="fileComputed" :value="fileComputed" :languageName="languageName" />
      <v-alert v-else class="ma-4 text-center" dense outlined> This file is empty. </v-alert>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useRouter } from '@u3u/vue-hooks'
import { computed } from '@vue/composition-api'
import useCopy from '@/core/composition/useCopy'
import PackageNotebook from './PackageNotebook.vue'
import PackageFileImage from './PackageFileImage.vue'
import { useMobileStore } from '@/core/store/useMobileStore'
import useSizeHumanize from '@/core/composition/useSizeHumanize'
import TheHighlight from '@/core/components/highlight/TheHighlight.vue'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

const props = defineProps({
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
})

const allowedLangs = ['json', 'md', 'py', 'txt', 'yml', 'ini', 'toml', 'markdown']
const copy = useCopy()
const { router } = useRouter()
const humanize = useSizeHumanize()
const mobileStore = useMobileStore()

const forceFileDownload = useForceFileDownload()

const fileComputed = computed(() => props.file)
const handleBack = () => router.back()

const stickyParams = computed(() =>
  mobileStore.isMenuOpen && mobileStore.isMenuSticked ? '{top: 252, bottom: 10}' : '{top: 52, bottom: 10}'
)

const imgExts = ['jpg', 'png', 'gif', 'jpeg']
const isIpynb = computed(() => props.currentPath.ext === 'ipynb')
const isFileImg = computed(() => imgExts.includes(props.currentPath.ext))
const languageName = computed(() => (allowedLangs.includes(props.currentPath.ext) ? props.currentPath.ext : 'markdown'))

const handleCopy = () => {
  if (isFileImg.value) {
    copy.handleCopyElementBySource(props.fileSource)

    return
  }
  copy.handleCopyText(props.file || ' ')
}
const handleDownload = () => forceFileDownload.trigger({ source: props.fileSource, name: props.currentPath.name })
</script>
