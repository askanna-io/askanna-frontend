<template>
  <ask-anna-loading-progress :loading="packageLoading && !isProcessing">
    <v-row align="center" justify="center">
      <v-col cols="12" class="pt-0 pb-0">
        <package-toolbar :breadcrumbs="breadcrumbs" v-sticky="sticked" sticky-offset="{top: 52, bottom: 10}">
          <template v-slot:left>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <a v-if="currentPath" @click="handeBackToPackageRoot" class="text-body-2"
                    >Package #{{ packageId.slice(0, 4) }}<v-icon small>mdi-chevron-right</v-icon></a
                  >
                  <span class="text-body-2" v-else> Package #{{ packageId.slice(0, 4) }}</span>
                </div>
              </template>
              <span>{{ packageId }}</span>
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
        <template v-if="isProcessing">
          <package-processing />
        </template>
        <template v-else>
          <package-file
            v-if="file"
            :file="file"
            :fileSource="fileSource"
            :currentPath="currentPath"
            :sticked="sticked"
          />
          <package-tree v-else :items="treeView" :height="calcHeight" :getRoutePath="getRoutePath" />
        </template>
      </v-col>
    </v-row>
  </ask-anna-loading-progress>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import { defineComponent } from '@vue/composition-api'
import PackageFile from '@package/components/PackageFile'
import PackageTree from '@package/components/PackageTree'
import { headers, FileIcons } from '@package/utils/index'
import useProjectStore from '@project/composition/useProjectStore'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import PackageToolbar from '@/features/package/components/PackageToolbar'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import usePackageStore from '@/features/package/composition/usePackageStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'
import usePackagesStore from '@/features/packages/composition/usePackagesStore'
import { ref, watchEffect, onBeforeMount, onUnmounted, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'PackageUuid',

  components: {
    PackageFile,
    PackageTree,
    PackageToolbar,
    PackageProcessing: () => import('@/features/package/components/PackageProcessing.vue')
  },

  setup(props, context) {
    const { height } = useWindowSize()
    const jobRunStore = useJobRunStore()
    const packageStore = usePackageStore()
    const projectStore = useProjectStore()

    const packagesStore = usePackagesStore(context)
    const forceFileDownload = useForceFileDownload()
    const breadcrumbs = usePackageBreadcrumbs(context, { start: 8, end: 9 })

    const polling = ref(null)
    const file = computed(() => packageStore.file.value)

    const { workspaceId, projectId, jobId, jobRunId, folderName = '' } = context.root.$route.params

    const packageId = computed(() => jobRunStore.jobRun.value.package.short_uuid)

    const sticked = computed(() => !projectStore.stickedVM.value)

    onBeforeMount(async () => {
      const { jobRunId } = context.root.$route.params

      if (jobRunStore.jobRun.value.short_uuid !== jobRunId) {
        await jobRunStore.resetStore()
        await jobRunStore.getJobRun(jobRunId)
      }
      const packageId = jobRunStore.jobRun.value.package.short_uuid

      if (packageId === 'new-package') {
        return
      }

      await getPackage()
      if (isProcessing.value) {
        pollData()
      }
    })

    onUnmounted(() => {
      clearInterval(polling.value)
    })

    const getPackage = async () =>
      await packageStore.getPackage({
        projectId,
        folderName,
        packageId: jobRunStore.jobRun.value.package.short_uuid,
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
    const path = computed(() => context.root.$route.params.folderName || '/')
    const isProcessing = computed(() => packageStore.processingList.value.find(item => item.packageId === packageId))

    const currentPath = computed(() => {
      const pathArray = path.value.split('/')
      const fileName = pathArray.pop()
      const current = packageStore.packageData.value.files.find(item => item.name === fileName)

      return current
    })

    const parentPath = computed(() => {
      let parentPathTemp
      if (currentPath.value && currentPath.value.is_dir && path.value !== '/') {
        parentPathTemp = packageStore.packageData.value.files.find(
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

    const treeView = computed(() => {
      const tree = packageStore.packageData.value.files.filter(item => item.parent === path.value)

      return parentPath.value ? [parentPath.value, ...tree] : tree
    })

    const getRoutePath = item => {
      let path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${jobRunId}/code/${folderName}/${item.name}`
      if (item.parent === '/') {
        path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${jobRunId}/code/${item.name}`
      }

      if (typeof item.path === 'undefined') {
        path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${jobRunId}/code/`
      }

      if (item.is_dir) {
        path = `/${workspaceId}/project/${projectId}/jobs/${jobId}/runs/${jobRunId}/code/${item.path}`
      }

      return { path }
    }

    const handleDownload = async () => {
      const packageData = packageStore.packageData.value
      const source = await packagesStore.downloadPackage({
        projectId: packageData.project,
        packageId: packageData.short_uuid
      })
      forceFileDownload.trigger({ source, name: packageData.filename })
    }

    const handeBackToPackageRoot = () => {
      context.root.$router.push({
        name: 'workspace-project-jobs-job-jobrun-code',
        params: { workspaceId, projectId, packageId, jobId, jobRunId }
      })
    }

    watchEffect(() => {
      packageStore.resetFile()
      const filePath =
        currentPath.value && !currentPath.value.is_dir && currentPath.value.name !== '' ? currentPath.value.path : ''

      if (filePath === '') return
      packageStore.getFileSource(filePath)
    })

    return {
      sticked,
      file: packageStore.file,
      fileSource: packageStore.fileSource,
      packageLoading: packageStore.packageLoading,
      treeView,
      packageId,
      FileIcons,
      calcHeight,
      breadcrumbs,
      currentPath,
      getRoutePath,
      isProcessing,
      handleDownload,
      handeBackToPackageRoot
    }
  }
})
</script>
<style>
.replace-active {
  background-color: grey;
  color: white;
}
</style>
