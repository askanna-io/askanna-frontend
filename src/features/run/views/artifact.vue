<template>
  <AskAnnaLoadingProgress :loading="runStore.runArtifactLoading" classes="mx-4 mb-4" fullWidth>
    <AskAnnaRow align="center" justify="center">
      <AskAnnaCol cols="12" class="pt-0 pb-0">
        <PackageToolbar
          v-if="artifactUuid"
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
                  :loading="downloadArtifact"
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
          :noDataAvailable="'There is no artifact available for this run.'"
        />
      </AskAnnaCol>
    </AskAnnaRow>
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
const copy = useCopy()
const ext = useFileExtension()
const runStore = useRunStore()
const fileStore = useFileStore()
const { height } = useWindowSize()
const { route } = useRouterAskAnna()
const projectStore = useProjectStore()
const forceFileDownload = useForceFileDownload()
const triggerFileDownload = useTriggerFileDownload()
const breadcrumbs = usePackageBreadcrumbs({ start: 8, end: 9 })

const { jobId, runId, projectId, workspaceId } = route.params

const downloadArtifact = ref(false)

const sticked = computed(() => !projectStore.menu.sticked)
const runArtifactLoading = computed(() => runStore.runArtifactLoading)

const cdnBaseUrl = computed(() => runStore.artifactData?.cdn_base_url)
const images = computed(() => runStore.artifactData?.files.filter(item => ext.images.includes(item.ext)))

const calcHeight = computed(() => height.value - 370)
const path = computed(() => route.params.folderName || '/')
const artifactUuid = computed(() => runStore.run?.artifact?.short_uuid)

const breadcrumbsComputed = computed(() => {
  const first = {
    title: `Artifact: #${artifactUuid.value.slice(0, 4)}`,
    to: {
      name: 'workspace-project-jobs-job-run-artifact',
      params: { workspaceId, projectId, jobId, runId }
    },
    exact: true,
    disabled: false,
    showTooltip: true,
    tooltip: `<span>${artifactUuid.value}</span>`
  }

  return [first, ...breadcrumbs.value]
})

const currentPath = computed(() => {
  const pathArray = path.value.split('/')
  const fileName = pathArray.pop()
  const current = runStore.artifactData?.files?.find(item => item.name === fileName && item.path === path.value)

  return current
})

const parentPath = computed(() => {
  let parentPathTemp

  if (currentPath.value && currentPath.value.type === 'directory' && path.value !== '/') {
    parentPathTemp = runStore.artifactData?.files.find(
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

const filePath = computed(() =>
  currentPath.value && currentPath.value.type === 'file' && currentPath.value.name !== '' ? currentPath.value.path : ''
)

const treeView = computed(() => {
  const tree = runStore.artifactData?.files?.filter(item => item.parent === path.value)

  return parentPath.value ? [parentPath.value, ...tree] : tree
})

const getRoutePath = item => {
  let path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${runId}/artifact/${item.path}`

  if (typeof item.path === 'undefined') {
    path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${runId}/artifact/`
  }

  return { path }
}

const handleDownload = async () => {
  downloadArtifact.value = true

  const artifactData = runStore.artifactData
  const url = await runStore.downloadPackage({
    runShortId: runId,
    artifactShortId: runStore.run.artifact?.short_uuid
  })

  triggerFileDownload.trigger({ url, name: artifactData.filename })

  downloadArtifact.value = false
}

// download full version of result without formating
const handleDownloadFile = async () => {
  await fileStore.getFullFile({
    url: `${runStore.artifactData?.cdn_base_url}/${currentPath.value.path}`
  })

  forceFileDownload.trigger({
    source: fileStore.rawFile,
    name: currentPath.value.name
  })
}

const handleCopy = async (view: string) => {
  const fileSource = await fileStore.getFullFile({
    url: `${runStore.artifactData?.cdn_base_url}/${currentPath.value.path}`
  })

  if (fileStore.isFileImg) {
    copy.handleCopyElementBySource(fileSource)

    return
  }

  copy.handleCopyText(fileStore.fileSourceForCopy(view))
}

const fetchData = async () => {
  fileStore.$reset()

  const { runId } = route.params

  if (runStore.run.short_uuid !== runId) {
    await runStore.resetStore()
    await runStore.getRun(runId)
  }

  if (!runId || !artifactUuid.value) {
    fileStore.loading = false

    return
  }

  await runStore.getInitialRunArtifact({
    uuid: {
      runShortId: runId,
      artifactShortId: artifactUuid.value
    }
  })
}

fetchData()

watch(filePath, async filePath => {
  if (!currentPath.value || (currentPath.value && currentPath.value.type === 'directory')) fileStore.$reset()

  if (filePath === '') return

  await fileStore.getFilePreview({
    size: currentPath.value.size,
    extension: currentPath.value.ext,
    url: `${runStore.artifactData?.cdn_base_url}/${filePath}`
  })
})
</script>
