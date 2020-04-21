<template>
  <v-data-table
    show-expand
    fixed-header
    single-expand
    item-key="short_uuid"
    class="job-table scrollbar"
    :items="jobList"
    :height="calcHeight"
    :expanded.sync="expanded"
    :headers="JobsListHeaders"
    @item-expanded="handleExpand"
    @click:row="handleJobClick"
  >
    <template v-slot:expanded-item>
      <td :colspan="8" class="pa-0">
        <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="loading">
          <job-runs
            :items="runs"
            :height="calcSubHeight"
            :tableClass="'job-sub-table'"
            @handleClickOnRow="handleClickOnRow"
          />
        </v-skeleton-loader>
      </td>
    </template>

    <template v-slot:item.uuid>
      NPOBP
    </template>

    <template v-slot:item.status="{ item }">
      <ask-anna-alert-status :statusData="item.status && item.status.lastrun" />
    </template>
    <template v-slot:item.actions="{ item }">
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
import { JobsListHeaders } from '../utils/index'
import { useWindowSize } from '@u3u/vue-hooks'
import JobRuns from '@jobrun/components/JobRuns'
import { defineComponent } from '@vue/composition-api'
import useMoment from '@/core/composition/useMoment.js'
import useJobStore from '../../job/composition/useJobStore'
import useJobRunStore from '../../jobrun/composition/useJobRunStore'

export default defineComponent({
  name: 'JobList',

  components: {
    JobRuns
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

    const handleJobClick = item => {
      context.root.$router.push({
        name: 'workspace-project-job-overiew',
        params: { ...context.root.$route.params, jobId: item.short_uuid || 'jobname' }
      })
    }

    return {
      height,
      ...moment,
      ...jobStore,
      ...jobRunStore,
      JobsListHeaders,
      handleJobClick
    }
  },

  data() {
    return {
      currentJob: null,
      loading: true,
      jobResults: {
        name: '',
        runtime: '',
        memory: '',
        return_payload: ''
      },
      page: 1,
      pageCount: 2,
      itemsPerPage: 10,
      expanded: [],
      singleExpand: false,
      selection: 2,

      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Runs', value: 'uuid' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions' }
      ]
    }
  },

  computed: {
    sticked: {
      get() {
        return this.stickedVal
      },
      set(val) {
        this.stickedVal = val
      }
    },
    calcHeight() {
      return this.height - 450
    },
    calcSubHeight() {
      const countItems = this.runs.length
      const rowHeight = 64
      const subRowHeiht = countItems >= 5 ? 368 : countItems * rowHeight + 70

      return subRowHeiht
    }
  },

  methods: {
    async handleJobInfo(jobResults) {
      this.jobResults = { ...this.currentJob, ...jobResults }

      this.showJobRunResult()
    },
    async handleExpand({ item, value }) {
      this.loading = true
      if (!value) return
      this.currentJob = item

      await this.getRunsJob(item.short_uuid)

      this.loading = false
    },
    onStick(data) {
      this.sticked = data.sticked
    },
    handleClickOnRow(item) {
      this.$router.push({
        name: 'workspace-project-jobs-name-uuid',
        params: { ...this.$route.params, jobRunId: item.uuid, jobId: this.currentJob.short_uuid || 'jobname' }
      })
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
</style>
