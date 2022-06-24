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
import { ref, computed } from '@vue/composition-api'
import { useUserStore } from '@/features/user/useUserStore'
import usePermission from '@/core/composition/usePermission'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import usePackages from '@/features/packages/composition/usePackages'
import useProjectStore from '@/features/project/composition/useProjectStore'
import usePackageStore from '@/features/package/composition/usePackageStore'
import usePackageBreadcrumbs from '@/core/composition/usePackageBreadcrumbs'
import PackageToolbar from '@/features/package/components/PackageToolbar.vue'
import PackageProcessing from '@/features/package/components/PackageProcessing.vue'
import ResumableUpload from '@/features/package/components/resumable-upload/ResumableUpload.vue'

usePackages()
const userStore = useUserStore()
const router = useRouterAskAnna()
const permission = usePermission()
const packageStore = usePackageStore()
const projectStore = useProjectStore()
const breadcrumbs = usePackageBreadcrumbs()

const isRaplace = ref(false)
const packageId = router.route.value.params.packageId || ''

const projectCodeCreate = computed(() => permission.getFor(permission.labels.projectCodeCreate))
const isProcessing = computed(() => packageStore.processingList.value.find(item => item.packageId === packageId))

const handleReplace = () => (isRaplace.value = !isRaplace.value)

const handleCloseOutside = async () => {
  await projectStore.getProjectMe(router.route.value.params.projectId)
  const project = await projectStore.getProject(router.route.value.params.projectId)
  if (!project.package.short_uuid || !project.short_uuid) return

  await packageStore.getPackage({
    loading: true,
    projectId: project.short_uuid,
    packageId: project.package.short_uuid
  })
  isRaplace.value = false
}
</script>
<style>
.replace-active {
  background-color: grey;
  color: white;
}
</style>
