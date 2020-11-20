<template>
  <v-data-table
    show-expand
    fixed-header
    single-expand
    item-key="short_uuid"
    class="job-table scrollbar ask-anna-table ask-anna-table--with-links"
    no-data-text="For this project, there are no jobs configured."
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
            :height="calcSubHeight"
            :tableClass="'job-sub-table'"
            @handleClickOnRow="handleClickOnRow"
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
import useJobStore from '../../job/composition/useJobStore'
import { ref, computed, defineComponent } from '@vue/composition-api'
import useJobRunStore from '../../jobrun/composition/useJobRunStore'
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
    const jobStore = useJobStore()
    const moment = useMoment(context)
    const { height } = useWindowSize()
    const jobRunStore = useJobRunStore()

    const expanded = ref([])
    const selection = ref(2)
    const loading = ref(true)
    const currentJob = ref(true)

    const calcSubHeight = computed(() => {
      const rowHeight = 64
      const countItems = jobRunStore.runs.value.length
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

      await jobRunStore.getRunsJob(item.short_uuid)
      loading.value = false
    }

    const handleClickOnRow = item => {
      context.root.$router.push({
        name: 'workspace-project-jobs-job-jobrun-input',
        params: {
          ...context.root.$route.params,
          jobRunId: item.short_uuid,
          jobId: currentJob.value.short_uuid || 'jobname'
        }
      })
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

    return {
      height,
      loading,
      expanded,
      selection,
      calcSubHeight,
      ...moment,
      ...jobStore,
      ...jobRunStore,
      JobsListHeaders,
      routeLinkParams,
      handleExpand,
      handleJobClick,
      handleClickOnRow
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
