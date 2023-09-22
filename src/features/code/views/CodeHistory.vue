<template>
  <AskAnnaLoadingProgress :loading="packageStore.loadingPackages">
    <AskAnnaDivider />

    <VDataTableServer
      :color="'primary'"
      :items-length="count"
      :mobile-breakpoint="0"
      :options.sync="options"
      :page.sync="options.page"
      :headers="headersComputed"
      class="askanna-table scrollbar min-w-full"
      :loading.sync="sortFilterLoading && 'primary'"
      v-model:items-per-page="options.itemsPerPage"
      :items="packageStore.projectPackages.results"
      @update:options="loadItems"
    >
      <template v-slot:item="{ item }">
        <tr class="pointer hover:bg-third askanna-table--row">
          <AskAnnaTableItem :to="{
            name: 'workspace-project-code-package-folder',
            params: { workspaceId: route.params.workspaceId, projectId: route.params.projectId, packageId: item.raw.suuid }
          }">
            <AskAnnaTableItemTextWithCopy
              prefix="#"
              suffix=""
              :maxLength="4"
              :value="item.raw.suuid"
              copyTitle="Copy SUUID"
            />
          </AskAnnaTableItem>

          <AskAnnaTableItem
            linkClass="pl-4 pr-8"
            :to="{
              name: 'workspace-project-code-package',
              params: { workspaceId: route.params.workspaceId, projectId: route.params.projectId, packageId: item.raw.suuid }
            }"
          >
            <span class="whitespace-nowrap">{{ dayjs(item.raw.created_at).format(' Do MMMM YYYY, h:mm:ss a') }}</span>
          </AskAnnaTableItem>

          <AskAnnaTableItem :to="{
            name: 'workspace-project-code-package',
            params: { workspaceId: route.params.workspaceId, projectId: route.params.projectId, packageId: item.raw.suuid }
          }">
            <AskAnnaTableItemTextWithCopy
              :copyBtn="false"
              copyTitle="Copy"
              :maxLength="maxLength"
              :value="item.raw.created_by?.name"
            />
          </AskAnnaTableItem>

          <AskAnnaTableItem :to="{
            name: 'workspace-project-code-package',
            params: { workspaceId: route.params.workspaceId, projectId: route.params.projectId, packageId: item.raw.suuid }
          }">
            <AskAnnaTableItemTextWithCopy
              :copyBtn="false"
              :maxLength="maxLength"
              :value="item.raw.description"
            />
          </AskAnnaTableItem>

          <AskAnnaTableItem v-if="!$vuetify.display.xs">
            <AskAnnaButton @click.stop="handleDownload(item.raw)">
              <AskAnnaIcon
                :left="$vuetify.display.name !== 'sm'"
                icon="mdi-download"
              />
              <span class="hidden md:inline">Download</span>
              <AskAnnaTooltip v-if="$vuetify.display.smAndDown">
                Download
              </AskAnnaTooltip>
            </AskAnnaButton>
          </AskAnnaTableItem>
        </tr>
      </template>

      <template v-slot:bottom>
        <AskAnnaProgressLinear :active="sortFilterLoading" />
        <AskAnnaTablePagination
          v-if="packageStore.projectPackages.results.length"
          :next="next"
          :count="count"
          :autoPerPage="true"
          :previous="previous"
          :page="options.page"
          title="code packages"
          :loading="sortFilterLoading"
          :itemsPerPage="options.itemsPerPage"
          :pageItemsCount="packageStore.projectPackages.results.length"
          @onUpdateOptions="handleUpdateOptions"
        />
      </template>
    </VDataTableServer>
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const { dayjs } = useDayjs()
const display = useDisplay()
const { route } = useRouterAskAnna()
const packageStore = usePackageStore()
const { width, height } = useAskAnnaWindowSize()
const forceFileDownload = useForceFileDownload()

const queryParams = computed(() => route.query)
const projectId = computed(() => route.params.projectId)
const next = computed(() => packageStore.projectPackages.next)
const count = computed(() => packageStore.projectPackages.count)
const previous = computed(() => packageStore.projectPackages.previous)

const tableItemHeight = ref(52)
const tableitemsPerPage = computed(() => {
  let h = height.value - 270
  return Math.floor(h / tableItemHeight.value) + 3
})

const { options, sortFilterLoading, handleUpdateOptions } = useQuery({
  next,
  previous,
  queryParams,
  loading: false,
  immediate: true,
  suuid: projectId,
  setPageSizeInRoute: false,
  page_size: tableitemsPerPage.value,
  storeAction: packageStore.getProjectPackages,
  defaultOptions: { page: 1, itemsPerPage: tableitemsPerPage.value },
})

const loadItems = ({ page, itemsPerPage, sortBy }) => {
  handleUpdateOptions({ page, itemsPerPage, sortBy })
}

const headers = (isMobile: boolean = false) => [
  {
    title: 'SUUID',
    key: 'suuid',
    sortable: false,
    isShowOnMobile: true
  },
  {
    title: 'Date created',
    key: 'created_at',
    sortable: true,
    width: isMobile ? '25%' : '20%',
    isShowOnMobile: true
  },
  {
    title: 'By',
    width: '14%',
    sortable: true,
    isShowOnMobile: true,
    key: 'created_by.name',
  },
  {
    title: 'Description',
    align: 'left',
    sortable: false,
    width: '80%',
    key: 'description',
    isShowOnMobile: true
  },
  {
    title: '',
    key: 'modified_at',
    sortable: false,
    width: '10%',
    isShowOnMobile: false
  }
]
const isMobile = computed(() => toValue(display.xs))
const headersComputed = computed(() =>
  isMobile.value ? headers(isMobile.value).filter(item => item.isShowOnMobile === isMobile.value) : headers()
)

const maxLength = computed(() => {
  switch (toValue(display.name)) {
    case 'xs':
      return width.value * 0.4 / 8
    case 'sm':
      return width.value * 0.3 / 7
    default:
      return 1000
  }
})

const handleDownload = async packageData => {
  const source = await packageStore.downloadPackage(packageData.suuid)
  forceFileDownload.trigger({ source, name: `code_${packageData.suuid}_${packageData.filename}` })
}

const handleCopy = id => copy.handleCopyText(id)

const adjustTableHeight = () => {
  setTimeout(() => {
    const [rowEle] = document.getElementsByClassName('askanna-table--row')
    tableItemHeight.value = rowEle?.clientHeight > 52 ? rowEle?.clientHeight : 52
  }, 500)
}

adjustTableHeight()
</script>