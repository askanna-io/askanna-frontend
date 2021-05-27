<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <package-toolbar :breadcrumbs="breadcrumbs">
        <template v-slot:left>
          <span class="text-body-2">New Package</span>
        </template>
      </package-toolbar>
      <v-expand-transition>
        <resumable-upload @cancelUpload="handleReplace" class="py-2 px-4" :id="packageId" />
      </v-expand-transition>
      <template v-if="isProcessing">
        <package-processing />
      </template>
    </v-col>
  </v-row>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import usePackages from '@packages/composition/usePackages'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, computed, defineComponent } from '@vue/composition-api'
import PackageToolbar from '@/features/package/components/PackageToolbar'
import usePackageStore from '@/features/package/composition/usePackageStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'

export default defineComponent({
  name: 'NewPackage',

  components: {
    PackageToolbar,
    PackageProcessing: () => import('@/features/package/components/PackageProcessing.vue'),
    ResumableUpload: () => import('@/features/package/components/resumable-upload/ResumableUpload.vue')
  },

  setup(_, context) {
    usePackages(context)
    const { height } = useWindowSize()
    const packageStore = usePackageStore()
    const router = useRouterAskAnna(context)
    const breadcrumbs = usePackageBreadcrumbs(context)

    const isRaplace = ref(false)
    const { workspaceId, projectId, packageId = 'new-package' } = context.root.$route.params

    const calcHeight = computed(() => height.value - 370)
    const isProcessing = computed(() => packageStore.processingList.value.find(item => item.packageId === packageId))

    const handleReplace = () => (isRaplace.value = !isRaplace.value)

    const handeBackToPackageRoot = () => {
      router.push({
        name: 'workspace-project-package',
        params: { workspaceId, projectId, packageId }
      })
    }

    return {
      packageId,
      calcHeight,
      breadcrumbs,
      isProcessing,
      handleReplace,
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
