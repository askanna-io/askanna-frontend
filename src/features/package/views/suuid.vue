<template>
  <AskAnnaLoadingProgress :loading="loading">
    <AskAnnaRow align="center" justify="center">
      <AskAnnaCol cols="12" class="pt-0 pb-0">
        <PackageToolbar :breadcrumbs="breadcrumbsComputed" sticky-offset="{top: 52, bottom: 10}">
          <template v-slot:rigth>
            <AskAnnaSlideYTransition>
              <div v-if="!filePath" class="d-flex">
                <AskAnnaButton
                  v-if="!$vuetify.breakpoint.xsOnly"
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
                <AskAnnaButton
                  v-if="projectCodeCreate && !$vuetify.breakpoint.xsOnly"
                  small
                  outlined
                  :class="{ 'replace-active': isRaplace }"
                  color="secondary"
                  class="mr-1 btn--hover"
                  @click="handleReplace()"
                >
                  <AskAnnaIcon color="secondary" left>mdi-folder-move</AskAnnaIcon>Replace
                </AskAnnaButton>

                <AskAnnaButton
                  v-if="!$vuetify.breakpoint.xsOnly"
                  small
                  outlined
                  color="secondary"
                  class="btn--hover"
                  @click="handleHistory()"
                >
                  <AskAnnaIcon color="secondary" left>mdi-history</AskAnnaIcon>History
                </AskAnnaButton>
                <VMenu
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
                    <AskAnnaButton icon v-bind="attrs" @click.stop.prevent="on.click" small>
                      <AskAnnaIcon>mdi-dots-vertical</AskAnnaIcon>
                    </AskAnnaButton>
                  </template>
                  <VList dense>
                    <VListItem dense @click="handleHistory()">
                      <VListItemTitle>History</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </div>
            </AskAnnaSlideYTransition>
          </template>
        </PackageToolbar>
        <VExpandTransition>
          <ResumableUpload
            v-if="isRaplace"
            isReplace
            @cancelUpload="handleReplace"
            @onCloseOutside="handleCloseOutside"
            class="py-2 px-4"
            :id="packageId"
          />
        </VExpandTransition>
        <template v-if="isProcessing && !isRaplace">
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
      </AskAnnaCol>
    </AskAnnaRow>
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
const copy = useCopy()
const moment = useDayjs()
const ext = useFileExtension()
const fileStore = useFileStore()
const permission = usePermission()
const { height } = useWindowSize()
const packageStore = usePackageStore()
const projectStore = useProjectStore()
const breadcrumbs = usePackageBreadcrumbs()
const { route, routerPush } = useRouterAskAnna()
const forceFileDownload = useForceFileDownload()

const { useProjectPackageId = false } = route.meta

const menu = ref(false)
const polling = ref(null)
const isRaplace = ref(false)

const params = computed(() => route.params)
const sticked = computed(() => !projectStore.menu.sticked)
const packageIdCd = computed(() => projectStore.project.package.suuid)
const projectCodeCreate = computed(() => permission.getFor(permission.labels.projectCodeCreate))

const cdnBaseUrl = computed(() => packageStore.packageData.cdn_base_url)
const isLastPackage = computed(() => packageIdCd.value === packageStore.packageData.suuid)
const packageId = computed(() => (useProjectPackageId ? packageIdCd.value : params.value.packageId))
const images = computed(() => packageStore.packageData.files.filter(item => ext.images.includes(item.ext)))
const createdDate = computed(() => moment.dayjs(packageStore.packageData.created).format('Do MMMM YYYY, h:mm:ss a'))

const breadcrumbsComputed = computed(() => {
  const first = {
    title: `Package: #${packageId.value?.slice(0, 4)}${isLastPackage.value ? '(latest)   ' : ''}`,
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
  if (!packageId.value) return

  await packageStore.getPackage({
    loading,
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

const handleHistory = () => {
  routerPush({
    name: 'workspace-project-code-package-history',
    params: { projectId: params.value.projectId, packageId: packageId.value }
  })
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

  await getPackage()
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

// check if current package the same as in store
watch(
  () => route,
  async () => {
    if (useProjectPackageId) {
      isRaplace.value = false
      await getPackage()
    }
  }
)
</script>
<style>
.replace-active {
  background-color: grey;
  color: white;
}
</style>
