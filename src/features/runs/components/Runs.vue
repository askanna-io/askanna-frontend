<template>
  <VDataTableServer
    :items="runs"
    hide-default-footer
    :class="tableClass"
    :items-length="count"
    :mobile-breakpoint="0"
    :options.sync="options"
    :page.sync="options.page"
    :headers="headersComputed"
    :items-per-page="itemsPerPage"
    class="askanna-table scrollbar"
    :loading.sync="sortFilterLoading && 'primary'"
    v-model:items-per-page="options.itemsPerPage"
    @update:options="loadItems"
  >
    <template v-slot:top>
      <div
        v-if="!asSubChild"
        class="w-full max-w-full px-4 py-2"
      >
        <AskAnnaRunFilterBar />
      </div>
    </template>
    <template v-slot:item="{ internalItem }">
      <tr class="pointer hover:bg-third">
        <AskAnnaTableItem :to="routeLinkParams({ item: internalItem.raw })">
          <AskAnnaTableItemTextWithCopy
            prefix="#"
            suffix=""
            :maxLength="4"
            :value="internalItem.raw.suuid"
            copyTitle="Copy run SUUID"
          />
        </AskAnnaTableItem>

        <AskAnnaTableItem
          v-if="isProjectRuns"
          :to="routeLinkParams({ item: internalItem.raw, name: 'workspace-project-job-overiew' })"
        >
          <AskAnnaTableItemTextWithCopy
            :maxLength="maxLength"
            :value="internalItem.raw.job.name"
            copyTitle="Copy job name"
          />
        </AskAnnaTableItem>

        <AskAnnaTableItem :to="routeLinkParams({ item: internalItem.raw })">
          <AskAnnaTableItemTextWithCopy
            v-if="internalItem.raw.name"
            :value="internalItem.raw.name"
            :maxLength="maxLength"
            copyTitle="Copy run name"
          />
        </AskAnnaTableItem>

        <AskAnnaTableItem :to="routeLinkParams({ item: internalItem.raw })">
          <AskAnnaChipStatus
            link
            :status="internalItem.raw.status"
          />
        </AskAnnaTableItem>

        <AskAnnaTableItem :to="routeLinkParams({ item: internalItem.raw })">
          <div class="flex flex-col">
            <div><b>Started:</b>{{ dayjs(internalItem.raw.created_at).format(' Do MMMM YYYY, h:mm:ss a') }}</div>
            <div><b>Duration:</b>{{ calculateDuration(internalItem.raw) }}<br /></div>
          </div>
        </AskAnnaTableItem>

        <AskAnnaTableItem :to="routeLinkParams({ item: internalItem.raw })">
          <AskAnnaTableItemTextWithCopy
            :copyBtn="false"
            copyTitle="Copy"
            :maxLength="maxLength"
            :value="internalItem.raw.created_by?.name"
          />
        </AskAnnaTableItem>

        <AskAnnaTableItem :to="routeLinkParams({ item: internalItem.raw, name: 'workspace-project-jobs-job-run-input' })">
          {{ getPayloadTitle(internalItem.raw.payload) }}
        </AskAnnaTableItem>

        <AskAnnaTableItem
          :to="routeLinkParams({ item: internalItem.raw, name: 'workspace-project-jobs-job-run-metrics' })"
        >
          {{ getMetricTitle(internalItem.raw.metrics_meta.count) }}
        </AskAnnaTableItem>
      </tr>
    </template>

    <template v-slot:bottom>
      <AskAnnaProgressLinear :active="sortFilterLoading" />

      <AskAnnaTablePagination
        v-if="runs.length"
        :next="next"
        title="runs"
        :count="count"
        :previous="previous"
        :page="options.page"
        :autoPerPage="true"
        :loading="sortFilterLoading"
        :pageItemsCount="runs.length"
        :itemsPerPage="options.itemsPerPage"
        @onUpdateOptions="handleUpdateOptions"
      />
    </template>


    <template v-slot:no-data>
      <div class="text-left">
        <template v-if="filtersBarStore.search">
          There are no runs for this search and filter request.
        </template>
        <template v-else>
          There are no runs for this project. To get data here, you must first run a job. <a
            class="askanna-link"
            href="https://docs.askanna.io/run/"
            target="_blank"
          >Read the documentation</a> for more
          information about runs and how to run a job.
        </template>
      </div>
    </template>
  </VDataTableServer>
</template>

<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const props = defineProps({
  suuid: {
    type: String,
    default: () => ''
  },
  suuidKey: {
    type: String,
    default: () => 'job_suuid'
  },
  tableClass: {
    type: String,
    default: () => ''
  },
  itemsPerPage: {
    type: Number,
    default: () => 10
  },
  asSubChild: {
    type: Boolean,
    default: () => false
  },
  isProjectRuns: {
    type: Boolean,
    default: () => false
  }
})

const numeral = useNumeral()
const display = useDisplay()
const runsStore = useRunsStore()
const { route } = useRouterAskAnna()
const filtersBarStore = useFiltersBarStore()
const { width, height } = useAskAnnaWindowSize()
const { dayjs, durationHumanizeBySecond } = useDayjs()

const queryParamsInternal = ref({})

const queryParams = computed(() => route.query)
const next = computed(() => runsStore.runs.next)
const count = computed(() => runsStore.runs.count)
const runs = computed(() => runsStore.runs.results)
const previous = computed(() => runsStore.runs.previous)
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

const tableItemHeight = ref(52)
const tableitemsPerPage = computed(() => {
  let h = height.value - 270
  return Math.floor(h / tableItemHeight.value) + 3
})

const { options, handleUpdateOptions, sortFilterLoading } = useQuery({
  next,
  previous,
  loading: false,
  immediate: true,
  suuidKey: props.suuidKey,
  setPageSizeInRoute: false,
  asSubChild: props.asSubChild,
  suuid: toRef(props, 'suuid'),
  storeAction: runsStore.getRuns,
  page_size: tableitemsPerPage.value,
  defaultOptions: { page: 1, itemsPerPage: tableitemsPerPage.value },
  queryParams: props.asSubChild ? queryParamsInternal : queryParams
})

const headersComputed = computed(() => [
  {
    title: 'SUUID',
    sortable: false,
    key: 'info',
    width: '50px',
    show: true
  },
  {
    title: 'Job',
    width: '170px',
    sortable: true,
    key: 'job.name',
    show: props.isProjectRuns
  },
  {
    title: 'Name',
    width: '170px',
    sortable: true,
    key: 'name',
    show: true
  },
  {
    title: 'Status',
    width: '160px',
    sortable: true,
    key: 'status',
    show: true
  },
  {
    title: 'Timing',
    width: '330px',
    sortable: false,
    key: 'runtime',
    show: true
  },
  {
    title: 'By',
    key: 'created_by.name',
    width: '14%',
    sortable: true,
    show: true
  },
  {
    title: 'Input',
    width: '100px',
    sortable: false,
    key: 'payload',
    show: true
  },
  {
    width: '120px',
    title: 'Metrics',
    sortable: false,
    key: 'metrics_meta',
    show: true
  }
].filter(item => item.show))

const calculateDuration = item => {
  const status = item.status.toLowerCase()
  if (status === 'queued' || status === 'pending') return ' Not started'

  return ` ${durationHumanizeBySecond(item.duration?.toString())}`
}

const routeLinkParams = ({ item, name = 'workspace-project-jobs-job-run-overview' }) => {
  return {
    name,
    params: {
      ...route.params,
      runId: item.suuid,
      jobId: item.job.suuid
    }
  }
}

const getPayloadTitle = payload => {
  let title = 'No input'
  if (payload?.lines >= 1) {
    title = `${numeral.numberFormated(payload.lines)} line${payload.lines > 1 ? 's' : ''}`
  }
  return title
}

const getMetricTitle = count => {
  let title = 'No metrics'
  if (count >= 1) {
    title = `${numeral.numberFormated(count)} metric${count > 1 ? 's' : ''}`
  }
  return title
}

const loadItems = ({ page, itemsPerPage, sortBy }) => {
  handleUpdateOptions({ page, itemsPerPage, sortBy })
}

const adjustTableHeight = () => {
  setTimeout(() => {
    const [rowEle] = document.getElementsByClassName('askanna-table--row')
    tableItemHeight.value = rowEle?.clientHeight > 52 ? rowEle?.clientHeight : 52
  }, 500)
}

adjustTableHeight()
</script>
