<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <package-file
        v-if="file"
        :file="file"
        :fileSource="fileSource"
        :breadcrumbs="breadcrumbs"
        :currentPath="currentPath"
      />
      <div class="px-4" v-else>
        <v-toolbar dense flat color="grey lighten-3" class="br-r4">
          <v-flex class="d-flex">
            <div class="mr-auto d-flex align-center">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <div v-on="on">Package #{{ packageId.slice(0, 4) }}</div>
                </template>
                <span>{{ packageId }}</span>
              </v-tooltip>
            </div>
            <div>
              <v-btn small outlined color="secondary" class="mr-1" @click="handleDownload()">
                <v-icon color="secondary" left>mdi-download</v-icon>Download
              </v-btn>

              <v-btn small outlined color="secondary" class="mr-1" @click="handleReplace()">
                <v-icon color="secondary" left>mdi-folder-move</v-icon>Replace
              </v-btn>

              <v-btn small outlined color="secondary" @click="handleHistory()">
                <v-icon color="secondary">mdi-history</v-icon>History
              </v-btn>
            </div>
          </v-flex>
        </v-toolbar>
        <package-tree
          :items="treeView"
          :height="calcHeight"
          :breadcrumbs="breadcrumbs"
          @clickOnRow="handleClickOnRow"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import usePackages from '@packages/composition/usePackages'

import { defineComponent } from '@vue/composition-api'
import PackageFile from '@package/components/PackageFile'
import PackageTree from '@package/components/PackageTree'
import { headers, FileIcons } from '@package/utils/index'
import { ref, watch, onBeforeMount, computed } from '@vue/composition-api'
import usePackageStore from '@/features/package/composition/usePackageStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'

export default defineComponent({
  components: { PackageFile, PackageTree },

  setup(props, context) {
    const { height } = useWindowSize()
    const packageStore = usePackageStore()
    const packages = usePackages(context)

    const breadcrumbs = usePackageBreadcrumbs(context)
    const forceFileDownload = useForceFileDownload()

    onBeforeMount(async () => {
      packageStore.resetFile()
      const { projectId, packageId, folderName } = context.root.$route.params

      await packageStore.getPackage({
        projectId,
        packageId,
        folderName
      })
    })

    const calcHeight = computed(() => height.value - 420)
    const path = computed(() => {
      const folderName = context.root.$route.params.folderName || '/'
      if (folderName === '/') return folderName

      const isRootPath = folderName.indexOf('/')
      const tmpPath = isRootPath === 0 ? folderName.slice(1) : folderName

      return tmpPath
    })

    const currentPath = computed(() => {
      const pathArray = path.value.split('/')
      const fileName = pathArray.pop()
      const current = packageStore.packageData.value.files.find(
        item => item.name === fileName && item.path === path.value
      )

      return current
    })

    const treeView = computed(() => {
      let parentPath
      if (currentPath.value && currentPath.value.is_dir && path.value !== '/') {
        parentPath = packageStore.packageData.value.files.find(
          file => file.name === currentPath.value.parent && file.is_dir
        )
        parentPath = {
          ...parentPath,
          name: '...',
          ext: 'parent'
        }
      }
      const tree = packageStore.packageData.value.files.filter(item => item.parent === path.value)

      return parentPath ? [parentPath, ...tree] : tree
    })

    watch(currentPath, async (currentPath, prevPath) => {
      const path = currentPath && !currentPath.is_dir && currentPath.name !== '' ? currentPath.path : ''
      if (prevPath && path !== '' && path === prevPath.path) return

      await packageStore.getFileSource(path)
    })

    const handleClickOnRow = async item => {
      const { workspaceId, projectId, packageId, versionId, folderName = '' } = context.root.$route.params
      let path = `/${workspaceId}/project/${projectId}/packages/${packageId}/version/${versionId}/${folderName}/${item.name}`

      if (typeof item.path === 'undefined') {
        path = `/${workspaceId}/project/${projectId}/packages/${packageId}/version/${versionId}`
      }

      if (item.is_dir) {
        path = `/${workspaceId}/project/${projectId}/packages/${packageId}/version/${versionId}/${item.path}`
      }

      context.root.$router.push({ path })
    }

    const handleHistory = () => {
      const { projectId, packageId } = context.root.$route.params
      context.root.$router.push({
        name: 'workspace-project-packages-uuid-history',
        params: { projectId, packageId, versionId: '1' }
      })
    }

    const handleDownload = async () => {
      const packageData = packageStore.packageData.value
      const source = await packages.downloadPackage({
        projectId: packageData.project,
        packageId: packageData.short_uuid
      })
      forceFileDownload.trigger({ source, name: packageData.filename })
    }

    const handleReplace = () =>
      context.root.$router.push({
        name: 'workspace-project-packages-uuid-replace',
        params: { ...context.root.$route.params }
      })

    return {
      packageId: context.root.$route.params.packageId,
      file: packageStore.file,
      fileSource: packageStore.fileSource,
      treeView,
      FileIcons,
      calcHeight,
      breadcrumbs,
      currentPath,
      handleReplace,
      handleHistory,
      handleDownload,
      handleClickOnRow
    }
  }
})
</script>
