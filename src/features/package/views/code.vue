<template>
  <div>
    <router-view v-if="!isNewPackage" />
    <router-view v-else name="newPackage" />
  </div>
</template>

<script setup lang="ts">
import { useFileStore } from '@/features/file/useFileStore'
import { useProjectStore } from '@/features/project/useProjectStore'
import { usePackageStore } from '@/features/package/usePackageStore'
import { watch, computed, onBeforeUnmount, onBeforeMount } from '@vue/composition-api'

const fileStore = useFileStore()
const projectStore = useProjectStore()
const packageStore = usePackageStore()

const projectId = computed(() => projectStore.project.short_uuid)
const packageId = computed(() => projectStore.project.package.short_uuid)

const isNewPackage = computed(() => projectId.value && !packageId.value)

watch(projectId, async () => getPackage())

const getPackage = async (loading = true) => {
  if (!packageId.value || !projectId.value) return

  await packageStore.getPackage({
    loading,
    projectId: projectId.value,
    packageId: packageId.value
  })
}

onBeforeMount(() => fileStore.$reset())
onBeforeUnmount(() => fileStore.$reset())
</script>
