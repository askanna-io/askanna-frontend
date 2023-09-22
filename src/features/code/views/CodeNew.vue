<template>
  <CodeToolbar
    :breadcrumbs="breadcrumbs"
    v-if="userStore.isLoggedIn"
  >
    <template v-slot:left>
      <AskAnnaCardTitle>New code package</AskAnnaCardTitle>
    </template>
  </CodeToolbar>
  <VExpandTransition>
    <div>
      <CodeUpload
        v-if="projectCodeCreate"
        class="px-4 pb-4"
        :id="packageId"
        @cancelUpload="handleReplace"
        @onCloseOutside="handleCloseOutside"
      />
      <AskAnnaAlert
        v-else
        class="m-4"
      >There is no code pushed to this project.</AskAnnaAlert>
    </div>
  </VExpandTransition>
  <CodeProcessing v-if="isProcessing" />
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { route } = useRouterAskAnna()
const packageStore = usePackageStore()
const projectStore = useProjectStore()
const permission = useAskAnnaPermission()
const breadcrumbs = usePackageBreadcrumbs()

const isRaplace = ref(false)
const packageId = route.params.packageId || ''

const params = computed(() => route.params)
const projectCodeCreate = computed(() => permission.getFor(permission.labels.projectCodeCreate))
const isProcessing = computed(() => packageStore.processingList.find(item => item.packageId === packageId))

const handleReplace = () => (isRaplace.value = !isRaplace.value)

const handleCloseOutside = async () => {
  await projectStore.getProjectMe(route.params.projectId)
  const project = await projectStore.getProject(route.params.projectId)
  if (!project.package.suuid || !project.suuid) return

  await packageStore.getPackage({
    loading: true,
    routeParams: params.value,
    packageId: project.package.suuid,
  })
  isRaplace.value = false
}
</script>

