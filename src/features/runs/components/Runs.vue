<template>
  <VDataTable
    fixed-header
    :items="items"
    :page.sync="page"
    :loading="loading"
    :headers="getHeaders($vuetify.breakpoint.xsOnly)"
    :mobile-breakpoint="-1"
    :class="tableClass"
    :options.sync="options"
    :server-items-length="count"
    :items-per-page="itemsPerPage"
    @page-count="pageCount = $event"
    :footer-props="{ itemsPerPageOptions: [5, 10, 15, 25, -1] }"
    class="job-runs-table ask-anna-table ask-anna-table--with-links"
  >
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
            <ask-anna-chip-status :status="item.status" />
          </RouterLink>
        </td>
        <td class="text-start">
          <RouterLink class="table-link table-link--unformated" :to="routeLinkParams({ item })">
            <b>Started:</b> &nbsp;{{ $moment(item.created).format(' Do MMMM YYYY, h:mm:ss a') }}
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
  </VDataTable>
</template>

<script setup lang="ts">
const props = defineProps({
  count: {
    type: Number,
    default: () => 0
  },
  items: {
    type: Array,
    default: () => []
  },
  height: {
    type: Number,
    default: () => 300
  },

  tableClass: {
    type: String,
    default: () => ''
  },
  routeName: {
    type: String,
    default: () => ''
  },
  loading: {
    type: Boolean,
    default: () => false
  },
  itemsPerPage: {
    type: Number,
    default: () => 5
  }
})

const emit = defineEmits(['onChangeParams'])

const copy = useCopy()
const numeral = useNumeral()
const { route } = useRouterAskAnna()
const { $moment, durationHumanizeBySecond } = useMoment()

const page = ref(0)
const pageCount = ref(0)
const options = ref({ itemsPerPage: props.itemsPerPage, page: 1 })

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
    width: isMobile ? '170px' : '30%',
    sortable: false,
    value: 'name',
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },
  {
    text: 'Status',
    width: '160px',
    sortable: false,
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
    value: 'by',
    width: '150px',
    sortable: false,
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

watch(options, async (options, currentOptions) => {
  const { itemsPerPage: limit = 5, page = 1 } = options
  const { itemsPerPage: currentLimit = 5, page: currentPage = 1 } = currentOptions

  if (limit === currentLimit && page === currentPage) return

  const params = {
    limit,
    offset: (page - 1) * limit
  }

  emit('onChangeParams', params)
})
</script>
<style scoped>
.h-100 {
  height: 100%;
}
</style>
