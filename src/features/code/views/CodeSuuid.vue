<template>
  <AskAnnaLoadingProgress :loading="loading">
    <div>
      <AskAnnaDivider />
      <CodeToolbar :breadcrumbs="breadcrumbsComputed">
        <template v-slot:rigth>
          <AskAnnaSlideYTransition>
            <div
              v-if="!filePath"
              class="flex gap-1"
            >
              <AskAnnaButton
                v-if="!$vuetify.display.xs"
                prependIcon="mdi-download"
                :loading="downloadPackage"
                @click="handleDownload()"
              >
                Download
              </AskAnnaButton>
              <AskAnnaButton
                v-if="projectCodeCreate && !$vuetify.display.xs"
                prependIcon="mdi-folder-move"
                :class="{ 'bg-gray-100': isRaplace }"
                :color="isRaplace ? 'primary' : 'secondary'"
                :colorIcon="isRaplace ? 'primary' : 'secondary'"
                @click="handleReplace()"
              >
                Replace
              </AskAnnaButton>
              <AskAnnaButton
                v-if="!$vuetify.display.xs"
                prependIcon="mdi-history"
                :to="{
                  name: 'workspace-project-code-history',
                  params: { workspaceId: params.workspaceId, projectId: params.projectId }
                }"
              >
                History
              </AskAnnaButton>
              <VMenu
                v-if="$vuetify.display.xs"
                v-model="menu"
                transition="slide-y-transition"
              >
                <template v-slot:activator="{ props }">
                  <AskAnnaButton
                    v-bind="props"
                    variant="text"
                    icon="mdi-dots-vertical"
                  />
                </template>
                <VList
                  color="primary"
                  class="p-0 mt-2"
                  select-strategy="classic"
                >
                  <VListItem
                    title="History"
                    :to="{
                      name: 'workspace-project-code-history',
                      params: { workspaceId: params.workspaceId, projectId: params.projectId }
                    }"
                  />
                </VList>
              </VMenu>
            </div>
          </AskAnnaSlideYTransition>
        </template>
      </CodeToolbar>
      <AskAnnaDivider />
      <VExpandTransition>
        <CodeUpload
          v-if="isRaplace"
          isReplace
          :id="packageId"
          class="py-2 px-4"
          @cancelUpload="handleReplace"
          @onCloseOutside="handleCloseOutside"
        />
      </VExpandTransition>
      <template v-if="isProcessing && !isRaplace">
        <CodeProcessing />
      </template>
      <template v-else>
        <CodeFile
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
          <CodeTree
            v-if="!isProcessing"
            :items="treeView"
            :height="calcHeight"
            :getRoutePath="getRoutePath"
            noDataAvailable="This file or directory does not exist"
          />
        </template>
      </template>
    </div>
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
const copy = useCopy()
const dayjs = useDayjs()
const ext = useFileExtension()
const fileStore = useFileStore()
const { route } = useRouterAskAnna()
const packageStore = usePackageStore()
const projectStore = useProjectStore()
const { height } = useAskAnnaWindowSize()
const permission = useAskAnnaPermission()
const breadcrumbs = usePackageBreadcrumbs()
const forceFileDownload = useForceFileDownload()

const menu = ref(false)
const polling = ref(null)
const isRaplace = ref(false)

const params = computed(() => route.params)
const sticked = computed(() => !projectStore.menu.sticked)
const packageIdCd = computed(() => projectStore.project.package.suuid)
const projectCodeCreate = computed(() => permission.getFor(permission.labels.projectCodeCreate))

const cdnBaseUrl = computed(() => packageStore.packageData.cdn_base_url)
const isLastPackage = computed(() => packageIdCd.value === packageStore.packageData.suuid)
const packageId = computed(() => params.value.packageId || packageStore.packageData.suuid || packageIdCd.value)
const images = computed(() => packageStore.packageData.files.filter(item => ext.images.includes(item.ext)))
const createdDate = computed(() => dayjs.dayjs(packageStore.packageData.created_at).format('Do MMMM YYYY, h:mm:ss a'))

const breadcrumbsComputed = computed(() => {
  const first = {
    title: `Package: #${packageId.value?.slice(0, 4)}${isLastPackage.value ? '(latest)   ' : ''}`,
    to: {
      name: 'workspace-project-code',
      params: { workspaceId: params.value.workspaceId, projectId: params.value.projectId }
    },
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
    routeParams: params.value,
    packageId: packageId.value,
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
  let a = route.params.folderName || '/'
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

const handleDownload = async () => {
  downloadPackage.value = true

  const packageData = packageStore.packageData
  const source = await packageStore.downloadPackage(packageData.suuid)
  forceFileDownload.trigger({ source, name: `code_${packageData.suuid}_${packageData.filename}` })

  downloadPackage.value = false
}

const handleReplace = () => (isRaplace.value = !isRaplace.value)

const handleCloseOutside = async () => {
  await projectStore.getProjectMe(route.params.projectId)
  const project = await projectStore.getProject(route.params.projectId)
  if (!project.package.suuid) return

  await packageStore.getPackage({
    loading: true,
    packageId: project.package.suuid
  })
  isRaplace.value = false
}

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
  await fileStore.$reset()

  if (isProcessing.value) {
    pollData()
  }
}

onBeforeMount(() => fetchData())

onUnmounted(() => {
  clearInterval(polling.value)
})

watch(currentPath, async currentPath => {
  if (!filePath.value) return
  await fileStore.$reset()

  await fileStore.getFilePreview({
    size: currentPath.size,
    extension: currentPath.ext,
    url: `${packageStore.packageData.cdn_base_url}/${filePath.value}`
  })
})
</script>