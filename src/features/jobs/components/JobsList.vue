<template>
  <v-data-table
    fixed-header
    single-expand
    :items="jobList"
    item-key="short_uuid"
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
      <v-card flat>
        <v-card-text>
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
        </v-card-text>
      </v-card>
    </template>
    <template v-slot:expanded-item="{ item }">
      <td :colspan="8" class="pa-0">
        <ask-anna-loading-progress v-if="item.runs.count" :type="'table-row'" :loading="loading">
          <job-runs
            :items="runs"
            :count="count"
            :height="calcSubHeight"
            :loading="jobRunsLoading"
            :tableClass="'job-sub-table'"
            @onChangeParams="params => handleChangeParams({ uuid: item.short_uuid, params })"
          />
        </ask-anna-loading-progress>

        <div v-else class="ma-2 text-center">No runs yet</div>
      </td>
    </template>

    <template v-slot:item.name="{ item }">
      <router-link class="table-link table-link--unformated" :to="routeLinkParams(item)">
        {{ item.name }}
      </router-link>
    </template>

    <template v-slot:item.uuid="{ item }">
      <router-link class="table-link table-link--unformated" :to="routeLinkParams(item)">
        {{ item.runs.count }}
      </router-link>
    </template>

    <template v-slot:item.status="{ item }">
      <router-link class="table-link table-link--unformated alert" :to="routeLinkParams(item)">
        <ask-anna-alert-status :statusData="item.runs.status" />
      </router-link>
    </template>

    <template v-slot:no-data>
      For this project, there are no jobs configured. Check
      <a class="ask-anna-link" href="https://docs.askanna.io/jobs/create-job/" target="_blank">the documentation</a>
      on how you can create a job.
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { useWindowSize } from '@u3u/vue-hooks'
import { JobsListHeaders } from '../utils/index'
import useMoment from '@/core/composition/useMoment'
import JobRuns from '@/features/jobrun/components/JobRuns.vue'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useJobRunStore from '../../jobrun/composition/useJobRunStore'
import { ref, computed, defineComponent } from '@vue/composition-api'
import AskAnnaAlertStatus from '@/core/components/shared/AskAnnaAlertStatus.vue'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

export default defineComponent({
  name: 'JobList',

  components: {
    JobRuns,
    AskAnnaAlertStatus,
    AskAnnaLoadingProgress
  },

  props: {
    jobList: {
      type: Array,
      default: () => []
    }
  },

  setup(_, context) {
    const moment = useMoment()
    const router = useRouterAskAnna()
    const { height } = useWindowSize()
    const jobRunStore = useJobRunStore()

    const expanded = ref([])
    const selection = ref(2)
    const loading = ref(true)
    const currentJob = ref(true)

    const count = computed(() => jobRunStore.runs.value.count)
    const runs = computed(() => jobRunStore.runs.value.results)
    const jobRunsLoading = computed(() => jobRunStore.jobRunsLoading.value)

    const calcSubHeight = computed(() => {
      const rowHeight = 64
      const countItems = count.value
      const subRowHeiht = countItems >= 5 ? 280 : countItems * rowHeight + 70

      return subRowHeiht
    })

    const getHeaders = (isMobile: boolean) =>
      isMobile ? JobsListHeaders(isMobile).filter(el => el.isShowOnMobile) : JobsListHeaders(isMobile)

    const handleJobClick = item => {
      router.push({
        name: 'workspace-project-job-overiew',
        params: { ...context.root.$route.params, jobId: item.short_uuid || 'jobname' }
      })
    }

    const handleExpand = async ({ item }) => {
      loading.value = true

      currentJob.value = item
      await jobRunStore.getRunsJob({ uuid: item.short_uuid, params: { offset: 0, limit: 5 } })

      loading.value = false
    }

    const routeLinkParams = item => {
      return {
        name: 'workspace-project-job-overiew',
        params: {
          ...context.root.$route.params,
          jobId: item.short_uuid
        }
      }
    }

    const handleChangeParams = async ({ uuid, params }) => {
      await jobRunStore.getRunsJob({
        uuid,
        params
      })
    }

    return {
      runs,
      count,
      height,
      loading,
      expanded,
      selection,
      calcSubHeight,
      jobRunsLoading,
      ...moment,
      getHeaders,
      routeLinkParams,

      handleExpand,
      handleJobClick,
      handleChangeParams
    }
  }
})
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
