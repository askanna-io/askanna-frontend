<template>
  <AskAnnaBreadcrumbs :items="breadcrumbs" />

  <div class="px-0 sm:px-2 mb-2">
    <AskAnnaCard
      :variant="!$vuetify.display.xs ? 'outlined' : 'flat'"
      class="overflow-visible"
    >
      <ProjectNavBar
        :job="job"
        :routeName="routeName || '/'"
        :project="projectStore.project"
        :projectVisibility="projectStore.form.visibility"
      />


      <RouterView />

    </AskAnnaCard>

    <AskAnnaCard
      v-if="isShowReadmeFile && readmeFile"
      class="mt-3"
      :variant="!$vuetify.display.xs ? 'outlined' : 'flat'"
    >

      <AskAnnaCardTitle>
        {{ capitalize(readmeFile.name) }}
      </AskAnnaCardTitle>
      <PreviewFileTypeMardown
        :images="images"
        :fileSource="fileSource"
        :cdnBaseUrl="cdnBaseUrl"
      />
    </AskAnnaCard>
  </div>
</template>

<script setup lang="ts">
useProject()

const ext = useFileExtension()
const jobStore = useJobStore()
const fileStore = useFileStore()
const capitalize = useCapitalize()
const { route } = useRouterAskAnna()
const projectStore = useProjectStore()
const packageStore = usePackageStore()

const fileSource = ref('')



const job = computed(() => jobStore.job)
const routeName = computed(() => route.name)
const routeMeta = computed(() => route.meta)
const end = computed(() => routeMeta.value.breadcrumbLevel)
const breadcrumbs = useBreadcrumbs({ start: 0, end: end.value })
const isShowReadmeFile = computed(() => routeName.value === 'workspace-project-code')

const readmeFile = computed(() =>
  packageStore.packageData.files.find(item => item.parent === '/' && item.name.toLowerCase() === 'readme.md')
)

const images = computed(() => packageStore.packageData.files.filter(item => ext.images.includes(item.ext)))
const cdnBaseUrl = computed(() => packageStore.packageData.cdn_base_url)

watch(readmeFile, async readmeFile => {
  if (!isShowReadmeFile.value || !readmeFile) return

  fileSource.value = await fileStore.getFullFile({
    url: `${packageStore.packageData.cdn_base_url}/${readmeFile.path}`
  })
})
</script>