<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <package-toolbar :breadcrumbs="breadcrumbs">
        <template v-slot:left>
          <span class="text-body-2">New Package</span>
        </template>
      </package-toolbar>
      <v-expand-transition>
        <resumable-upload @cancelUpload="handleReplace" class="py-2 px-4" :id="packageId" />
      </v-expand-transition>
      <template v-if="isProcessing">
        <package-processing />
      </template>
    </v-col>
  </v-row>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import { defineComponent } from '@vue/composition-api'
import { headers, FileIcons } from '@package/utils/index'
import usePackages from '@packages/composition/usePackages'
import PackageToolbar from '@/features/package/components/PackageToolbar'
import { ref, watch, onBeforeMount, onUnmounted, computed } from '@vue/composition-api'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import usePackageStore from '@/features/package/composition/usePackageStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'

export default defineComponent({
  name: 'NewPackage',

  components: {
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
    const { workspaceId, projectId, packageId = 'new-package', folderName = '' } = context.root.$route.params

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

    const handleClickOnRow = async item => {
      let path = `/${workspaceId}/project/${projectId}/code/${packageId}/${folderName}/${item.name}`
      if (item.parent === '/') {
        path = `/${workspaceId}/project/${projectId}/code/${packageId}/${item.name}`
      }

      if (typeof item.path === 'undefined') {
        path = `/${workspaceId}/project/${projectId}/code/${packageId}`
      }

      if (item.is_dir) {
        path = `/${workspaceId}/project/${projectId}/code/${packageId}/${item.path}`
      }

      context.root.$router.push({ path })
    }

    const handleReplace = () => (isRaplace.value = !isRaplace.value)

    const handeBackToPackageRoot = () => {
      context.root.$router.push({
        name: 'workspace-project-package',
        params: { workspaceId, projectId, packageId }
      })
    }

    return {
      packageId,
      calcHeight,
      breadcrumbs,
      isProcessing,
      handleReplace,
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
