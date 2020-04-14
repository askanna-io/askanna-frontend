<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pa-0">
      <v-data-table
        :headers="headers"
        :items="jobList"
        fixed-header
        class="job-table scrollbar"
        single-expand
        :expanded.sync="expanded"
        :height="calcHeight"
        item-key="short_uuid"
        @item-expanded="handleExpand"
        @click:row="handleJobClick"
        show-expand
      >
        <template v-slot:expanded-item>
          <td :colspan="8" class="pa-0">
            <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="loading">
              <v-data-table
                fixed-header
                :page.sync="page"
                :headers="headers2"
                :items="runs"
                :height="calcSubHeight"
                :options="{ itemsPerPage: 5 }"
                class="job-sub-table"
                @page-count="pageCount = $event"
              >
                <template v-slot:item="{ item, index }">
                  <tr @click="handleClickOnRow(item)">
                    <td class="text-start">#{{ index }}</td>
                    <td class="text-start">
                      <ask-anna-chip-status :status="item.status" />
                    </td>
                    <td class="text-start">{{ seconds(item.runtime) }}</td>
                    <td class="text-start">
                      <b>Started:</b> &nbsp;{{ $moment(item.created).format(' Do MMMM YYYY, h:mm:ss a') }} <br />
                      <b>Finished:</b> &nbsp;{{ $moment(item.finished).format(' Do MMMM YYYY, h:mm:ss a') }}<br />
                      <b>Duration:</b> &nbsp;{{ runTimeHours(item.created, item.finished) }} seconds<br />
                    </td>
                    <td class="text-start">
                      {{ item.memory }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
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
            <v-chip outlined label class="askaanna-chip-status" color="success" @click="startJob(item.short_uuid)">
              <v-avatar left><v-icon>mdi-play</v-icon></v-avatar
              >start</v-chip
            >
            <v-chip outlined label color="error" @click="stopJob(item.short_uuid)"
              >stop<v-avatar right><v-icon>mdi-stop</v-icon></v-avatar></v-chip
            >
          </v-chip-group>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { createComponent } from '@vue/composition-api'

import { useWindowSize } from '@u3u/vue-hooks'
import useJobStore from '../../job/composition/useJobStore'
import useJobRunStore from '../../jobrun/composition/useJobRunStore'

import useMoment from '@/core/composition/useMoment.js'

export default createComponent({
  name: 'TheJobs',

  props: {
    jobList: {
      type: Array,
      default: () => []
    }
  },

  setup(props, context) {
    const jobStore = useJobStore()
    const jobRunStore = useJobRunStore()
    const moment = useMoment(context)
    const { height } = useWindowSize()

    const handleJobClick = item => {
      context.root.$router.push({
        name: 'workspace-project-jobId',
        params: { ...context.root.$route.params, jobId: item.short_uuid || 'jobname' }
      })
    }

    return {
      height,
      ...moment,
      ...jobStore,
      ...jobRunStore,
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
      ],

      headers2: [
        {
          text: 'Run',
          sortable: false,
          value: 'info'
        },
        { text: 'Status', value: 'status' },
        { text: 'Timing', value: 'timing' },
        { text: 'CPU time  (h:m:s)', value: 'runtime' },
        { text: 'Memory used', value: 'memory' }
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
        params: { ...this.$route.params, jobRunId: item.uuid, jobName: this.currentJob.name || 'jobname' }
      })
    }
  }
})
</script>

<style>
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
