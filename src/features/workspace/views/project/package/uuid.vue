<template>
  <ask-anna-loading-progress :loading="packageLoading">
    <v-row align="center" justify="center">
      <v-col cols="12" class="pt-0 pb-0">
        <package-toolbar :breadcrumbs="breadcrumbs" v-sticky="sticked" sticky-offset="{top: 52, bottom: 10}">
          <template v-slot:left>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <a v-if="currentPath" @click="handeBackToPackageRoot" class="text-body-2"
                    >Package #{{ packageId.slice(0, 4) }}<v-icon small>mdi-chevron-right</v-icon></a
                  >
                  <span class="text-body-2" v-else> Package #{{ packageId.slice(0, 4) }}</span>
                </div>
              </template>
              <span>{{ packageId }}</span>
            </v-tooltip>
          </template>
          <template v-slot:rigth>
            <v-slide-y-transition>
              <div v-if="!file">
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
                  <v-icon color="secondary" left>mdi-history</v-icon>History
                </v-btn>
              </div>
            </v-slide-y-transition>
          </template>
        </package-toolbar>
        <v-expand-transition>
          <resumable-upload
            v-if="isRaplace"
            isReplace
            @cancelUpload="handleReplace"
            class="py-2 px-4"
            :id="packageId"
          />
        </v-expand-transition>
        <template v-if="isProcessing && !isRaplace">
          <package-processing />
        </template>
        <template v-else>
          <package-file
            v-if="filePath"
            :file="file"
            :sticked="sticked"
            :fileSource="fileSource"
            :currentPath="currentPath"
          />
          <template v-else>
            <package-tree v-if="!isProcessing" :items="treeView" :height="calcHeight" :getRoutePath="getRoutePath" />
          </template>
        </template>
      </v-col>
    </v-row>
  </ask-anna-loading-progress>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import { FileIcons } from '@package/utils/index'
import { defineComponent } from '@vue/composition-api'
import PackageFile from '@package/components/PackageFile'
import PackageTree from '@package/components/PackageTree'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useProjectStore from '@project/composition/useProjectStore'
import PackageToolbar from '@/features/package/components/PackageToolbar'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import usePackageStore from '@/features/package/composition/usePackageStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'
import usePackagesStore from '@/features/packages/composition/usePackagesStore'
import { ref, watch, watchEffect, onBeforeMount, onUnmounted, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'PackageUuid',

  components: {
    PackageFile,
    PackageTree,
    PackageToolbar,
    PackageProcessing: () => import('@/features/package/components/PackageProcessing.vue'),
    ResumableUpload: () => import('@/features/package/components/resumable-upload/ResumableUpload.vue')
  },

  setup(_, context) {
    const { height } = useWindowSize()
    const packageStore = usePackageStore()
    const projectStore = useProjectStore()
    const router = useRouterAskAnna(context)

    const packagesStore = usePackagesStore(context)
    const forceFileDownload = useForceFileDownload()
    const breadcrumbs = usePackageBreadcrumbs(context)

    const polling = ref(null)
    const isRaplace = ref(false)
    const file = computed(() => packageStore.file.value)
    const { workspaceId, projectId, packageId = 'new-package', folderName = '' } = context.root.$route.params

    const sticked = computed(() => !projectStore.stickedVM.value)

    onBeforeMount(async () => {
      if (packageId === 'new-package') {
        router.push({
          name: 'workspace-project-package-new',
          params: { ...context.root.$route.params }
        })
        return
      }
      await getPackage()
      if (isProcessing.value) {
        pollData()
      }
    })

    onUnmounted(() => {
      clearInterval(polling.value)
    })

    const getPackage = async (loading = true) => {
      const { projectId, packageId = 'new-package', folderName = '' } = context.root.$route.params

      await packageStore.getPackage({
        loading,
        projectId,
        packageId,
        folderName
      })
    }

    const pollData = () => {
      polling.value = setInterval(async () => {
        await getPackage(false)
        checkProcessing()
      }, 10000)
    }

    const checkProcessing = () => {
      if (!isProcessing.value) {
        clearInterval(polling.value)
      }
    }

    const calcHeight = computed(() => height.value - 370)
    const path = computed(() => {
      let a = context.root.$route.params.folderName || '/'
      return a
    })
    const isProcessing = computed(() => packageStore.processingList.value.find(item => item.packageId === packageId))

    const currentPath = computed(() => {
      const pathArray = path.value.split('/')
      const fileName = pathArray.pop()
      const current = packageStore.packageData.value.files.find(
        item => item.name === fileName && item.path === path.value
      )

      return current
    })

    const parentPath = computed(() => {
      let parentPathTemp
      if (currentPath.value && currentPath.value.is_dir && path.value !== '/') {
        parentPathTemp = packageStore.packageData.value.files.find(
          file => file.name === currentPath.value.parent && file.is_dir
        )
        parentPathTemp = {
          ...parentPathTemp,
          name: '...',
          ext: 'parent'
        }
      }

      return parentPathTemp
    })

    const treeView = computed(() => {
      const tree = packageStore.packageData.value.files.filter(item => item.parent === path.value)

      return parentPath.value ? [parentPath.value, ...tree] : tree
    })

    const getRoutePath = item => {
      let path = `/${workspaceId}/project/${projectId}/code/${packageId}/${item.path}`

      if (typeof item.path === 'undefined') {
        path = `/${workspaceId}/project/${projectId}/code/${packageId}`
      }

      return { path }
    }

    const handleHistory = () => {
      router.push({
        name: 'workspace-project-code-package-history',
        params: { projectId, packageId }
      })
    }

    const handleDownload = async () => {
      const packageData = packageStore.packageData.value
      const source = await packagesStore.downloadPackage({
        projectId: packageData.project,
        packageId: packageData.short_uuid
      })
      forceFileDownload.trigger({ source, name: packageData.filename })
    }

    const handleReplace = () => (isRaplace.value = !isRaplace.value)

    const handeBackToPackageRoot = () => {
      router.push({
        name: 'workspace-project-package',
        params: { workspaceId, projectId, packageId }
      })
    }

    // check if current package the same as in store
    watch(
      () => context.root.$route,
      async () => {
        const { packageId } = context.root.$route.params
        if (packageId !== packageStore.packageData.value.short_uuid) {
          isRaplace.value = false
          await getPackage()
        }
      }
    )

    const filePath = computed(() =>
      currentPath.value && !currentPath.value.is_dir && currentPath.value.name !== '' ? currentPath.value.path : ''
    )

    watchEffect(async () => {
      packageStore.resetFile()

      if (filePath.value === '') return
      packageStore.getFileSource(filePath.value)
    })

    const packageLoading = computed(() => packageStore.packageLoading.value)

    return {
      file,
      sticked,
      filePath,
      fileSource: packageStore.fileSource,
      treeView,
      packageId,
      FileIcons,
      isRaplace,
      calcHeight,
      breadcrumbs,
      currentPath,
      isProcessing,
      getRoutePath,
      handleReplace,
      handleHistory,
      packageLoading,
      handleDownload,
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
