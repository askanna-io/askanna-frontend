<template>
  <div>
    <v-card class="mx-auto" :outlined="!$vuetify.breakpoint.xsOnly" :flat="$vuetify.breakpoint.xsOnly" sticky-container>
      <project-nav-bar
        :job="job"
        :routeName="routeName"
        :handleOnStick="handleOnStick"
        :sticked="projectStore.stickedVM.value"
        :projectBreadcrumbs="projectBreadcrumbs"
        :project="projectStore.state.project.value"
        :handleShowProjectBar="handleShowProjectBar"
        :isShowProjectBar="projectStore.state.menu.isShowProjectBar"
      />
      <router-view />
    </v-card>
    <v-card v-if="isShowReadmeFile && readmeFile" class="mt-3" outlined>
      <v-card-title flat dense color="white" class="pb-0">
        {{ readmeFile.name | capitalize }}
      </v-card-title>
      <PreviewFileTypeMardown :fileSource="fileSource" :images="images" :cdnBaseUrl="cdnBaseUrl" />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import useProjectStore from '@/features/project/composition/useProjectStore'

import { useRouter } from '@u3u/vue-hooks'
import { ref, watch, computed } from '@vue/composition-api'
import { useFileStore } from '@/features/file/useFileStore'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useJobStore from '@/features/job/composition/useJobStore'
import useProject from '@/features/project/composition/useProject'
import useFileExtension from '@/core/composition/useFileExtension'
import usePackageStore from '@/features/package/composition/usePackageStore'
import ProjectNavBar from '@/features/project/components/nav-bars/ProjectNavBar.vue'
import PreviewFileTypeMardown from '@/features/file/components/PreviewFileTypeMardown.vue'

useProject()
const { route } = useRouter()
const ext = useFileExtension()
const jobStore = useJobStore()
const fileStore = useFileStore()
const projectStore = useProjectStore()
const packageStore = usePackageStore()

const fileSource = ref('')

const job = computed(() => jobStore.job.value)
const routeName = computed(() => route.value.name)
const isShowReadmeFile = computed(() => routeName.value === 'workspace-project-code')
const jobEnd = computed(() => (route.value.name.indexOf('jobs-name') >= 1 ? 5 : 3))
const end = computed(() => (route.value.name === 'workspace-project-job-overiew' ? 6 : jobEnd.value))
const projectBreadcrumbs = useBreadcrumbs({ start: 0, end: end.value })

const readmeFile = computed(() =>
  packageStore.packageData.value.files.find(item => item.parent === '/' && item.name.toLowerCase() === 'readme.md')
)

const images = computed(() => packageStore.packageData.value.files.filter(item => ext.images.includes(item.ext)))
const cdnBaseUrl = computed(() => packageStore.packageData.value.cdn_base_url)

const handleShowProjectBar = () =>
  projectStore.actions.setMenu({
    name: 'menu.isShowProjectBar',
    value: !projectStore.state.menu.value.isShowProjectBar
  })

const handleOnStick = value => {
  projectStore.actions.setMenu({ name: 'menu.isSticked', value })
  if (!value) projectStore.actions.setMenu({ name: 'menu.sticked', value: false })
}

watch(readmeFile, async readmeFile => {
  if (!isShowReadmeFile.value || !readmeFile) return

  fileSource.value = await fileStore.getFullFile({
    url: `${packageStore.state.packageData.value.cdn_base_url}/${readmeFile.path}`
  })
})
</script>
