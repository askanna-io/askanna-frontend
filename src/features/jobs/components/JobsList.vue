<template>
  <v-data-table
    show-expand
    fixed-header
    single-expand
    item-key="short_uuid"
    no-data-text="For this project, there are no jobs configured."
    class="job-table scrollbar ask-anna-table ask-anna-table--with-links"
    :items="jobList"
    :expanded.sync="expanded"
    :headers="JobsListHeaders"
    @item-expanded="handleExpand"
    @click:row="handleJobClick"
  >
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
      <router-link class="table-link table-link--unformated" :to="routeLinkParams(item)">
        <ask-anna-alert-status :statusData="item.runs.status" />
      </router-link>
    </template>
    <template v-slot:item.actions="{ item }" v-if="isNotBeta">
      <v-chip-group outlined v-model="selection" mandatory>
        <v-chip outlined label class="askaanna-chip-status" color="success" @click.stop="startJob(item.short_uuid)">
          <v-avatar left><v-icon>mdi-play</v-icon></v-avatar
          >start</v-chip
        >
        <v-chip outlined label color="error" @click.stop="stopJob(item.short_uuid)"
          >stop<v-avatar right><v-icon>mdi-stop</v-icon></v-avatar></v-chip
        >
      </v-chip-group>
    </template>
  </v-data-table>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import { JobsListHeaders } from '../utils/index'
import JobRuns from '@jobrun/components/JobRuns'
import useMoment from '@/core/composition/useMoment'
import useJobRunStore from '../../jobrun/composition/useJobRunStore'
import { ref, computed, defineComponent } from '@vue/composition-api'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress'

export default defineComponent({
  name: 'JobList',

  components: {
    JobRuns,
    AskAnnaLoadingProgress
  },

  props: {
    jobList: {
      type: Array,
      default: () => []
    }
  },

  setup(props, context) {
    const moment = useMoment(context)
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

    const handleJobClick = item => {
      context.root.$router.push({
        name: 'workspace-project-job-overiew',
        params: { ...context.root.$route.params, jobId: item.short_uuid || 'jobname' }
      })
    }

    const handleExpand = async ({ item, value }) => {
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
      JobsListHeaders,
      routeLinkParams,

      handleExpand,
      handleJobClick,
      handleChangeParams
    }
  }
})
</script>

<style>
.job-table tr {
  cursor: pointer;
}
.job-sub-table .v-data-table__wrapper tr th {
  z-index: 1;
}
.theme--light.v-data-table .v-data-footer {
  border: none;
}

.v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: none !important;
}

.job-table a {
  text-decoration: none;
  display: block;
  color: inherit;
}
</style>
