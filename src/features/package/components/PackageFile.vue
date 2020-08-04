<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <v-toolbar dense flat>
        <v-btn icon small @click="handleBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <div>{{ currentPath.name }} {{ currentPath.size }} Bytes</div>

        <v-spacer></v-spacer>
        <v-btn small outlined color="secondary" class="mr-1 btn--hover" @click="handleDownload">
          <v-icon color="secondary" left>mdi-download</v-icon>Download file
        </v-btn>
        <v-btn small outlined color="secondary" class="mr-1 btn--hover" @click="handleCopy">
          <v-icon color="secondary" left>mdi-content-copy</v-icon>Copy file
        </v-btn>
      </v-toolbar>
      <prism-editor :code="fileComputed" language="js" readonly line-numbers />
    </v-col>
  </v-row>
</template>

<script>
import PrismEditor from 'vue-prism-editor'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import { defineComponent, watch, computed } from '@vue/composition-api'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

export default defineComponent({
  name: 'PackageFile',

  components: {
    PrismEditor
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
    }
  },

  setup(props, context) {
    const snackBar = useSnackBar()
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

    const handleDownload = () => forceFileDownload.trigger({ source: props.fileSource, name: props.currentPath.name })

    return {
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
