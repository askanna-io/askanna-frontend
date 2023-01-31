<template>
  <VDataTable
    fixed-header
    single-expand
    :items="jobs"
    item-key="suuid"
    disable-pagination
    hide-default-footer
    :mobile-breakpoint="0"
    :options.sync="options"
    :page.sync="options.page"
    :expanded.sync="expanded"
    :loading="sortFilterLoading"
    :server-items-length="count"
    :items-per-page="options.itemsPerPage"
    :show-expand="!$vuetify.breakpoint.xsOnly"
    :headers="getHeaders($vuetify.breakpoint.xsOnly)"
    :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100] }"
    class="job-table scrollbar ask-anna-table ask-anna-table--with-links jobs"
    @click:row="handleJobClick"
    @item-expanded="handleExpand"
  >
    <template v-slot:top v-if="!$vuetify.breakpoint.xsOnly">
      <AskAnnaCard flat>
        <AskAnnaCardText>
          A job is a command or a set of commands you want to run in AskAnna. You can use jobs to handle data, get a
          prediction, train a model, et cetera.
          <a
            class="app-link text-decoration-none primary--text font-weight-medium d-inline-block"
            href="https://docs.askanna.io/job/"
            target="_blank"
          >
            Read the documentation</a
          >
          for more information about jobs and how you configure them.
        </AskAnnaCardText>
      </AskAnnaCard>
    </template>
    <template v-slot:expanded-item="{ item }">
      <td :colspan="8" class="pa-0">
        <AskAnnaLoadingProgress v-if="item.runs.count" :loading="runsStore.runsLoading">
          <Runs asSubChild calcHeight :suuid="item.suuid" :tableClass="'job-sub-table'" />
        </AskAnnaLoadingProgress>

        <div v-else class="ma-2 text-center">No runs yet</div>
      </td>
    </template>

    <template v-slot:item.name="{ item }">
      <RouterLink class="table-link table-link--unformated" :to="routeLinkParams(item)">
        {{ item.name }}
      </RouterLink>
    </template>

    <template v-slot:item.suuid="{ item }">
      <RouterLink class="table-link table-link--unformated" :to="routeLinkParams(item)">
        {{ item.runs.count }}
      </RouterLink>
    </template>

    <template v-slot:item.status="{ item }">
      <RouterLink class="table-link table-link--unformated alert" :to="routeLinkParams(item)">
        <AskAnnaAlertStatus :statusData="item.runs.status" />
      </RouterLink>
    </template>

    <template v-slot:no-data>
      For this project, there are no jobs configured. Check
      <a class="ask-anna-link" href="https://docs.askanna.io/job/create-job/" target="_blank">the documentation</a>
      on how you can create a job.
    </template>

    <template v-slot:footer>
      <AskAnnaTablePagination
        v-if="jobs.length"
        :next="next"
        :count="count"
        :previous="previous"
        :page="options.page"
        :loading="sortFilterLoading"
        :pageItemsCount="jobs.length"
        :itemsPerPage="options.itemsPerPage"
        @onUpdateOptions="handleUpdateOptions"
      />
    </template>
  </VDataTable>
</template>

<script setup lang="ts">
import { get } from 'lodash'
import { JobsListHeaders } from '../helper'

const jobsStore = useJobsStore()
const runsStore = useRunsStore()
const { route, routerPush } = useRouterAskAnna()

const expanded = ref([])

const queryParams = computed(() => route.query)
const next = computed(() => jobsStore.jobs.next)
const count = computed(() => jobsStore.jobs.count)
const jobs = computed(() => jobsStore.jobs.results)
const suuid = computed(() => route.params.projectId)
const previous = computed(() => jobsStore.jobs.previous)

const { options, handleUpdateOptions, sortFilterLoading } = useQuery({
  next,
  suuid,
  previous,
  queryParams,
  loading: false,
  storeAction: jobsStore.getProjectJobs,
  page_size: +queryParams.value?.page_size || 25,
  defaultOptions: { page: 1, itemsPerPage: +queryParams.value?.page_size || 25 }
})

const getHeaders = (isMobile: boolean) =>
  isMobile ? JobsListHeaders(isMobile).filter(el => el.isShowOnMobile) : JobsListHeaders(isMobile)

const handleJobClick = item => {
  routerPush({
    name: 'workspace-project-job-overiew',
    params: { ...route.params, jobId: item.suuid || 'jobname' }
  })
}

const handleExpand = async ({ item, value }) => {
  if (!value) return
  runsStore.$reset()

  const suuid = get(expanded.value, '0.suuid', '')

  if (suuid && suuid !== item.suuid) {
    await runsStore.getRuns({ suuid: item.suuid, loading: true, params: { page_size: 10 }, initial: true })
  }
}

const routeLinkParams = item => {
  return {
    name: 'workspace-project-job-overiew',
    params: {
      ...route.params,
      jobId: item.suuid
    }
  }
}
</script>

<style lang="scss">
.job-table tbody tr {
  cursor: pointer;
}
.job-table .v-data-table__empty-wrapper {
  cursor: initial !important;
}
.job-sub-table .v-data-table__wrapper tr th {
  z-index: 1;
}
.theme--light.v-data-table .v-data-footer {
  border: none;
}
.mobile-view .v-data-table .v-data-footer {
  margin-right: 0;
  .v-data-footer__select {
    margin-left: 0;
  }
}

.v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: none !important;
}

.mobile-view {
  .jobs tbody td.text-start {
    padding: 0 8px 0 0 !important;
  }
}
</style>
