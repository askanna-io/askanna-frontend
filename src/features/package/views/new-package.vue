<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <package-toolbar :breadcrumbs="breadcrumbs" v-if="userStore.isLoggedIn">
        <template v-slot:left>
          <span class="text-body-2">New Package</span>
        </template>
      </package-toolbar>
      <v-expand-transition>
        <div>
          <resumable-upload
            v-if="projectCodeCreate"
            class="py-2 px-4"
            :id="packageId"
            @cancelUpload="handleReplace"
            @onCloseOutside="handleCloseOutside"
          />
          <v-alert v-else class="ma-4 text-center" dense outlined>There is no code pushed to this project.</v-alert>
        </div>
      </v-expand-transition>
      <template v-if="isProcessing">
        <package-processing />
      </template>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const permission = usePermission()
const { route } = useRouterAskAnna()
const packageStore = usePackageStore()
const projectStore = useProjectStore()
const packagesStore = usePackagesStore()
const breadcrumbs = usePackageBreadcrumbs()

const isRaplace = ref(false)
const packageId = route.params.packageId || ''

const projectCodeCreate = computed(() => permission.getFor(permission.labels.projectCodeCreate))
const isProcessing = computed(() => packageStore.processingList.find(item => item.packageId === packageId))

const handleReplace = () => (isRaplace.value = !isRaplace.value)

const handleCloseOutside = async () => {
  await projectStore.getProjectMe(route.params.projectId)
  const project = await projectStore.getProject(route.params.projectId)
  if (!project.package.short_uuid || !project.short_uuid) return

  await packageStore.getPackage({
    loading: true,
    packageId: project.package.short_uuid
  })
  isRaplace.value = false
}

const fetchData = async () => {
  packagesStore.resetStore()
  const uuid = route.params.projectId
  packagesStore.getProjectPackages({ uuid, params: { limit: 1, offset: 0 } })
}

onBeforeMount(() => {
  fetchData()
})
</script>
<style>
.replace-active {
  background-color: grey;
  color: white;
}
</style>
