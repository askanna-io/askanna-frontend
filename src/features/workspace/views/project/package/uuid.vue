<template>
  <ask-anna-loading-progress :loading="packageLoading">
    <v-row align="center" justify="center">
      <v-col cols="12" class="pt-0 pb-0">
        <PackageToolbar :breadcrumbs="breadcrumbsComputed" v-sticky="sticked" sticky-offset="{top: 52, bottom: 10}">
          <template v-slot:rigth>
            <v-slide-y-transition>
              <div v-if="!filePath" class="d-flex">
                <v-btn
                  v-if="!$vuetify.breakpoint.xsOnly"
                  small
                  outlined
                  color="secondary"
                  class="mr-1 btn--hover"
                  @click="handleDownload()"
                >
                  <v-icon color="secondary" left>mdi-download</v-icon>Download
                </v-btn>
                <v-btn
                  v-if="projectCodeCreate && !$vuetify.breakpoint.xsOnly"
                  small
                  outlined
                  :class="{ 'replace-active': isRaplace }"
                  color="secondary"
                  class="mr-1 btn--hover"
                  @click="handleReplace()"
                >
                  <v-icon color="secondary" left>mdi-folder-move</v-icon>Replace
                </v-btn>

                <v-btn
                  v-if="!$vuetify.breakpoint.xsOnly"
                  small
                  outlined
                  color="secondary"
                  class="btn--hover"
                  @click="handleHistory()"
                >
                  <v-icon color="secondary" left>mdi-history</v-icon>History
                </v-btn>
                <v-menu
                  v-if="$vuetify.breakpoint.xsOnly"
                  v-model="menu"
                  nudge-left="10"
                  nudge-bottom="30"
                  rounded
                  :close-on-content-click="false"
                  bottom
                  left
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" @click.stop.prevent="on.click" small>
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item dense @click="handleHistory()">
                      <v-list-item-title>History</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-slide-y-transition>
          </template>
        </PackageToolbar>
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
            <PackageTree v-if="!isProcessing" :items="treeView" :height="calcHeight" :getRoutePath="getRoutePath" />
          </template>
        </template>
      </v-col>
    </v-row>
  </ask-anna-loading-progress>
</template>

<script lang="ts">
import { useWindowSize } from '@u3u/vue-hooks'
import useMoment from '@/core/composition/useMoment'
import { defineComponent } from '@vue/composition-api'
import { FileIcons } from '@/features/package/utils/index'
import usePermission from '@/core/composition/usePermission'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import PackageFile from '@/features/package/components/PackageFile.vue'
import PackageTree from '@/features/package/components/PackageTree.vue'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import useProjectStore from '@/features/project/composition/useProjectStore'
import usePackageStore from '@/features/package/composition/usePackageStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'
import PackageToolbar from '@/features/package/components/PackageToolbar.vue'
import usePackagesStore from '@/features/packages/composition/usePackagesStore'
import { ref, watch, onBeforeMount, onUnmounted, computed } from '@vue/composition-api'

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
    const permission = usePermission()
    const { height } = useWindowSize()
    const packageStore = usePackageStore()
    const projectStore = useProjectStore()
    const router = useRouterAskAnna()

    const packagesStore = usePackagesStore(context)
    const forceFileDownload = useForceFileDownload()
    const breadcrumbs = usePackageBreadcrumbs(context)

    const menu = ref(false)
    const polling = ref(null)
    const isRaplace = ref(false)

    const projectCodeCreate = computed(() => permission.getFor(permission.labels.projectCodeCreate))

    const file = computed(() => packageStore.file.value)
    const sticked = computed(() => !projectStore.stickedVM.value)
    const { useProjectPackageId = false } = context.root.$route.meta
    const projectIdCd = computed(() => projectStore.project.value.short_uuid)
    const createdDate = computed(() =>
      moment.$moment(packageStore.packageData.value.created).format(' Do MMMM YYYY, h:mm:ss a')
    )
    const packageIdCd = computed(() => projectStore.project.value.package.short_uuid)
    const isLastPackage = computed(() => packageIdCd.value === packageStore.packageData.value.short_uuid)
    const { workspaceId, projectId, packageId: packageIdFromRoute = '', folderName = '' } = context.root.$route.params
    const packageId = computed(() => (useProjectPackageId ? packageIdCd.value : packageIdFromRoute))

    const breadcrumbsComputed = computed(() => {
      const first = {
        title: `Package: #${packageId.value.slice(0, 4)}${isLastPackage.value ? '(latest)   ' : ''}`,
        to: {
          name: 'workspace-project-code',
          params: { workspaceId, projectId, packageId: packageId.value }
        },
        exact: true,
        disabled: false,
        showTooltip: true,
        tooltip: `
          <span>${packageId.value}</span>
          <br />
          <span>${createdDate.value}</span>
        `
      }

      return [first, ...breadcrumbs.value]
    })

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
        projectId,
        packageId: packageData.short_uuid
      })
      forceFileDownload.trigger({ source, name: `code_${packageData.short_uuid}_${packageData.filename}` })
    }

    const handleReplace = () => (isRaplace.value = !isRaplace.value)

    const handeBackToPackageRoot = () => {
      router.push({
        name: 'workspace-project-code',
        params: { workspaceId, projectId, packageId: packageId.value }
      })
    }

    const handleCloseOutside = async () => {
      await projectStore.getProjectMe(context.root.$route.params.projectId)
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

    const packageLoading = computed(() => packageStore.packageLoading.value)

    const filePath = computed(() =>
      currentPath.value && !currentPath.value.is_dir && currentPath.value.name !== '' ? currentPath.value.path : ''
    )

    const fetchData = async () => {
      await getPackage()
      if (isProcessing.value) {
        pollData()
      }
    }

    onBeforeMount(() => fetchData())

    watch(projectIdCd, async () => !packageLoading.value && getPackage())

    onUnmounted(() => {
      clearInterval(polling.value)
    })

    watch(currentPath, async currentPath => {
      packageStore.resetFile()
      if (!filePath.value) return
      packageStore.getFileSource(filePath.value)
    })

    return {
      file,
      menu,
      sticked,
      filePath,
      fileSource: packageStore.fileSource,
      treeView,
      packageId,
      FileIcons,
      isRaplace,
      calcHeight,
      createdDate,
      currentPath,
      isProcessing,
      getRoutePath,
      isLastPackage,
      projectCodeCreate,
      breadcrumbsComputed,

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
