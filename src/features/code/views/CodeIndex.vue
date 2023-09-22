<template>
  <div>
    <RouterView v-if="!isNewPackage" />
    <RouterView
      v-else
      name="newPackage"
    />
  </div>
</template>

<script setup lang="ts">
const fileStore = useFileStore()
const { route } = useRouterAskAnna()
const projectStore = useProjectStore()
const packageStore = usePackageStore()

const params = computed(() => route.params)
const projectId = computed(() => projectStore.project.suuid)
const packageId = computed(() => projectStore.project.package?.suuid)

const isNewPackage = computed(() => projectId.value && !packageId.value)

watch(projectId, async () => await getPackage())

const getPackage = async (loading = false) => {
  if (!packageId.value || !projectId.value) return

  await packageStore.getPackage({
    loading,
    packageId: packageId.value,
    routeParams: params.value
  })
}

onBeforeMount(() => {
  fileStore.$reset()
  packageStore.$reset()
  getPackage()
})
onBeforeUnmount(() => {
  fileStore.$reset()
  packageStore.$reset()
})
</script>
