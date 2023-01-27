<template>
  <VDataTable
    fixed-header
    :items="runs"
    disable-pagination
    hide-default-footer
    :class="tableClass"
    :mobile-breakpoint="-1"
    :options.sync="options"
    :page.sync="options.page"
    :loading="sortFilterLoading"
    :server-items-length="count"
    :items-per-page="itemsPerPage"
    :headers="getHeaders($vuetify.breakpoint.xsOnly)"
    :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100] }"
    class="job-runs-table ask-anna-table ask-anna-table--with-links"
  >
    <template v-slot:top>
      <AskAnnaContainer v-if="!asSubChild" fluid class="py-0">
        <AskAnnaRow justify="end">
          <AskAnnaCol class="d-flex" cols="12" sm="3"> </AskAnnaCol>

          <AskAnnaCol v-if="!$vuetify.breakpoint.xsOnly" class="d-flex" cols="12" sm="5" md="4" lg="3">
            <AskAnnaTextField
              dense
              hide-details
              label="Search"
              @input="debounceedSearch"
              append-icon="mdi-magnify"
            ></AskAnnaTextField>
          </AskAnnaCol>
        </AskAnnaRow>
      </AskAnnaContainer>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td class="text-start">
          <RouterLink class="table-link table-link--unformated" :to="routeLinkParams({ item })">
            <AskAnnaTooltip v-if="!$vuetify.breakpoint.xsOnly" top content-class="opacity-1">
              <template v-slot:activator="{ on, value }">
                <div v-on="on">
                  <AskAnnaButton class="px-0" text small>#{{ item.suuid.slice(0, 4) }}</AskAnnaButton>
                  <AskAnnaTooltip right content-class="opacity-1">
                    <template v-slot:activator="{ on }">
                      <AskAnnaButton icon text x-small v-on="on" v-show="value" @click.prevent="handleCopy(item.suuid)"
                        ><AskAnnaIcon>mdi-content-copy</AskAnnaIcon></AskAnnaButton
                      >
                    </template>
                    <span>Copy run SUUID</span>
                  </AskAnnaTooltip>
                </div>
              </template>
              <span>{{ item.suuid }}</span>
            </AskAnnaTooltip>
            <template v-else> #{{ item.suuid.slice(0, 4) }} </template>
          </RouterLink>
        </td>
        <td class="text-start">
          <RouterLink
            :class="{ 'h-100': !item.name }"
            :to="routeLinkParams({ item })"
            class="table-link table-link--unformated"
          >
            {{ item.name }}
          </RouterLink>
        </td>
        <td class="text-start">
          <RouterLink class="table-link table-link--unformated" :to="routeLinkParams({ item })">
            <AskAnnaChipStatus :status="item.status" />
          </RouterLink>
        </td>
        <td class="text-start">
          <RouterLink class="table-link table-link--unformated" :to="routeLinkParams({ item })">
            <b>Started:</b> &nbsp;{{ dayjs(item.created).format(' Do MMMM YYYY, h:mm:ss a') }}
            <br />
            <b>Duration:</b>&nbsp;{{ calculateDuration(item) }}<br />
          </RouterLink>
        </td>
        <td class="text-start">
          <RouterLink class="table-link table-link--unformated" :to="routeLinkParams({ item })">
            <AskAnnaCopy :text="item.created_by.name" smartSlice :showCopyButton="false" :width="12" />
          </RouterLink>
        </td>
        <td class="text-start">
          <RouterLink
            class="table-link table-link--unformated"
            :to="routeLinkParams({ item, name: 'workspace-project-jobs-job-run-input' })"
          >
            {{ getPayloadTitle(item.payload) }}
          </RouterLink>
        </td>
        <td class="text-start">
          <RouterLink
            class="table-link table-link--unformated"
            :to="routeLinkParams({ item, name: 'workspace-project-jobs-job-run-metrics' })"
          >
            {{ getMetricTitle(item.metrics_meta.count) }}
          </RouterLink>
        </td>
      </tr>
    </template>

    <template v-slot:footer>
      <VProgressLinear :color="sortFilterLoading ? 'primary' : 'white'" active indeterminate />
      <AskAnnaTablePagination
        v-if="runs.length"
        :next="next"
        :count="count"
        :previous="previous"
        :page="options.page"
        :loading="sortFilterLoading"
        :pageItemsCount="runs.length"
        :itemsPerPage="options.itemsPerPage"
        @onUpdateOptions="handleUpdateOptions"
      />
    </template>
  </VDataTable>
</template>

<script setup lang="ts">
const props = defineProps({
  suuid: {
    type: String,
    default: () => ''
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
  }
})

const copy = useCopy()
const numeral = useNumeral()
const runsStore = useRunsStore()
const { route } = useRouterAskAnna()
const { dayjs, durationHumanizeBySecond } = useDayjs()

const queryParamsInternal = ref({})

const queryParams = computed(() => route.query)
const next = computed(() => runsStore.runs.next)
const count = computed(() => runsStore.runs.count)
const runs = computed(() => runsStore.runs.results)
const previous = computed(() => runsStore.runs.previous)

const { options, debounceedSearch, handleUpdateOptions, sortFilterLoading } = useQuery({
  next,
  previous,
  loading: false,
  asSubChild: props.asSubChild,
  suuid: toRef(props, 'suuid'),
  page_size: props.itemsPerPage,
  storeAction: runsStore.getRuns,
  defaultOptions: { page: 1, itemsPerPage: props.itemsPerPage },
  queryParams: props.asSubChild ? queryParamsInternal : queryParams
})

const getHeaders = isMobile => [
  {
    text: 'SUUID',
    sortable: false,
    value: 'info',
    width: isMobile ? '50px' : '110px',
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },
  {
    text: 'Name',
    width: '170px',
    sortable: true,
    value: 'name',
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },
  {
    text: 'Status',
    width: '160px',
    sortable: true,
    value: 'status',
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },
  {
    text: 'Timing',
    width: '350px',
    sortable: false,
    value: 'runtime',
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },
  {
    text: 'By',
    value: 'created_by.name',
    width: '150px',
    sortable: true,
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },
  {
    text: 'Input',
    width: '100px',
    sortable: false,
    value: 'payload',
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },
  {
    width: '120px',
    text: 'Metrics',
    sortable: false,
    value: 'metrics_meta',
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  }
]

const handleCopy = id => copy.handleCopyText(id)

const calculateDuration = item => {
  const status = item.status.toLowerCase()
  if (status === 'queued' || status === 'pending') return 'Not started'

  return durationHumanizeBySecond(item.duration?.toString())
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
</script>
<style scoped>
.h-100 {
  height: 100%;
}
</style>
