<template>
  <div>
    <v-card class="mx-auto" :outlined="!$vuetify.breakpoint.xsOnly" :flat="$vuetify.breakpoint.xsOnly" sticky-container>
      <ProjectNavBar
        :job="job"
        :routeName="routeName"
        :handleOnStick="handleOnStick"
        :project="projectStore.project"
        :sticked="projectStore.menu.sticked"
        :projectBreadcrumbs="projectBreadcrumbs"
        :handleShowProjectBar="handleShowProjectBar"
        :isShowProjectBar="projectStore.menu.isShowProjectBar"
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
useProject()
const ext = useFileExtension()
const jobStore = useJobStore()
const fileStore = useFileStore()
const { route } = useRouterAskAnna()
const projectStore = useProjectStore()
const packageStore = usePackageStore()

const fileSource = ref('')

const job = computed(() => jobStore.job)
const routeName = computed(() => route.name)
const isShowReadmeFile = computed(() => routeName.value === 'workspace-project-code')
const jobEnd = computed(() => (route.name.indexOf('jobs-name') >= 1 ? 5 : 3))
const end = computed(() => (route.name === 'workspace-project-job-overiew' ? 6 : jobEnd.value))
const projectBreadcrumbs = useBreadcrumbs({ start: 0, end: end.value })

const readmeFile = computed(() =>
  packageStore.packageData.files.find(item => item.parent === '/' && item.name.toLowerCase() === 'readme.md')
)

const images = computed(() => packageStore.packageData.files.filter(item => ext.images.includes(item.ext)))
const cdnBaseUrl = computed(() => packageStore.packageData.cdn_base_url)

const handleShowProjectBar = () => (projectStore.menu.isShowProjectBar = !projectStore.menu.isShowProjectBar)

const handleOnStick = value => {
  projectStore.menu.isSticked = value
  if (!value) projectStore.menu.sticked = false
}

watch(readmeFile, async readmeFile => {
  if (!isShowReadmeFile.value || !readmeFile) return

  fileSource.value = await fileStore.getFullFile({
    url: `${packageStore.packageData.cdn_base_url}/${readmeFile.path}`
  })
})
</script>
