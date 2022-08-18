<template>
  <ask-anna-loading-progress :loading="packageLoading && !isProcessing">
    <v-row align="center" justify="center">
      <v-col cols="12" class="pt-0 pb-0">
        <package-toolbar
          v-sticky="sticked"
          :sticky-z-index="1"
          :breadcrumbs="breadcrumbsComputed"
          sticky-offset="{top: 52, bottom: 10}"
        >
          <template v-slot:rigth>
            <v-slide-y-transition>
              <div v-if="!filePath && !$vuetify.breakpoint.xsOnly">
                <v-btn
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
              </div>
            </v-slide-y-transition>
          </template>
        </package-toolbar>
        <template v-if="isProcessing">
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
          <PackageTree
            v-else
            :items="treeView"
            :height="calcHeight"
            :getRoutePath="getRoutePath"
            noDataAvailable="This file or directory does not exist"
          />
        </template>
      </v-col>
    </v-row>
  </ask-anna-loading-progress>
</template>

<script setup lang="ts">
import { useWindowSize } from '@u3u/vue-hooks'
import useCopy from '@/core/composition/useCopy'
import { useFileStore } from '@/features/file/useFileStore'
import PackageFile from '@package/components/PackageFile.vue'
import PackageTree from '@package/components/PackageTree.vue'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useFileExtension from '@/core/composition/useFileExtension'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import useProjectStore from '@/features/project/composition/useProjectStore'
import usePackageStore from '@/features/package/composition/usePackageStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'
import PackageToolbar from '@/features/package/components/PackageToolbar.vue'
import usePackagesStore from '@/features/packages/composition/usePackagesStore'
import PackageProcessing from '@/features/package/components/PackageProcessing.vue'
import { ref, watch, onBeforeMount, onUnmounted, computed } from '@vue/composition-api'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

const copy = useCopy()
const ext = useFileExtension()
const fileStore = useFileStore()
const router = useRouterAskAnna()
const { height } = useWindowSize()
const jobRunStore = useJobRunStore()
const packageStore = usePackageStore()
const projectStore = useProjectStore()
const packagesStore = usePackagesStore()
const forceFileDownload = useForceFileDownload()
const breadcrumbs = usePackageBreadcrumbs({ start: 8, end: 9 })

const { workspaceId, projectId, jobId, jobRunId, folderName = '' } = router.route.value.params

const polling = ref(null)
const downloadPackage = ref(false)

const packageLoading = computed(() => packageStore.state.packageLoading.value)
const packageId = computed(() => jobRunStore.state.jobRun.value.package.short_uuid)

const cdnBaseUrl = computed(() => packageStore.packageData.value.cdn_base_url)
const images = computed(() => packageStore.packageData.value.files.filter(item => ext.images.includes(item.ext)))

const breadcrumbsComputed = computed(() => {
  const first = {
    title: `Package: #${packageId.value.slice(0, 4)}`,
    to: {
      name: 'workspace-project-code',
      params: { workspaceId, projectId, packageId: packageId.value }
    },
    exact: true,
    disabled: false,
    showTooltip: true,
    tooltip: `<span>${packageId.value}</span>`
  }

  return [first, ...breadcrumbs.value]
})

const sticked = computed(() => !projectStore.stickedVM.value)

const fetchData = async () => {
  fileStore.$reset()

  const { jobRunId } = router.route.value.params

  if (jobRunStore.state.jobRun.value.short_uuid !== jobRunId) {
    await jobRunStore.actions.resetStore()
    await jobRunStore.actions.getJobRun(jobRunId)
  }
  const packageId = jobRunStore.state.jobRun.value.package.short_uuid

  if (packageId === '') {
    return
  }

  await getPackage()
  if (isProcessing.value) {
    pollData()
  }
}

onBeforeMount(() => fetchData())

onUnmounted(() => {
  clearInterval(polling.value)
})

const getPackage = async () =>
  await packageStore.getPackage({
    projectId,
    folderName,
    packageId: jobRunStore.state.jobRun.value.package.short_uuid,
    failedRoute: 'workspace-project-jobs-job-jobrun-code-does-not-exist'
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
const path = computed(() => router.route.value.params.folderName || '/')
const isProcessing = computed(() => packageStore.state.processingList.value.find(item => item.packageId === packageId))

const currentPath = computed(() => {
  const pathArray = path.value.split('/')
  const fileName = pathArray.pop()
  const current = packageStore.state.packageData.value.files.find(
    item => item.name === fileName && item.path === path.value
  )

  return current
})

const filePath = computed(() =>
  currentPath.value && currentPath.value.type === 'file' && currentPath.value.name !== '' ? currentPath.value.path : ''
)
const parentPath = computed(() => {
  let parentPathTemp
  if (currentPath.value && currentPath.value.type === 'directory' && path.value !== '/') {
    parentPathTemp = packageStore.state.packageData.value.files.find(
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
  const tree = packageStore.state.packageData.value.files.filter(item => item.parent === path.value)

  return parentPath.value ? [parentPath.value, ...tree] : tree
})

const getRoutePath = item => {
  let path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${jobRunId}/code/${item.path}`

  if (typeof item.path === 'undefined') {
    path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${jobRunId}/code/`
  }

  return { path }
}

const handleDownload = async () => {
  downloadPackage.value = true

  const packageData = packageStore.state.packageData.value
  const source = await packagesStore.actions.downloadPackage({
    projectId,
    packageId: packageData.short_uuid
  })
  forceFileDownload.trigger({ source, name: `run_${jobRunId}_code_${packageData.filename}` })

  downloadPackage.value = false
}

// download full version of result without formating
const handleDownloadFile = async () => {
  await fileStore.getFullFile({
    url: `${packageStore.state.packageData.value.cdn_base_url}/${currentPath.value.path}`
  })

  forceFileDownload.trigger({
    source: fileStore.rawFile,
    name: currentPath.value.name
  })
}

const handleCopy = async (view: string) => {
  const fileSource = await fileStore.getFullFile({
    url: `${packageStore.state.packageData.value.cdn_base_url}/${currentPath.value.path}`
  })

  if (fileStore.isFileImg) {
    copy.handleCopyElementBySource(fileSource)

    return
  }

  copy.handleCopyText(fileStore.fileSourceForCopy(view))
}

watch(filePath, async filePath => {
  if (filePath === '') return

  fileStore.$reset()

  await fileStore.getFilePreview({
    size: currentPath.value.size,
    extension: currentPath.value.ext,
    url: `${packageStore.state.packageData.value.cdn_base_url}/${filePath}`
  })
})
</script>
<style>
.replace-active {
  background-color: grey;
  color: white;
}
</style>
