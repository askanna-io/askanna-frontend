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
                  <span class="text-body-2" v-else>
                    Package #{{ packageId.slice(0, 4) }}{{ isLastPackage ? ' (latest)' : '' }}</span
                  >
                </div>
              </template>
              <span>{{ packageId }}</span>
              <br />
              <span>{{ createdDate }}</span>
            </v-tooltip>
          </template>
          <template v-slot:rigth>
            <v-slide-y-transition>
              <div v-if="!filePath">
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
            @onCloseOutside="handleCloseOutside"
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
import useMoment from '@/core/composition/useMoment'
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
    const moment = useMoment(context)
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
    const sticked = computed(() => !projectStore.stickedVM.value)
    const { useProjectPackageId = false } = context.root.$route.meta
    const packageLoading = computed(() => packageStore.packageLoading.value)
    const projectIdCd = computed(() => projectStore.project.value.short_uuid)
    const createdDate = computed(() =>
      moment.$moment(packageStore.packageData.value.created).format(' Do MMMM YYYY, h:mm:ss a')
    )
    const packageIdCd = computed(() => projectStore.project.value.package.short_uuid)
    const isLastPackage = computed(() => packageIdCd.value === packageStore.packageData.value.short_uuid)
    const { workspaceId, projectId, packageId: packageIdFromRoute = '', folderName = '' } = context.root.$route.params
    const packageId = computed(() => (useProjectPackageId ? packageIdCd.value : packageIdFromRoute))

    const getPackage = async (loading = true) => {
      if (!packageId.value || !projectId) return

      await packageStore.getPackage({
        loading,
        projectId,
        packageId: packageId.value,
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
    const isProcessing = computed(() =>
      packageStore.processingList.value.find(item => item.packageId === packageId.value)
    )

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
      let path = `/${workspaceId}/project/${projectId}/code/${packageId.value}/${item.path}`

      if (typeof item.path === 'undefined') {
        path = `/${workspaceId}/project/${projectId}/code/${packageId.value}`
      }

      return { path }
    }

    const handleHistory = () => {
      router.push({
        name: 'workspace-project-code-package-history',
        params: { projectId, packageId: packageId.value }
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
        name: 'workspace-project-code',
        params: { workspaceId, projectId, packageId: packageId.value }
      })
    }

    const handleCloseOutside = async () => {
      const project = await projectStore.getProject(context.root.$route.params.projectId)
      if (!project.package.short_uuid || !project.short_uuid) return

      await packageStore.getPackage({
        loading: true,
        projectId: project.short_uuid,
        packageId: project.package.short_uuid
      })
      isRaplace.value = false
    }

    // check if current package the same as in store
    watch(
      () => context.root.$route,
      async () => {
        if (useProjectPackageId) {
          isRaplace.value = false
          await getPackage()
        }
      }
    )

    const filePath = computed(() =>
      currentPath.value && !currentPath.value.is_dir && currentPath.value.name !== '' ? currentPath.value.path : ''
    )

    watchEffect(async () => {
      if (filePath.value === '') return
      packageStore.getFileSource(filePath.value)
    })

    onBeforeMount(async () => {
      await getPackage()
      if (isProcessing.value) {
        pollData()
      }
    })
    watch(projectIdCd, async () => getPackage())

    onUnmounted(() => {
      clearInterval(polling.value)
    })

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
      createdDate,
      breadcrumbs,
      currentPath,
      isProcessing,
      getRoutePath,
      isLastPackage,

      handleReplace,
      handleHistory,
      packageLoading,
      handleDownload,
      handleCloseOutside,
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
