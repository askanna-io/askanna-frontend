<template>
  <div>
    <RouterView v-if="!isNewPackage" />
    <RouterView v-else name="newPackage" />
  </div>
</template>

<script setup lang="ts">
const fileStore = useFileStore()
const projectStore = useProjectStore()
const packageStore = usePackageStore()

const projectId = computed(() => projectStore.project.suuid)
const packageId = computed(() => projectStore.project.package?.suuid)

const isNewPackage = computed(() => projectId.value && !packageId.value)

watch(projectId, async () => getPackage())

const getPackage = async (loading = false) => {
  if (!packageId.value) return

  await packageStore.getPackage({
    loading,
    packageId: packageId.value
  })
}

onBeforeMount(() => {
  fileStore.$reset()
  packageStore.$reset()
})
onBeforeUnmount(() => {
  fileStore.$reset()
  packageStore.$reset()
})
</script>
