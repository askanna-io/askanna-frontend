<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" exact>
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <v-divider />

      <v-toolbar dense flat>
        <v-btn icon small @click="handleBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title
          >{{ currentPath.name }} <span class="caption">{{ currentPath.size }} Bytes</span></v-toolbar-title
        >

        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon @click="handleDownload" v-on="on">
              <v-icon>mdi-file-download </v-icon>
            </v-btn>
          </template>
          <span>Download file</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon @click="handleCopy" v-on="on">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>Copy file</span>
        </v-tooltip>
      </v-toolbar>
      <prism-editor :code="file" readonly line-numbers />
    </v-col>
  </v-row>
</template>

<script>
import PrismEditor from 'vue-prism-editor'
import { createComponent } from '@vue/composition-api'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

export default createComponent({
  name: 'TheFile',

  components: {
    PrismEditor
  },

  props: {
    file: String,
    fileSource: Blob,
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

    const handleBack = () => context.root.$router.back(-1)

    const handleCopy = () => {
      context.root.$copyText(props.file).then(
        function(e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function(e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
        }
      )
    }

    const handleDownload = () => forceFileDownload.trigger({ source: props.fileSource, name: props.currentPath.name })

    return {
      handleBack,
      handleCopy,
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
