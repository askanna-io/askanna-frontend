<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <package-toolbar :breadcrumbs="breadcrumbs">
        <template v-slot:left>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <div v-on="on">
                <a v-if="file" @click="handeBackToPackageRoot" class="text-body-2"
                  >Package #{{ packageId.slice(0, 4) }}<v-icon small>mdi-chevron-right</v-icon></a
                >
                <span class="text-body-2" v-else> Package #{{ packageId.slice(0, 4) }}</span>
              </div>
            </template>
            <span>{{ packageId }}</span>
          </v-tooltip>
        </template>
        <template v-slot:rigth>
          <v-btn small outlined color="secondary" class="mr-1 btn--hover" @click="handleDownload()">
            <v-icon color="secondary" left>mdi-download</v-icon>Download
          </v-btn>
          <v-btn
            small
            outlined
            :class="{ 'replace-active': isRaplace }"
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleReplace()"
          >
            <v-icon color="secondary" left>mdi-folder-move</v-icon>Replace
          </v-btn>

          <v-btn small outlined color="secondary" class="btn--hover" @click="handleHistory()">
            <v-icon color="secondary">mdi-history</v-icon>History
          </v-btn>
        </template>
      </package-toolbar>

      <v-expand-transition>
        <resumable-upload v-if="isRaplace" @cancelUpload="handleReplace" class="py-2 px-4" :id="packageId" />
      </v-expand-transition>
      <template v-if="isProcessing">
        <package-processing />
      </template>
      <template v-else>
        <package-file v-if="file" :file="file" :fileSource="fileSource" :currentPath="currentPath" />
        <package-tree v-else :items="treeView" :height="calcHeight" @clickOnRow="handleClickOnRow" />
      </template>
    </v-col>
  </v-row>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import { defineComponent } from '@vue/composition-api'
import PackageFile from '@package/components/PackageFile'
import PackageTree from '@package/components/PackageTree'
import { headers, FileIcons } from '@package/utils/index'
import usePackages from '@packages/composition/usePackages'
import PackageToolbar from '@/features/package/components/PackageToolbar'
import { ref, watch, onBeforeMount, onUnmounted, computed } from '@vue/composition-api'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import usePackageStore from '@/features/package/composition/usePackageStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'

export default defineComponent({
  name: 'Package',

  components: {
    PackageFile,
    PackageTree,
    PackageToolbar,
    PackageProcessing: () => import('@/features/package/components/PackageProcessing.vue'),
    ResumableUpload: () => import('@/features/package/components/resumable-upload/ResumableUpload.vue')
  },

  setup(props, context) {
    const { height } = useWindowSize()
    const packages = usePackages(context)
    const packageStore = usePackageStore()
    const forceFileDownload = useForceFileDownload()
    const breadcrumbs = usePackageBreadcrumbs(context)

    const polling = ref(null)
    const isRaplace = ref(false)
    const file = ref(packageStore.file)
    const { workspaceId, projectId, packageId, versionId = 0, folderName = '' } = context.root.$route.params

    onBeforeMount(async () => {
      await getPackage()
      pollData()
    })

    onUnmounted(() => {
      clearInterval(polling.value)
    })

    const getPackage = async () =>
      await packageStore.getPackage({
        projectId,
        packageId,
        folderName
      })

    const pollData = () => {
      polling.value = setInterval(async () => {
        await getPackage()
        checkProcessing()
      }, 10000)
    }

    const checkProcessing = () => {
      if (!isProcessing.value) {
        clearInterval(polling.value)
      }
    }

    const calcHeight = computed(() => height.value - 370)
    const path = computed(() => context.root.$route.params.folderName || '/')
    const isProcessing = computed(() => packageStore.processingList.value.find(item => item.packageId === packageId))

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
      let path = `/${workspaceId}/project/${projectId}/${packageId}/version/${versionId}/${folderName}/${item.name}`
      if (item.parent === '/') {
        path = `/${workspaceId}/project/${projectId}/${packageId}/version/${versionId}/${item.name}`
      }

      if (typeof item.path === 'undefined') {
        path = `/${workspaceId}/project/${projectId}/${packageId}/version/${versionId}`
      }

      if (item.is_dir) {
        path = `/${workspaceId}/project/${projectId}/${packageId}/version/${versionId}/${item.path}`
      }

      context.root.$router.push({ path })
    }

    const handleHistory = () => {
      context.root.$router.push({
        name: 'workspace-project-package-history',
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

    const handleReplace = () => (isRaplace.value = !isRaplace.value)

    const handeBackToPackageRoot = () => {
      context.root.$router.push({
        name: 'workspace-project-package',
        params: { workspaceId, projectId, packageId }
      })
    }

    return {
      file: packageStore.file,
      fileSource: packageStore.fileSource,
      treeView,
      packageId,
      FileIcons,
      isRaplace,
      calcHeight,
      breadcrumbs,
      currentPath,
      isProcessing,
      handleReplace,
      handleHistory,
      handleDownload,
      handleClickOnRow,
      handeBackToPackageRoot
    }
  }
})
</script>
<style>
.replace-active {
  background-color: grey;
  color: white;
}
</style>
