<template>
  <VDataTable
    fixed-header
    single-expand
    :items="jobList"
    item-key="suuid"
    :mobile-breakpoint="0"
    :expanded.sync="expanded"
    :hide-default-footer="!jobList.length"
    :show-expand="!$vuetify.breakpoint.xsOnly"
    :headers="getHeaders($vuetify.breakpoint.xsOnly)"
    class="job-table scrollbar ask-anna-table ask-anna-table--with-links jobs"
    @item-expanded="handleExpand"
    @click:row="handleJobClick"
  >
    <template v-slot:top v-if="!$vuetify.breakpoint.xsOnly">
      <AskAnnaCard flat>
        <AskAnnaCardText>
          A job is a command or a set of commands you want to run in AskAnna. You can use jobs to handle data, get a
          prediction, train a model, et cetera.
          <a
            class="app-link text-decoration-none primary--text font-weight-medium d-inline-block"
            href="https://docs.askanna.io/jobs/"
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
        <AskAnnaLoadingProgress v-if="item.runs.count" :loading="loading">
          <Runs
            :items="runs"
            :count="count"
            :height="calcSubHeight"
            :loading="runsLoading"
            :tableClass="'job-sub-table'"
            @onChangeParams="params => handleChangeParams({ suuid: item.suuid, params })"
          />
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
        <ask-anna-alert-status :statusData="item.runs.status" />
      </RouterLink>
    </template>

    <template v-slot:no-data>
      For this project, there are no jobs configured. Check
      <a class="ask-anna-link" href="https://docs.askanna.io/jobs/create-job/" target="_blank">the documentation</a>
      on how you can create a job.
    </template>
  </VDataTable>
</template>

<script setup lang="ts">
import { JobsListHeaders } from '../helper'

defineProps({
  jobList: {
    type: Array,
    default: () => []
  }
})

const runsStore = useRunsStore()
const { route, routerPush } = useRouterAskAnna()

const expanded = ref([])
const loading = ref(true)
const currentJob = ref(true)

const count = computed(() => runsStore.runs.count)
const runs = computed(() => runsStore.runs.results)
const runsLoading = computed(() => runsStore.runsLoading)

const calcSubHeight = computed(() => {
  const rowHeight = 64
  const countItems = count.value
  const subRowHeiht = countItems >= 5 ? 280 : countItems * rowHeight + 70

  return subRowHeiht
})

const getHeaders = (isMobile: boolean) =>
  isMobile ? JobsListHeaders(isMobile).filter(el => el.isShowOnMobile) : JobsListHeaders(isMobile)

const handleJobClick = item => {
  routerPush({
    name: 'workspace-project-job-overiew',
    params: { ...route.params, jobId: item.suuid || 'jobname' }
  })
}

const handleExpand = async ({ item }) => {
  loading.value = true

  currentJob.value = item
  await runsStore.getRuns({ suuid: item.suuid, params: { offset: 0, limit: 5 } })

  loading.value = false
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

const handleChangeParams = async ({ suuid, params }) => {
  await runsStore.getRuns({
    suuid,
    params
  })
}
</script>

<style lang="scss">
.job-table tr {
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
