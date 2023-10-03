<template>
  <VDataTableServer
    :items="jobs"
    :color="'primary'"
    :items-length="count"
    :mobile-breakpoint="0"
    :options.sync="options"
    :page.sync="options.page"
    :headers="headersComputed"
    class="askanna-table scrollbar min-w-full"
    :loading.sync="sortFilterLoading && 'primary'"
    v-model:items-per-page="options.itemsPerPage"
    @update:options="loadItems"
  >
    <template v-slot:item="{ internalItem }">
      <tr class="pointer hover:bg-third askanna-table--row">
        <AskAnnaTableItem :to="routeLinkParams(internalItem.raw)">
          <AskAnnaTableItemTextWithCopy
            :maxLength="maxLength"
            :value="internalItem.raw?.name"
            copyTitle="Copy job name"
          />
        </AskAnnaTableItem>

        <AskAnnaTableItem
          v-if="!$vuetify.display.xs"
          :to="routeLinkParams(internalItem.raw)"
        >
          {{ internalItem.raw.runs.count }}
        </AskAnnaTableItem>

        <AskAnnaTableItem :to="routeLinkRunParams(internalItem.raw)">
          <AskAnnaAlertStatus :statusData="internalItem.raw.runs.status" />
        </AskAnnaTableItem>
      </tr>
    </template>

    <template v-slot:no-data>
      <div class="text-left">
        There are no jobs configured for this project. A job is a command or a set of commands you want to run in
        AskAnna.
        You can use jobs to retrieve data, serve a prediction, train a model, et cetera. <a
          target="_blank"
          class="askanna-link"
          href="https://docs.askanna.io/job/"
        >Read the documentation</a> for more
        information about jobs and how to create them.
      </div>
    </template>

    <template v-slot:bottom>
      <AskAnnaTablePagination
        v-if="jobs.length"
        title="jobs"
        :next="next"
        :count="count"
        :autoPerPage="true"
        :previous="previous"
        :page="options.page"
        :loading="sortFilterLoading"
        :pageItemsCount="jobs.length"
        :itemsPerPage="options.itemsPerPage"
        @onUpdateOptions="handleUpdateOptions"
      />
    </template>
  </VDataTableServer>
</template>

<script setup lang="ts">
import { JobsListHeaders } from '../helper'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const display = useDisplay()
const jobsStore = useJobsStore()
const { route } = useRouterAskAnna()
const { width, height } = useAskAnnaWindowSize()

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

const queryParams = computed(() => route.query)
const next = computed(() => jobsStore.jobs.next)
const count = computed(() => jobsStore.jobs.count)
const jobs = computed(() => jobsStore.jobs.results)
const suuid = computed(() => route.params.projectId)
const isMobile = computed(() => toValue(display.xs))
const previous = computed(() => jobsStore.jobs.previous)

const tableItemHeight = ref(52)
const tableitemsPerPage = computed(() => {
  let h = height.value - 270
  return Math.floor(h / tableItemHeight.value) + 3
})

const { options, handleUpdateOptions, sortFilterLoading } = useQuery({
  next,
  suuid,
  previous,
  queryParams,
  loading: false,
  immediate: true,
  setPageSizeInRoute: false,
  page_size: tableitemsPerPage.value,
  storeAction: jobsStore.getProjectJobs,
  defaultOptions: { page: 1, itemsPerPage: tableitemsPerPage.value },
})

const loadItems = ({ page, itemsPerPage, sortBy }) => {
  handleUpdateOptions({ page, itemsPerPage, sortBy })
}

const headersComputed = computed(() =>
  isMobile.value ? JobsListHeaders(isMobile.value).filter(item => item.isShowOnMobile === isMobile.value) : JobsListHeaders(isMobile.value)
)

const routeLinkParams = item => {
  return {
    name: 'workspace-project-job-overiew',
    params: {
      ...route.params,
      jobId: item.suuid
    }
  }
}

const routeLinkRunParams = item => {
  if (item.runs.count) {
    return {
      name: 'workspace-project-jobs-job-run',
      params: {
        ...route.params,
        jobId: item.suuid,
        runId: item.runs.suuid
      }
    }
  }

  return {
    name: 'workspace-project-job-overiew',
    params: {
      ...route.params,
      jobId: item.suuid
    }
  }
}

const adjustTableHeight = () => {
  setTimeout(() => {
    const [rowEle] = document.getElementsByClassName('askanna-table--row')
    tableItemHeight.value = rowEle?.clientHeight > 52 ? rowEle?.clientHeight : 52
  }, 500)
}

adjustTableHeight()
</script>
