<template>
  <AskAnnaLoadingProgress :loading="loading && !isProcessing">
    <AskAnnaRow align="center" justify="center">
      <AskAnnaCol cols="12" class="pt-0 pb-0">
        <PackageToolbar
          v-sticky="sticked"
          :sticky-z-index="1"
          :breadcrumbs="breadcrumbsComputed"
          sticky-offset="{top: 52, bottom: 10}"
        >
          <template v-slot:rigth>
            <AskAnnaSlideYTransition>
              <div v-if="!filePath && !$vuetify.breakpoint.xsOnly">
                <AskAnnaButton
                  small
                  outlined
                  color="secondary"
                  class="mr-1 btn--hover"
                  :loading="downloadPackage"
                  @click="handleDownload()"
                >
                  <AskAnnaIcon color="secondary" left>mdi-download</AskAnnaIcon>Download
                  <template v-slot:loader>
                    <span>Downloading...</span>
                  </template>
                </AskAnnaButton>
              </div>
            </AskAnnaSlideYTransition>
          </template>
        </PackageToolbar>
        <template v-if="isProcessing">
          <PackageProcessing />
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
      </AskAnnaCol>
    </AskAnnaRow>
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
const copy = useCopy()
const runStore = useRunStore()
const ext = useFileExtension()
const fileStore = useFileStore()
const { route } = useRouterAskAnna()
const { height } = useWindowSize()
const packageStore = usePackageStore()
const projectStore = useProjectStore()
const forceFileDownload = useForceFileDownload()
const breadcrumbs = usePackageBreadcrumbs({ start: 8, end: 9 })

const { workspaceId, projectId, jobId, runId, folderName = '' } = route.params

const polling = ref(null)
const downloadPackage = ref(false)

const loading = computed(() => packageStore.loading)
const packageId = computed(() => runStore.run.package?.suuid)
const cdnBaseUrl = computed(() => packageStore.packageData?.cdn_base_url)
const images = computed(() => packageStore.packageData?.files?.filter(item => ext.images.includes(item.ext)))

const breadcrumbsComputed = computed(() => {
  const first = {
    title: `Package: #${packageId.value?.slice(0, 4)}`,
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

const sticked = computed(() => !projectStore.menu.sticked)

const fetchData = async () => {
  fileStore.$reset()

  if (!packageId.value) {
    return
  }

  await getPackage()
  if (isProcessing.value) {
    pollData()
  }
}

onUnmounted(() => {
  clearInterval(polling.value)
})

const getPackage = async () =>
  await packageStore.getPackage({
    folderName,
    packageId: runStore.run.package.suuid,
    failedRoute: 'workspace-project-jobs-job-run-code-does-not-exist'
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
const path = computed(() => route.params.folderName || '/')
const isProcessing = computed(() => packageStore.processingList.find(item => item.packageId === packageId))

const currentPath = computed(() => {
  const pathArray = path.value.split('/')
  const fileName = pathArray.pop()
  const current = packageStore.packageData.files.find(item => item.name === fileName && item.path === path.value)

  return current
})

const filePath = computed(() =>
  currentPath.value && currentPath.value.type === 'file' && currentPath.value.name !== '' ? currentPath.value.path : ''
)
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
  let path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${runId}/code/${item.path}`

  if (typeof item.path === 'undefined') {
    path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${runId}/code/`
  }

  return { path }
}

const handleDownload = async () => {
  downloadPackage.value = true

  const packageData = packageStore.packageData
  const source = await packageStore.downloadPackage(packageData.suuid)
  forceFileDownload.trigger({ source, name: `run_${runId}_code_${packageData.filename}` })

  downloadPackage.value = false
}

// download full version of result without formating
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

watch(
  packageId,
  async () => {
    await fetchData()
  },
  { immediate: true }
)

watch(filePath, async filePath => {
  if (filePath === '') return

  await fileStore.$reset()

  await fileStore.getFilePreview({
    size: currentPath.value.size,
    extension: currentPath.value.ext,
    url: `${packageStore.packageData.cdn_base_url}/${filePath}`
  })
})
</script>
<style>
.replace-active {
  background-color: grey;
  color: white;
}
</style>
