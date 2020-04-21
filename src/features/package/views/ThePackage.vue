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
import PackageFile from '../components/PackageFile'
import PackageTree from '../components/PackageTree'
import { headers, FileIcons } from '../utils/index'
import { defineComponent } from '@vue/composition-api'
import usePackageStore from '../composition/usePackageStore'
import { onBeforeMount, computed } from '@vue/composition-api'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'

export default defineComponent({
  name: 'ThePackage',

  components: { PackageFile, PackageTree },

  setup(props, context) {
    const { height } = useWindowSize()
    const packageStore = usePackageStore()
    const breadcrumbs = usePackageBreadcrumbs(context)

    onBeforeMount(() => {
      const { projectId, packageId, folderName } = context.root.$route.params

      packageStore.getFileSource()
      packageStore.getPackage({
        projectId,
        packageId,
        folderName
      })
    })

    const calcHeight = computed(() => height.value - 450)
    const path = computed(() => context.root.$route.params.folderName || '/')

    const currentPath = computed(() => {
      const pathArray = path.value.split('/')
      const fileName = pathArray.pop()
      const current = packageStore.packageData.value.files.find(item => item.name === fileName)

      if (current && !current.is_dir && current.name !== '') {
        packageStore.getFileSource(current.path)
      }

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

    const handleClickOnRow = async item => {
      const { projectId, packageId, versionId, folderName = '' } = context.root.$route.params
      let path = `/workspace/project/${projectId}/packages/${packageId}/version/${versionId}/${folderName}/${item.name}`

      if (typeof item.path === 'undefined') {
        path = `/workspace/project/${projectId}/packages/${packageId}/version/${versionId}`
      }

      if (item.is_dir) {
        path = `/workspace/project/${projectId}/packages/${packageId}/version/${versionId}/${item.path}`
      }

      context.root.$router.push({ path })
    }

    return {
      ...packageStore,
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
