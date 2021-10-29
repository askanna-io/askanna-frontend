<template>
  <ask-anna-loading-progress :loading="jobRunArtifactLoading" classes="mx-4 mb-4" fullWidth>
    <v-row align="center" justify="center">
      <v-col cols="12" class="pt-0 pb-0">
        <package-toolbar
          v-if="artifactUuid"
          :breadcrumbs="breadcrumbs"
          v-sticky="sticked"
          sticky-offset="{top: 52, bottom: 10}"
        >
          <template v-slot:left>
            <v-tooltip top content-class="opacity-1">
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <a v-if="currentPath" @click="handeBackToPackageRoot" class="text-body-2"
                    >Artifact #{{ artifactUuid.slice(0, 4) }}<v-icon small>mdi-chevron-right</v-icon></a
                  >
                  <span class="text-body-2" v-else> Artifact #{{ artifactUuid.slice(0, 4) }}</span>
                </div>
              </template>
              <span>{{ artifactUuid }}</span>
            </v-tooltip>
          </template>
          <template v-slot:rigth>
            <v-slide-y-transition>
              <div v-if="!filePath">
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

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import { FileIcons } from '@package/utils/index'
import { defineComponent } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import PackageTree from '@/features/package/components/PackageTree'
import useProjectStore from '@project/composition/useProjectStore'
import PackageFile from '@/features/package/components/PackageFile'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import PackageToolbar from '@/features/package/components/PackageToolbar'
import { watch, onBeforeMount, computed } from '@vue/composition-api'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'
import useTriggerFileDownload from '@/core/composition/useTriggerFileDownload'

export default defineComponent({
  name: 'PackageUuid',

  components: {
    PackageFile,
    PackageTree,
    PackageToolbar
  },

  setup(_, context) {
    const { height } = useWindowSize()
    const jobRunStore = useJobRunStore()
    const projectStore = useProjectStore()
    const router = useRouterAskAnna()

    const triggerFileDownload = useTriggerFileDownload()
    const breadcrumbs = usePackageBreadcrumbs(context, { start: 8, end: 9 })

    const file = computed(() => jobRunStore.file.value)

    const { jobId, jobRunId, projectId, workspaceId } = context.root.$route.params

    const sticked = computed(() => !projectStore.stickedVM.value)

    const calcHeight = computed(() => height.value - 370)
    const path = computed(() => context.root.$route.params.folderName || '/')
    const artifactUuid = computed(() => jobRunStore.jobRun.value.artifact.short_uuid)

    const currentPath = computed(() => {
      const pathArray = path.value.split('/')
      const fileName = pathArray.pop()
      const current = jobRunStore.artifactData.value.files.find(
        item => item.name === fileName && item.path === path.value
      )

      return current
    })

    const parentPath = computed(() => {
      let parentPathTemp
      if (currentPath.value && currentPath.value.is_dir && path.value !== '/') {
        parentPathTemp = jobRunStore.artifactData.value.files.find(
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
      const tree = jobRunStore.artifactData.value.files.filter(item => item.parent === path.value)

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
      const artifactData = jobRunStore.artifactData.value
      const url = await jobRunStore.downloadPackage({
        jobRunShortId: jobRunId,
        artifactShortId: jobRunStore.jobRun.value.artifact.short_uuid
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

      if (jobRunStore.jobRun.value.short_uuid !== jobRunId) {
        await jobRunStore.resetStore()
        await jobRunStore.getJobRun(jobRunId)
      }
      await jobRunStore.getInitialJobRunArtifact({
        uuid: {
          jobRunShortId: jobRunId,
          artifactShortId: jobRunStore.jobRun.value.artifact.short_uuid
        }
      })
    }

    onBeforeMount(() => fetchData())

    watch(filePath, async filePath => {
      if (!currentPath.value || (currentPath.value && currentPath.value.is_dir)) await jobRunStore.resetFile()

      if (filePath === '') return

      await jobRunStore.getFileSource(filePath)
    })

    const fileSource = computed(() => jobRunStore.fileSource.value)
    const jobRunArtifactLoading = computed(() => jobRunStore.jobRunArtifactLoading.value)

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
      getRoutePath,
      handleDownload,
      jobRunArtifactLoading,
      handeBackToPackageRoot
    }
  }
})
</script>
