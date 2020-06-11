<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <div class="px-4">
        <v-toolbar dense flat color="grey lighten-3" class="br-r4">
          <v-flex class="d-flex">
            <div class="mr-auto d-flex align-center">
              REPLACE THIS CODE PACKAGE
            </div>
          </v-flex>
        </v-toolbar>
        <v-card class="my-2" outlined>
          <v-card-text
            >If you want to replace this code package, you are in the right place. Below you can find instructions on
            how you can use the AskAnna CLI (add link) to push a new version of the code to this project. Also, you can
            drag & drop a (zip) file to this screen. You can upload a single file, or make a zip file of your local
            directory and upload this zip file.
          </v-card-text>
        </v-card>

        <div>
          <VueFileAgent
            ref="vueFileAgent"
            :theme="'list'"
            :multiple="true"
            :deletable="true"
            :meta="true"
            :accept="'image/*,.zip'"
            :maxSize="'100MB'"
            :maxFiles="14"
            :helpText="'Choose  zip files'"
            :errorText="{
              type: 'Invalid file type. Only images or zip Allowed',
              size: 'Files should not exceed 10MB in size'
            }"
            @select="filesSelected($event)"
            @beforedelete="onBeforeDelete($event)"
            @delete="fileDeleted($event)"
            v-model="fileRecords"
          />

          <v-btn
            :disabled="!fileRecordsForUpload.length"
            small
            outlined
            color="primary"
            class="my-2"
            @click="uploadFiles()"
          >
            <v-icon color="primary" left>mdi-upload</v-icon>Upload {{ fileRecordsForUpload.length }} files
          </v-btn>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import usePackages from '@packages/composition/usePackages'

import { defineComponent } from '@vue/composition-api'
import PackageFile from '@package/components/PackageFile'
import PackageTree from '@package/components/PackageTree'
import { headers, FileIcons } from '@package/utils/index'
import { ref, watch, onBeforeMount, computed } from '@vue/composition-api'
import usePackageStore from '@/features/package/composition/usePackageStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'

export default defineComponent({
  components: { PackageFile, PackageTree },

  setup(props, context) {
    const { height } = useWindowSize()
    const packageStore = usePackageStore()
    const packages = usePackages(context)

    const breadcrumbs = usePackageBreadcrumbs(context)
    const forceFileDownload = useForceFileDownload()

    const showReplaceSection = ref(false)

    onBeforeMount(async () => {
      const { projectId, packageId, folderName } = context.root.$route.params

      await packageStore.getPackage({
        projectId,
        packageId,
        folderName
      })
    })

    const calcHeight = computed(() => height.value - 450)
    const path = computed(() => context.root.$route.params.folderName || '/')

    const currentPath = computed(() => {
      const pathArray = path.value.split('/')
      const fileName = pathArray.pop()
      const current = packageStore.packageData.value.files.find(item => item.name === fileName)

      return current
    })

    const treeView = computed(() => {
      let parentPath
      if (currentPath.value && currentPath.value.is_dir && path.value !== '/') {
        parentPath = packageStore.packageData.value.files.find(
          file => file.name === currentPath.value.parent && file.is_dir
        )
        parentPath = {
          ...parentPath,
          name: '...',
          ext: 'parent'
        }
      }
      const tree = packageStore.packageData.value.files.filter(item => item.parent === path.value)

      return parentPath ? [parentPath, ...tree] : tree
    })

    watch(currentPath, async (currentPath, prevPath) => {
      const path = currentPath && !currentPath.is_dir && currentPath.name !== '' ? currentPath.path : ''
      if (prevPath && path !== '' && path === prevPath.path) return

      await packageStore.getFileSource(path)
    })

    const handleClickOnRow = async item => {
      const { workspaceId, projectId, packageId, versionId, folderName = '' } = context.root.$route.params
      let path = `/${workspaceId}/project/${projectId}/packages/${packageId}/version/${versionId}/${folderName}/${item.name}`

      if (typeof item.path === 'undefined') {
        path = `/${workspaceId}/project/${projectId}/packages/${packageId}/version/${versionId}`
      }

      if (item.is_dir) {
        path = `/${workspaceId}/project/${projectId}/packages/${packageId}/version/${versionId}/${item.path}`
      }

      context.root.$router.push({ path })
    }

    const handleHistory = () => {
      const { projectId, packageId } = context.root.$route.params
      context.root.$router.push({
        name: 'workspace-project-packages-uuid-history',
        params: { projectId, packageId, versionId: '1' }
      })
    }

    const handleDownload = async () => {
      const packageData = packageStore.packageData.value
      const source = await packages.downloadPackage({
        projectId: packageData.project,
        packageId: packageData.short_uuid
      })
      forceFileDownload.trigger({ source, name: packageData.filename })
    }

    const handleReplace = () => (showReplaceSection.value = true)

    const uploadFiles = () => ''

    const fileRecords = ref([])
    const fileRecordsForUpload = ref([])

    const filesSelected = fileRecordsNewlySelected => {
      const validFileRecords = fileRecordsNewlySelected.filter(fileRecord => !fileRecord.error)
      fileRecordsForUpload.value = fileRecordsForUpload.value.concat(validFileRecords)
    }

    const onBeforeDelete = fileRecord => {
      var i = fileRecordsForUpload.value.indexOf(fileRecord)
      if (i !== -1) {
        fileRecordsForUpload.value = fileRecordsForUpload.value.splice(i, 1)
      } else {
        if (confirm('Are you sure you want to delete?')) {
          context.root.$refs.vueFileAgent.deleteFileRecord(fileRecord) // will trigger 'delete' event
        }
      }
    }

    return {
      packageId: context.root.$route.params.packageId,
      file: packageStore.file,
      fileSource: packageStore.fileSource,
      treeView,
      FileIcons,
      calcHeight,
      breadcrumbs,
      showReplaceSection,
      currentPath,
      handleReplace,
      handleHistory,
      handleDownload,
      handleClickOnRow,

      fileRecords,
      onBeforeDelete,
      filesSelected,
      fileRecordsForUpload,
      uploadFiles
    }
  }
})
</script>
