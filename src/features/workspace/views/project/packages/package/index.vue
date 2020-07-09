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

      <package-tree
        v-else
        :items="treeView"
        :height="calcHeight"
        :breadcrumbs="breadcrumbs"
        @clickOnRow="handleClickOnRow"
      />
    </v-col>
  </v-row>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import { defineComponent } from '@vue/composition-api'
import PackageFile from '@package/components/PackageFile'
import PackageTree from '@package/components/PackageTree'
import { headers, FileIcons } from '@package/utils/index'
import { watch, onBeforeMount, computed } from '@vue/composition-api'
import usePackageStore from '@/features/package/composition/usePackageStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'

export default defineComponent({
  components: { PackageFile, PackageTree },

  setup(props, context) {
    const { height } = useWindowSize()
    const packageStore = usePackageStore()
    const breadcrumbs = usePackageBreadcrumbs(context)

    onBeforeMount(async () => {
      packageStore.resetFile()
      const { projectId, packageId, folderName } = context.root.$route.params

      await packageStore.getPackage({
        projectId,
        packageId,
        folderName
      })
    })

    const calcHeight = computed(() => height.value - 380)
    const path = computed(() => context.root.$route.params.folderName || '/')

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

    return {
      file: packageStore.file,
      fileSource: packageStore.fileSource,
      treeView,
      FileIcons,
      calcHeight,
      breadcrumbs,
      currentPath,
      handleClickOnRow
    }
  }
})
</script>
