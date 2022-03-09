<template>
  <ask-anna-loading-progress :loading="jobRunArtifactLoading" classes="mx-4 mb-4" fullWidth>
    <v-row align="center" justify="center">
      <v-col cols="12" class="pt-0 pb-0">
        <package-toolbar
          v-if="artifactUuid"
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
                  :loading="downloadArtifact"
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
      </v-col>
    </v-row>
  </ask-anna-loading-progress>
</template>
<script setup lang="ts">
import { useWindowSize } from '@u3u/vue-hooks'
import useCopy from '@/core/composition/useCopy'
import { useFileStore } from '@/features/file/useFileStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useFileExtension from '@/core/composition/useFileExtension'
import PackageFile from '@/features/package/components/PackageFile.vue'
import PackageTree from '@/features/package/components/PackageTree.vue'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import { ref, watch, onBeforeMount, computed } from '@vue/composition-api'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import useProjectStore from '@/features/project/composition/useProjectStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'
import PackageToolbar from '@/features/package/components/PackageToolbar.vue'
import useTriggerFileDownload from '@/core/composition/useTriggerFileDownload'

const copy = useCopy()
const ext = useFileExtension()
const fileStore = useFileStore()
const router = useRouterAskAnna()
const { height } = useWindowSize()
const jobRunStore = useJobRunStore()
const projectStore = useProjectStore()
const forceFileDownload = useForceFileDownload()
const triggerFileDownload = useTriggerFileDownload()
const breadcrumbs = usePackageBreadcrumbs({ start: 8, end: 9 })

const { jobId, jobRunId, projectId, workspaceId } = router.route.value.params

const downloadArtifact = ref(false)

const sticked = computed(() => !projectStore.stickedVM.value)

const jobRunArtifactLoading = computed(() => jobRunStore.state.jobRunArtifactLoading.value)

const cdnBaseUrl = computed(() => jobRunStore.state.artifactData.value.cdn_base_url)
const images = computed(() => jobRunStore.state.artifactData.value.files.filter(item => ext.images.includes(item.ext)))

const calcHeight = computed(() => height.value - 370)
const path = computed(() => router.route.value.params.folderName || '/')
const artifactUuid = computed(() => jobRunStore.state.jobRun.value.artifact.short_uuid)

const breadcrumbsComputed = computed(() => {
  const first = {
    title: `Artifact: #${artifactUuid.value.slice(0, 4)}`,
    to: {
      name: 'workspace-project-jobs-job-jobrun-artifact',
      params: { workspaceId, projectId, jobId, jobRunId }
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
  const current = jobRunStore.state.artifactData.value.files.find(
    item => item.name === fileName && item.path === path.value
  )

  return current
})

const parentPath = computed(() => {
  let parentPathTemp
  if (currentPath.value && currentPath.value.is_dir && path.value !== '/') {
    parentPathTemp = jobRunStore.state.artifactData.value.files.find(
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

const filePath = computed(() =>
  currentPath.value && !currentPath.value.is_dir && currentPath.value.name !== '' ? currentPath.value.path : ''
)

const treeView = computed(() => {
  const tree = jobRunStore.state.artifactData.value.files.filter(item => item.parent === path.value)

  return parentPath.value ? [parentPath.value, ...tree] : tree
})

const getRoutePath = item => {
  let path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${jobRunId}/artifact/${item.path}`

  if (typeof item.path === 'undefined') {
    path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${jobRunId}/artifact/`
  }

  return { path }
}

const handleDownload = async () => {
  downloadArtifact.value = true

  const artifactData = jobRunStore.state.artifactData.value
  const url = await jobRunStore.actions.downloadPackage({
    jobRunShortId: jobRunId,
    artifactShortId: jobRunStore.state.jobRun.value.artifact.short_uuid
  })

  triggerFileDownload.trigger({ url, name: artifactData.filename })

  downloadArtifact.value = false
}

// download full version of result without formating
const handleDownloadFile = async () => {
  await fileStore.getFullFile({
    url: `${jobRunStore.state.artifactData.value.cdn_base_url}/${currentPath.value.path}`
  })

  forceFileDownload.trigger({
    source: fileStore.rawFile,
    name: currentPath.value.name
  })
}

const handleCopy = async (view: string) => {
  const fileSource = await fileStore.getFullFile({
    url: `${jobRunStore.state.artifactData.value.cdn_base_url}/${currentPath.value.path}`
  })

  if (fileStore.isFileImg) {
    copy.handleCopyElementBySource(fileSource)

    return
  }

  copy.handleCopyText(fileStore.fileSourceForCopy(view))
}

const fetchData = async () => {
  fileStore.$reset()

  const { jobRunId } = router.route.value.params

  if (jobRunStore.state.jobRun.value.short_uuid !== jobRunId) {
    await jobRunStore.actions.resetStore()
    await jobRunStore.actions.getJobRun(jobRunId)
  }

  if (!jobRunId || !jobRunStore.state.jobRun.value.artifact.short_uuid) {
    fileStore.loading = false

    return
  }

  await jobRunStore.actions.getInitialJobRunArtifact({
    uuid: {
      jobRunShortId: jobRunId,
      artifactShortId: jobRunStore.state.jobRun.value.artifact.short_uuid
    }
  })
}

onBeforeMount(() => fetchData())

watch(filePath, async filePath => {
  if (!currentPath.value || (currentPath.value && currentPath.value.is_dir)) fileStore.$reset()

  if (filePath === '') return

  await fileStore.getFilePreview({
    size: currentPath.value.size,
    extension: currentPath.value.ext,
    url: `${jobRunStore.state.artifactData.value.cdn_base_url}/${filePath}`
  })
})
</script>
