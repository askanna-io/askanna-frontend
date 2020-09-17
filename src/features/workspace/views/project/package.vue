<template>
  <router-view />
</template>

<script>
import useProjectStore from '@/features/project/composition/useProjectStore'
import { ref, watch, onBeforeMount, onUnmounted, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup(props, context) {
    const projectStore = useProjectStore()

    onBeforeMount(async () => {
      const { name } = context.root.$route

      if (name === 'workspace-project-code') {
        let { packageId, projectId } = context.root.$route.params
        if (!packageId) {
          await projectStore.getProject(projectId)

          packageId = projectStore.project.value.package.short_uuid
            ? projectStore.project.value.package.short_uuid
            : 'new-package'
        }

        context.root.$router.push({
          name: 'workspace-project-package',
          params: {
            projectId,
            packageId
          }
        })
      }
    })
  }
})
</script>
