<template>
  <router-view />
</template>

<script>
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useProjectStore from '@/features/project/composition/useProjectStore'
import { onBeforeMount, onBeforeUpdate, defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup(_, context) {
    const projectStore = useProjectStore()
    const router = useRouterAskAnna(context)

    onBeforeMount(() => {
      gotoPackage()
    })

    onBeforeUpdate(() => {
      gotoPackage()
    })

    const gotoPackage = async () => {
      const { name } = context.root.$route

      if (name === 'workspace-project-code') {
        let { packageId, projectId } = context.root.$route.params
        if (!packageId) {
          await projectStore.getProject(projectId)

          packageId = projectStore.project.value.package.short_uuid
            ? projectStore.project.value.package.short_uuid
            : 'new-package'
        }

        router.push({
          name: 'workspace-project-package',
          params: {
            projectId,
            packageId
          }
        })
      }
    }
  }
})
</script>
