<template>
  <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="false">
    <router-view />
  </v-skeleton-loader>
</template>

<script>
import { ref, watch, onBeforeMount, onUnmounted, computed, defineComponent } from '@vue/composition-api'
import usePackagesStore from '@/features/packages/composition/usePackagesStore'

export default defineComponent({
  setup(props, context) {
    const packagesStore = usePackagesStore(context)

    const loading = ref(true)

    onBeforeMount(async () => {
      const { name } = context.root.$route

      if (name === 'workspace-project-code') {
        let { packageId, projectId } = context.root.$route.params

        if (!packageId) {
          await packagesStore.getProjectPackages(projectId)
          const lastPackage = packagesStore.projectPackages.value
            ? packagesStore.projectPackages.value
            : { short_uuid: 'new-package' }

          packageId = lastPackage.short_uuid
        }
        loading.value = false
        context.root.$router.push({
          name: 'workspace-project-package',
          params: {
            projectId,
            packageId
          }
        })
      }
    })

    onUnmounted(() => {
      loading.value = false
    })

    return { loading }
  }
})
</script>
