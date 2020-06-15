<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <div class="px-4">
        <v-toolbar dense flat color="grey lighten-3" class="br-r4">
          <v-flex class="d-flex">
            <div class="mr-auto d-flex align-center">
              REPLACE THIS CODE PACKAGE
            </div>
          </v-flex>
        </v-toolbar>
        <v-card class="my-2" outlined>
          <v-card-text
            >If you want to replace this code package, you are in the right place. Below you can find instructions on
            how you can use the AskAnna CLI (add link) to push a new version of the code to this project. Also, you can
            drag & drop a (zip) file to this screen. You can upload a single file, or make a zip file of your local
            directory and upload this zip file.
          </v-card-text>
        </v-card>

        <ask-anna-resumable-upload />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import AskAnnaResumableUpload from '@/core/components/shared/resumable-upload/AskAnnaResumableUpload'
import { useWindowSize } from '@u3u/vue-hooks'
import usePackages from '@packages/composition/usePackages'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

import { defineComponent } from '@vue/composition-api'
import PackageFile from '@package/components/PackageFile'
import PackageTree from '@package/components/PackageTree'
import { headers } from '@package/utils/index'
import { ref, watch, onBeforeMount, onMounted, computed } from '@vue/composition-api'
import usePackageStore from '@/features/package/composition/usePackageStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'

import { plugins } from 'vue-file-agent'

export default defineComponent({
  components: { PackageFile, PackageTree, AskAnnaResumableUpload },

  setup(props, context) {
    const packageStore = usePackageStore()
    const packages = usePackages(context)

    onBeforeMount(async () => {
      const { projectId, packageId, folderName } = context.root.$route.params

      await packageStore.getPackage({
        projectId,
        packageId,
        folderName
      })
    })

    const path = computed(() => context.root.$route.params.folderName || '/')

    const currentPath = computed(() => {
      const pathArray = path.value.split('/')
      const fileName = pathArray.pop()
      const current = packageStore.packageData.value.files.find(item => item.name === fileName)

      return current
    })

    watch(currentPath, async (currentPath, prevPath) => {
      const path = currentPath && !currentPath.is_dir && currentPath.name !== '' ? currentPath.path : ''
      if (prevPath && path !== '' && path === prevPath.path) return

      await packageStore.getFileSource(path)
    })

    return {
      packageId: context.root.$route.params.packageId,
      file: packageStore.file,
      fileSource: packageStore.fileSource
    }
  }
})
</script>
