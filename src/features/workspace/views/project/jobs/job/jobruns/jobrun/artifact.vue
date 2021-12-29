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
                <v-btn small outlined color="secondary" class="mr-1 btn--hover" @click="handleDownload()">
                  <v-icon color="secondary" left>mdi-download</v-icon>Download
                </v-btn>
              </div>
            </v-slide-y-transition>
          </template>
        </package-toolbar>

        <package-file
          v-if="filePath"
          :file="file"
          :sticked="sticked"
          :fileSource="fileSource"
          :currentPath="currentPath"
        />
        <package-tree
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

<script lang="ts">
import { useWindowSize } from '@u3u/vue-hooks'
import { defineComponent } from '@vue/composition-api'
import { FileIcons } from '@/features/package/utils/index'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { watch, onBeforeMount, computed } from '@vue/composition-api'
import PackageFile from '@/features/package/components/PackageFile.vue'
import PackageTree from '@/features/package/components/PackageTree.vue'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import useProjectStore from '@/features/project/composition/useProjectStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'
import PackageToolbar from '@/features/package/components/PackageToolbar.vue'
import useTriggerFileDownload from '@/core/composition/useTriggerFileDownload'

export default defineComponent({
  name: 'PackageUuid',

  components: {
    PackageFile,
    PackageTree,
    PackageToolbar
  },

  setup(_, context) {
    const router = useRouterAskAnna()
    const { height } = useWindowSize()
    const jobRunStore = useJobRunStore()
    const projectStore = useProjectStore()

    const triggerFileDownload = useTriggerFileDownload()
    const breadcrumbs = usePackageBreadcrumbs(context, { start: 8, end: 9 })

    const file = computed(() => jobRunStore.state.file.value)

    const { jobId, jobRunId, projectId, workspaceId } = context.root.$route.params

    const sticked = computed(() => !projectStore.stickedVM.value)

    const calcHeight = computed(() => height.value - 370)
    const path = computed(() => context.root.$route.params.folderName || '/')
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
      const artifactData = jobRunStore.state.artifactData.value
      const url = await jobRunStore.downloadPackage({
        jobRunShortId: jobRunId,
        artifactShortId: jobRunStore.state.jobRun.value.artifact.short_uuid
      })

      triggerFileDownload.trigger({ url, name: artifactData.filename })
    }

    const handeBackToPackageRoot = () => {
      router.push({
        name: 'workspace-project-jobs-job-jobrun-artifact',
        params: { workspaceId, projectId, jobId, jobRunId }
      })
    }

    const fetchData = async () => {
      const { jobRunId } = context.root.$route.params

      if (jobRunStore.state.jobRun.value.short_uuid !== jobRunId) {
        await jobRunStore.resetStore()
        await jobRunStore.getJobRun(jobRunId)
      }
      await jobRunStore.getInitialJobRunArtifact({
        uuid: {
          jobRunShortId: jobRunId,
          artifactShortId: jobRunStore.state.jobRun.value.artifact.short_uuid
        }
      })
    }

    onBeforeMount(() => fetchData())

    watch(filePath, async filePath => {
      if (!currentPath.value || (currentPath.value && currentPath.value.is_dir)) await jobRunStore.resetFile()

      if (filePath === '') return

      await jobRunStore.getFileSource(filePath)
    })

    const fileSource = computed(() => jobRunStore.state.fileSource.value)
    const jobRunArtifactLoading = computed(() => jobRunStore.state.jobRunArtifactLoading.value)

    return {
      file,
      filePath,
      sticked,
      treeView,
      FileIcons,
      fileSource,
      calcHeight,
      breadcrumbs,
      currentPath,
      artifactUuid,
      breadcrumbsComputed,

      getRoutePath,
      handleDownload,
      jobRunArtifactLoading,
      handeBackToPackageRoot
    }
  }
})
</script>
