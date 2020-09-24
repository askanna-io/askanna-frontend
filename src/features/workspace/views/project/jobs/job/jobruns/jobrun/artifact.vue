<template>
  <ask-anna-loading-progress :loading="jobRunArtifactLoading">
    <v-row align="center" justify="center">
      <v-col cols="12" class="pt-0 pb-0">
        <package-toolbar
          v-if="artifactUuid"
          :breadcrumbs="breadcrumbs"
          v-sticky="sticked"
          sticky-offset="{top: 52, bottom: 10}"
        >
          <template v-slot:left>
            <v-tooltip top>
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
              <div v-if="!file">
                <v-btn small outlined color="secondary" class="mr-1 btn--hover" @click="handleDownload()">
                  <v-icon color="secondary" left>mdi-download</v-icon>Download
                </v-btn>
              </div>
            </v-slide-y-transition>
          </template>
        </package-toolbar>

        <package-file v-if="file" :file="file" :fileSource="fileSource" :currentPath="currentPath" :sticked="sticked" />
        <package-tree
          v-else
          :items="treeView"
          :height="calcHeight"
          :noDataAvailable="'There is no artifact available for this run.'"
          @clickOnRow="handleClickOnRow"
        />
      </v-col>
    </v-row>
  </ask-anna-loading-progress>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import { defineComponent } from '@vue/composition-api'
import { headers, FileIcons } from '@package/utils/index'
import PackageTree from '@/features/package/components/PackageTree'
import usePackages from '@/features/packages/composition/usePackages'
import useProjectStore from '@project/composition/useProjectStore'
import PackageFile from '@/features/package/components/PackageFile'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import PackageToolbar from '@/features/package/components/PackageToolbar'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'
import usePackageStore from '@/features/package/composition/usePackageStore'
import usePackagesStore from '@/features/packages/composition/usePackagesStore'
import { ref, watch, onBeforeMount, onUnmounted, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'PackageUuid',

  components: {
    PackageFile,
    PackageTree,
    PackageToolbar
  },

  setup(props, context) {
    const { height } = useWindowSize()
    const jobRunStore = useJobRunStore()
    const projectStore = useProjectStore()
    const packageStore = usePackageStore()

    const forceFileDownload = useForceFileDownload()
    const breadcrumbs = usePackageBreadcrumbs(context, { start: 8, end: 9 })

    const file = ref(jobRunStore.file)
    const {
      jobId,
      jobRunId,
      projectId,
      workspaceId,
      folderName = '',
      packageId = 'new-package'
    } = context.root.$route.params

    const sticked = computed(() => !projectStore.stickedVM.value)

    onBeforeMount(async () => {
      const { jobRunId } = context.root.$route.params

      if (jobRunStore.jobRun.value.short_uuid !== jobRunId) {
        await jobRunStore.resetStore()
        await jobRunStore.getJobRun(jobRunId)
      }
      jobRunStore.getInitialJobRunArtifact({
        uuid: {
          jobRunShortId: jobRunId,
          artifactShortId: jobRunStore.jobRun.value.artifact.short_uuid
        }
      })
    })

    const calcHeight = computed(() => height.value - 370)
    const path = computed(() => context.root.$route.params.folderName || '/')
    const artifactUuid = computed(() => jobRunStore.jobRun.value.artifact.short_uuid)

    const currentPath = computed(() => {
      const pathArray = path.value.split('/')
      const fileName = pathArray.pop()
      const current = jobRunStore.artifactData.value.files.find(item => item.name === fileName)

      return current
    })

    const treeView = computed(() => {
      let parentPath
      if (currentPath.value && currentPath.value.is_dir && path.value !== '/') {
        parentPath = jobRunStore.artifactData.value.files.find(
          file => file.name === currentPath.value.parent && file.is_dir
        )
        parentPath = {
          ...parentPath,
          name: '...',
          ext: 'parent'
        }
      }
      const tree = jobRunStore.artifactData.value.files.filter(item => item.parent === path.value)

      return parentPath ? [parentPath, ...tree] : tree
    })

    watch(currentPath, async (currentPath, prevPath) => {
      const path = currentPath && !currentPath.is_dir && currentPath.name !== '' ? currentPath.path : ''

      if (prevPath && path !== '' && path === prevPath.path) return
      await jobRunStore.getFileSource(path)
    })

    const handleClickOnRow = async item => {
      let path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${jobRunId}/artifact/${folderName}/${item.name}`
      if (item.parent === '/') {
        path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${jobRunId}/artifact/${item.name}`
      }

      if (typeof item.path === 'undefined') {
        path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${jobRunId}/artifact/`
      }

      if (item.is_dir) {
        path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${jobRunId}/artifact/${item.path}`
      }

      context.root.$router.push({ path })
    }

    const handleDownload = async () => {
      const artifactData = jobRunStore.artifactData.value
      const source = await jobRunStore.downloadPackage({
        jobRunShortId: jobRunId,
        artifactShortId: jobRunStore.jobRun.value.artifact.short_uuid
      })

      /*  const link = document.createElement('a')

      link.href =
        'https://cdn-api.askanna.eu/files/artifacts/2cb35943475c4b0da943a59ca38d638e/c1ff6ad482224d778f845cb4f5870f70/7cbff44595ad49b3a658c600255b9f50/artifact_4446ea43a9ab43a48626e25f0418c6c2.zip'
      link.setAttribute('download', `test`)
      document.body.appendChild(link)
      link.click() */
      forceFileDownload.trigger({ source, name: artifactData.filename })
    }

    const handeBackToPackageRoot = () => {
      context.root.$router.push({
        name: 'workspace-project-jobs-job-jobrun-artifact',
        params: { workspaceId, projectId, jobId, jobRunId }
      })
    }

    return {
      sticked,
      file: jobRunStore.file,
      fileSource: jobRunStore.fileSource,
      jobRunArtifactLoading: jobRunStore.jobRunArtifactLoading,
      treeView,
      artifactUuid,
      FileIcons,
      calcHeight,
      breadcrumbs,
      currentPath,
      handleDownload,
      handleClickOnRow,
      handeBackToPackageRoot
    }
  }
})
</script>
