<template>
  <AskAnnaLoadingProgress :loading="packagesStore.loadingPackages">
    <AskAnnaRow align="center" justify="center">
      <AskAnnaCol cols="12" class="pt-0">
        <v-data-table
          v-scroll="throttle(onScroll, 1000)"
          disable-pagination
          hide-default-footer
          :mobile-breakpoint="0"
          :headers="headersComputed"
          :options="{ itemsPerPage: -1 }"
          :items="packagesStore.projectPackages.results"
          class="job-table askanna-table scrollbar cursor--pointer"
          @click:row="handleClickRow"
        >
          <template v-slot:top>
            <package-toolbar
              v-sticky="sticked"
              :sticky-z-index="1"
              sticky-offset="{top: 52, bottom: 10}"
              :breadcrumbs="breadcrumbsComputed"
            />
          </template>
          <template v-slot:item.filename="{ item }">
            <AskAnnaTooltip top content-class="opacity-1">
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  {{ slicedText(item.filename, maxLength) }}
                </div>
              </template>
              <span>{{ item.filename }}</span>
            </AskAnnaTooltip>
          </template>
          <template v-slot:item.suuid="{ item }">
            <AskAnnaTooltip top content-class="opacity-1">
              <template v-slot:activator="{ on, value }">
                <div v-on="on">
                  <AskAnnaButton class="px-0" text small>#{{ item.suuid.slice(0, 4) }}</AskAnnaButton>
                  <AskAnnaTooltip v-if="!$vuetify.breakpoint.xsOnly" right content-class="opacity-1">
                    <template v-slot:activator="{ on }">
                      <AskAnnaButton icon text x-small v-on="on" v-show="value" @click.stop="handleCopy(item.suuid)"
                        ><AskAnnaIcon>mdi-content-copy</AskAnnaIcon></AskAnnaButton
                      >
                    </template>
                    <span>Copy package SUUID</span>
                  </AskAnnaTooltip>
                </div>
              </template>
              <span>{{ item.suuid }}</span>
            </AskAnnaTooltip>
          </template>
          <template v-slot:item.created="{ item }">
            <span class="text-no-wrap">{{ $moment(item.created).format(' Do MMMM YYYY, h:mm:ss a') }}</span>
          </template>
          <template v-slot:item.created_by="{ item }">
            <AskAnnaTooltip top content-class="opacity-1">
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  {{ slicedText(item.created_by.name, maxLength) }}
                </div>
              </template>
              <span>{{ item.created_by.name }}</span>
            </AskAnnaTooltip>
          </template>
          <template v-slot:item.description="{ item }">
            <AskAnnaTooltip top content-class="opacity-1">
              <template v-slot:activator="{ on, value }">
                <div v-on="on">
                  {{ slicedText(item.description, maxLength) }}
                  <AskAnnaTooltip right content-class="opacity-1">
                    <template v-slot:activator="{ on }">
                      <AskAnnaButton icon text x-small v-on="on" v-show="value"></AskAnnaButton>
                    </template>
                  </AskAnnaTooltip>
                </div>
              </template>
              <span>{{ item.description }}</span>
            </AskAnnaTooltip>
          </template>
          <template v-slot:item.modified="{ item }">
            <AskAnnaTooltip top content-class="opacity-1">
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <AskAnnaButton
                    outlined
                    label
                    small
                    class="btn--hover"
                    color="secondary"
                    @click.stop="handleDownload(item)"
                  >
                    <AskAnnaIcon :left="$vuetify.breakpoint.name !== 'sm'">mdi-download</AskAnnaIcon>

                    <span class="hidden-sm-only">Download</span>
                  </AskAnnaButton>
                </div>
              </template>
              <span>Download</span>
            </AskAnnaTooltip>
          </template>
        </v-data-table>
      </AskAnnaCol>
    </AskAnnaRow>
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
import { throttle } from 'lodash'

const copy = useCopy()
const { $moment } = useMoment()
const { width } = useWindowSize()
const slicedText = useSlicedText()
const context = getCurrentInstance()
const projectStore = useProjectStore()
const packagesStore = usePackagesStore()
const { route, router } = useRouterAskAnna()
const forceFileDownload = useForceFileDownload()

const breadcrumbs = useBreadcrumbs({ start: 2 })

const sticked = computed(() => !projectStore.menu.sticked)
const next = computed(() => packagesStore.projectPackages.next)
const packageId = computed(() => projectStore.project.package.suuid)

const { projectId } = route.params

const query = useQuery({
  next,
  limit: 18,
  offset: 100,
  suuid: projectId,
  storeAction: packagesStore.getProjectPackages
})

const onScroll = e => query.onScroll(e.target.documentElement.scrollTop)

const fetchData = async () => {
  await packagesStore.resetStore()
  await packagesStore.getInitialProjectPackages({ params: { limit: 100, offset: 0 }, suuid: projectId })
}

onBeforeMount(() => fetchData())

const sortBy = (a, b) => {
  const nameA = a.name.toUpperCase()
  const nameB = b.name.toUpperCase()
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }

  return 0
}

const headers = (isMobile: boolean = false) => [
  {
    text: 'SUUID',
    value: 'suuid',
    sortable: false,
    width: isMobile ? '1%' : '10%',
    class: 'text-left text-subtitle-2 font-weight-bold h-20' + (isMobile ? '' : ' w-min-110'),
    isShowOnMobile: true
  },
  {
    text: 'Date created',
    value: 'created',
    width: isMobile ? '15%' : '10%',
    class: 'w-min-210 text-left text-subtitle-2 font-weight-bold h-20',
    isShowOnMobile: true
  },
  {
    text: 'By',
    value: 'created_by',
    sort: sortBy,
    width: '10%',
    class: 'w-min-110 text-left text-subtitle-2 font-weight-bold h-20',
    isShowOnMobile: true
  },
  {
    text: 'Description',
    align: 'left',
    value: 'description',
    width: '60%',
    class: 'w-max-110 text-left text-subtitle-2 font-weight-bold h-20',
    isShowOnMobile: true
  },
  {
    text: '',
    value: 'modified',
    sortable: false,
    width: '10%',
    class: 'w-min-110 text-left text-subtitle-2 font-weight-bold h-20',
    isShowOnMobile: false
  }
]
const isMobile = computed(() => context?.proxy.$root.$vuetify.breakpoint.xsOnly)
const headersComputed = computed(() =>
  isMobile.value ? headers(isMobile.value).filter(item => item.isShowOnMobile === isMobile.value) : headers()
)

const breadcrumbsComputed = computed(() => {
  const { workspaceId, projectId } = route.params

  const first = {
    title: `Package: #${packageId.value.slice(0, 4)}`,
    to: {
      name: 'workspace-project-code',
      params: { workspaceId, projectId, folderName: '' }
    },
    exact: true,
    disabled: false,
    showTooltip: true,
    tooltip: `
          <span>${packageId.value}</span>
        `
  }

  return [first, ...breadcrumbs.value]
})

const handleClickRow = ({ suuid, versionId }) => {
  router.push({
    name: 'workspace-project-package-folder',
    params: { projectId: route.params.projectId, packageId: suuid, versionId, folderName: '' }
  })
}

const handleDownload = async packageData => {
  const source = await packagesStore.downloadPackage(packageData.suuid)
  forceFileDownload.trigger({ source, name: `code_${packageData.suuid}_${packageData.filename}` })
}

const handleCopy = id => copy.handleCopyText(id)

const maxLength = computed(() => {
  switch (context?.proxy.$root.$vuetify.breakpoint.name) {
    case 'xs':
      return 40 - (550 - width.value) / 12
    case 'sm':
      return 30 - (841 - width.value) / 15
    default:
      1000
  }
})
</script>

<style>
.job-sub-table .v-data-table__wrapper tr th {
  z-index: 1;
}
.v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: none !important;
}
</style>
