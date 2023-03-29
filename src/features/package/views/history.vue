<template>
  <AskAnnaLoadingProgress :loading="packageStore.loadingPackages">
    <AskAnnaRow
      align="center"
      justify="center"
    >
      <AskAnnaCol
        cols="12"
        class="pt-0"
      >
        <VDataTable
          fixed-header
          disable-pagination
          hide-default-footer
          :mobile-breakpoint="0"
          :options.sync="options"
          :page.sync="options.page"
          :headers="headersComputed"
          :server-items-length="count"
          :loading="sortFilterLoading"
          :items-per-page="options.itemsPerPage"
          :items="packageStore.projectPackages.results"
          :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100] }"
          class="job-table askanna-table scrollbar"
          @click:row="handleClickRow"
        >
          <template v-slot:top>
            <PackageToolbar
              v-sticky="sticked"
              :sticky-z-index="1"
              sticky-offset="{top: 52, bottom: 10}"
              :breadcrumbs="breadcrumbsComputed"
            />
          </template>
          <template v-slot:item.filename="{ item }">
            <AskAnnaTooltip
              top
              content-class="opacity-1"
            >
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  {{ slicedText(item.filename, maxLength) }}
                </div>
              </template>
              <span>{{ item.filename }}</span>
            </AskAnnaTooltip>
          </template>
          <template v-slot:item.suuid="{ item }">
            <AskAnnaTooltip
              top
              content-class="opacity-1"
            >
              <template v-slot:activator="{ on, value }">
                <div v-on="on">
                  <AskAnnaButton
                    class="px-0"
                    text
                    small
                  >#{{ item.suuid.slice(0, 4) }}</AskAnnaButton>
                  <AskAnnaTooltip
                    v-if="!$vuetify.breakpoint.xsOnly"
                    right
                    content-class="opacity-1"
                  >
                    <template v-slot:activator="{ on }">
                      <AskAnnaButton
                        icon
                        text
                        x-small
                        v-on="on"
                        v-show="value"
                        @click.stop="handleCopy(item.suuid)"
                      >
                        <AskAnnaIcon>mdi-content-copy</AskAnnaIcon>
                      </AskAnnaButton>
                    </template>
                    <span>Copy package SUUID</span>
                  </AskAnnaTooltip>
                </div>
              </template>
              <span>{{ item.suuid }}</span>
            </AskAnnaTooltip>
          </template>
          <template v-slot:item.created_at="{ item }">
            <span class="text-no-wrap">{{ dayjs(item.created_at).format(' Do MMMM YYYY, h:mm:ss a') }}</span>
          </template>
          <template v-slot:item.created_by.name="{ item }">
            <AskAnnaTooltip
              top
              content-class="opacity-1"
            >
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  {{ slicedText(item.created_by.name, maxLength) }}
                </div>
              </template>
              <span>{{ item.created_by.name }}</span>
            </AskAnnaTooltip>
          </template>
          <template v-slot:item.description="{ item }">
            <AskAnnaTooltip
              top
              content-class="opacity-1"
            >
              <template v-slot:activator="{ on, value }">
                <div v-on="on">
                  {{ slicedText(item.description, maxLength) }}
                  <AskAnnaTooltip
                    right
                    content-class="opacity-1"
                  >
                    <template v-slot:activator="{ on }">
                      <AskAnnaButton
                        icon
                        text
                        x-small
                        v-on="on"
                        v-show="value"
                      ></AskAnnaButton>
                    </template>
                  </AskAnnaTooltip>
                </div>
              </template>
              <span>{{ item.description }}</span>
            </AskAnnaTooltip>
          </template>
          <template v-slot:item.modified_at="{ item }">
            <AskAnnaTooltip
              top
              content-class="opacity-1"
            >
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <AskAnnaButton
                    small
                    label
                    outlined
                    color="secondary"
                    class="btn--hover"
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
          <template v-slot:footer>
            <AskAnnaTablePagination
              v-if="packageStore.projectPackages.results.length"
              :next="next"
              :count="count"
              :previous="previous"
              :page="options.page"
              :loading="sortFilterLoading"
              :pageItemsCount="packageStore.projectPackages.results.length"
              :itemsPerPage="options.itemsPerPage"
              @onUpdateOptions="handleUpdateOptions"
            />
          </template>
        </VDataTable>
      </AskAnnaCol>
    </AskAnnaRow>
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
const copy = useCopy()
const { dayjs } = useDayjs()
const { width } = useWindowSize()
const slicedText = useSlicedText()
const context = getCurrentInstance()
const projectStore = useProjectStore()
const packageStore = usePackageStore()
const forceFileDownload = useForceFileDownload()
const breadcrumbs = useBreadcrumbs({ start: 2 })
const { route, routerPush } = useRouterAskAnna()

const queryParams = computed(() => route.query)
const projectId = computed(() => route.params.projectId)
const sticked = computed(() => !projectStore.menu.sticked)
const next = computed(() => packageStore.projectPackages.next)
const count = computed(() => packageStore.projectPackages.count)
const packageId = computed(() => projectStore.project.package.suuid)
const previous = computed(() => packageStore.projectPackages.previous)

const { options, sortFilterLoading, handleUpdateOptions } = useQuery({
  next,
  previous,
  queryParams,
  loading: false,
  suuid: projectId,
  page_size: +queryParams.value?.page_size || 25,
  defaultOptions: { page: 1, itemsPerPage: +queryParams.value?.page_size || 25 },
  storeAction: packageStore.getProjectPackages
})

const headers = (isMobile: boolean = false) => [
  {
    text: 'SUUID',
    value: 'suuid',
    sortable: false,
    width: isMobile ? '1%' : '10%',
    class: 'text-left text-subtitle-2 font-weight-bold' + (isMobile ? '' : ' w-min-110'),
    isShowOnMobile: true
  },
  {
    text: 'Date created',
    value: 'created_at',
    width: isMobile ? '15%' : '10%',
    class: 'w-min-210 text-left text-subtitle-2 font-weight-bold',
    isShowOnMobile: true
  },
  {
    text: 'By',
    width: '10%',
    isShowOnMobile: true,
    value: 'created_by.name',
    class: 'w-min-110 text-left text-subtitle-2 font-weight-bold'
  },
  {
    text: 'Description',
    align: 'left',
    sortable: false,
    value: 'description',
    width: '60%',
    class: 'w-max-110 text-left text-subtitle-2 font-weight-bold',
    isShowOnMobile: true
  },
  {
    text: '',
    value: 'modified_at',
    sortable: false,
    width: '10%',
    class: 'w-min-110 text-left text-subtitle-2 font-weight-bold',
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
  routerPush({
    name: 'workspace-project-package-folder',
    params: { projectId: route.params.projectId, packageId: suuid, versionId, folderName: '' }
  })
}

const handleDownload = async packageData => {
  const source = await packageStore.downloadPackage(packageData.suuid)
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

<style>.job-sub-table .v-data-table__wrapper tr th {
  z-index: 1;
}

.v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: none !important;
}</style>
