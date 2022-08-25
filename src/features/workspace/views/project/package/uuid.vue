<template>
  <ask-anna-loading-progress :loading="loading">
    <v-row align="center" justify="center">
      <v-col cols="12" class="pt-0 pb-0">
        <PackageToolbar
          v-sticky="sticked"
          :sticky-z-index="1"
          :breadcrumbs="breadcrumbsComputed"
          sticky-offset="{top: 52, bottom: 10}"
        >
          <template v-slot:rigth>
            <v-slide-y-transition>
              <div v-if="!filePath" class="d-flex">
                <v-btn
                  v-if="!$vuetify.breakpoint.xsOnly"
                  small
                  outlined
                  color="secondary"
                  class="mr-1 btn--hover"
                  :loading="downloadPackage"
                  @click="handleDownload()"
                >
                  <v-icon color="secondary" left>mdi-download</v-icon>Download
                  <template v-slot:loader>
                    <span>Downloading...</span>
                  </template>
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
          <PackageFile
            v-if="filePath"
            :images="images"
            :sticked="sticked"
            :cdnBaseUrl="cdnBaseUrl"
            :file="fileStore.fileBlob"
            :currentPath="currentPath"
            :loading="fileStore.loading"
            :fileSource="fileStore.fileSource"
            @onCopy="handleCopy"
            @onDownload="handleDownloadFile"
          />
          <template v-else>
            <PackageTree
              v-if="!isProcessing"
              :items="treeView"
              :height="calcHeight"
              :getRoutePath="getRoutePath"
              noDataAvailable="This file or directory does not exist"
            />
          </template>
        </template>
      </v-col>
    </v-row>
  </ask-anna-loading-progress>
</template>

<script setup lang="ts">
import { useWindowSize } from '@/core/plugins/vue-hooks'
import useCopy from '@/core/composition/useCopy'
import useMoment from '@/core/composition/useMoment'
import { useFileStore } from '@/features/file/useFileStore'
import usePermission from '@/core/composition/usePermission'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useFileExtension from '@/core/composition/useFileExtension'
import { useProjectStore } from '@/features/project/useProjectStore'
import { usePackageStore } from '@/features/package/usePackageStore'
import { usePackagesStore } from '@/features/packages/usePackagesStore'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'
import { ref, watch, onBeforeMount, onUnmounted, computed } from '@vue/composition-api'

import PackageFile from '@/features/package/components/PackageFile.vue'
import PackageTree from '@/features/package/components/PackageTree.vue'
import PackageToolbar from '@/features/package/components/PackageToolbar.vue'
import PackageProcessing from '@/features/package/components/PackageProcessing.vue'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'
import ResumableUpload from '@/features/package/components/resumable-upload/ResumableUpload.vue'

const copy = useCopy()
const moment = useMoment()
const ext = useFileExtension()
const fileStore = useFileStore()
const router = useRouterAskAnna()
const permission = usePermission()
const { height } = useWindowSize()
const packageStore = usePackageStore()
const projectStore = useProjectStore()

const packagesStore = usePackagesStore()
const breadcrumbs = usePackageBreadcrumbs()
const forceFileDownload = useForceFileDownload()

const menu = ref(false)
const polling = ref(null)
const isRaplace = ref(false)

const params = computed(() => router.route.value.params)

const projectCodeCreate = computed(() => permission.getFor(permission.labels.projectCodeCreate))

const sticked = computed(() => !projectStore.menu.sticked)
const { useProjectPackageId = false } = router.route.value.meta

const projectIdCd = computed(() => projectStore.project.short_uuid)
const packageIdCd = computed(() => projectStore.project.package.short_uuid)
const createdDate = computed(() => moment.$moment(packageStore.packageData.created).format(' Do MMMM YYYY, h:mm:ss a'))
const isLastPackage = computed(() => packageIdCd.value === packageStore.packageData.short_uuid)
const packageId = computed(() => (useProjectPackageId ? packageIdCd.value : params.value.packageId))
const cdnBaseUrl = computed(() => packageStore.packageData.cdn_base_url)
const images = computed(() => packageStore.packageData.files.filter(item => ext.images.includes(item.ext)))

const breadcrumbsComputed = computed(() => {
  const first = {
    title: `Package: #${packageId.value.slice(0, 4)}${isLastPackage.value ? '(latest)   ' : ''}`,
    to: {
      name: 'workspace-project-code',
      params: { workspaceId: params.value.workspaceId, projectId: params.value.projectId, packageId: packageId.value }
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

const downloadPackage = ref(false)

const getPackage = async (loading = true) => {
  if (!packageId.value || !params.value.projectId) return

  await packageStore.getPackage({
    loading,
    packageId: packageId.value,
    projectId: params.value.projectId,
    folderName: params.value.folderName
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
  let a = router.route.value.params.folderName || '/'
  return a
})
const isProcessing = computed(() => packageStore.processingList.find(item => item.packageId === packageId.value))

const currentPath = computed(() => {
  const pathArray = path.value.split('/')
  const fileName = pathArray.pop()
  const current = packageStore.packageData.files.find(item => item.name === fileName && item.path === path.value)

  return current
})

const parentPath = computed(() => {
  let parentPathTemp
  if (currentPath.value && currentPath.value.type === 'directory' && path.value !== '/') {
    parentPathTemp = packageStore.packageData.files.find(
      file => file.name === currentPath.value.parent && file.type === 'directory'
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
  const tree = packageStore.packageData.files.filter(item => item.parent === path.value)

  return parentPath.value ? [parentPath.value, ...tree] : tree
})

const getRoutePath = item => {
  let path = `/${params.value.workspaceId}/project/${params.value.projectId}/code/${packageId.value}/${item.path}`

  if (typeof item.path === 'undefined') {
    path = `/${params.value.workspaceId}/project/${params.value.projectId}/code/${packageId.value}`
  }

  return { path }
}

const handleHistory = () => {
  router.push({
    name: 'workspace-project-code-package-history',
    params: { projectId: params.value.projectId, packageId: packageId.value }
  })
}

const handleDownload = async () => {
  downloadPackage.value = true

  const packageData = packageStore.packageData
  const source = await packagesStore.downloadPackage({
    projectId: params.value.projectId,
    packageId: packageData.short_uuid
  })
  forceFileDownload.trigger({ source, name: `code_${packageData.short_uuid}_${packageData.filename}` })

  downloadPackage.value = false
}

const handleReplace = () => (isRaplace.value = !isRaplace.value)

const handleCloseOutside = async () => {
  await projectStore.getProjectMe(router.route.value.params.projectId)
  const project = await projectStore.getProject(router.route.value.params.projectId)
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
  () => router.route,
  async () => {
    if (useProjectPackageId) {
      isRaplace.value = false
      await getPackage()
    }
  }
)

const loading = computed(() => packageStore.loading)
const filePath = computed(() =>
  currentPath.value && currentPath.value.type === 'file' && currentPath.value.name !== '' ? currentPath.value.path : ''
)

const handleDownloadFile = async () => {
  await fileStore.getFullFile({
    url: `${packageStore.packageData.cdn_base_url}/${currentPath.value.path}`
  })

  forceFileDownload.trigger({
    source: fileStore.rawFile,
    name: currentPath.value.name
  })
}

const handleCopy = async (view: string) => {
  const fileSource = await fileStore.getFullFile({
    url: `${packageStore.packageData.cdn_base_url}/${currentPath.value.path}`
  })

  if (fileStore.isFileImg) {
    copy.handleCopyElementBySource(fileSource)

    return
  }

  copy.handleCopyText(fileStore.fileSourceForCopy(view))
}

const fetchData = async () => {
  fileStore.$reset()

  await getPackage()
  if (isProcessing.value) {
    pollData()
  }
}

onBeforeMount(() => fetchData())

watch(projectIdCd, async () => !loading.value && getPackage())

onUnmounted(() => {
  clearInterval(polling.value)
})

watch(currentPath, async currentPath => {
  if (!filePath.value) return
  fileStore.$reset()

  await fileStore.getFilePreview({
    size: currentPath.size,
    extension: currentPath.ext,
    url: `${packageStore.packageData.cdn_base_url}/${filePath.value}`
  })
})
</script>
<style>
.replace-active {
  background-color: grey;
  color: white;
}
</style>
