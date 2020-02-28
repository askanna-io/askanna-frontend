<template>
  <v-row align="center" justify="center" class="login-wrapper">
    <v-col cols="12" class="pt-0">
      <v-data-table
        :headers="headers"
        :items="list"
        fixed-header
        class="job-table scrollbar"
        single-expand
        :expanded.sync="expanded"
        @item-expanded="handleExpand"
        show-expand
      >
        <template v-slot:expanded-item>
          <td :colspan="8" class="py-5">
            <v-skeleton-loader ref="skeleton" :type="'table-row'" class="mx-auto" :loading="loading">
              <v-data-table
                dense
                fixed-header
                :page.sync="page"
                :headers="headers2"
                :items="runs"
                class="job-sub-table"
                @page-count="pageCount = $event"
              >
                <template v-slot:item.info="{ item }">
                  <v-btn @click="handleJobInfo(item)" class="ma-2" large color="teal" icon>
                    <v-icon>mdi-information-outline</v-icon>
                  </v-btn>
                </template>
                <template v-slot:item.timing="{ item }">
                  <b>Started:</b> &nbsp;{{ $moment(item.created).format(' Do MMMM YYYY, h:mm:ss a') }} <br />
                  <b>Finished:</b> &nbsp;{{ $moment(item.finished).format(' Do MMMM YYYY, h:mm:ss a') }}<br />
                  <b>Duration:</b> &nbsp;{{ runTimeHours(item.created, item.finished) }} seconds<br />
                </template>
              </v-data-table>
            </v-skeleton-loader>
          </td>
        </template>

        <template v-slot:item.uuid>
          NPOBP
        </template>
        <template v-slot:item.status="{ item }">
          {{ item.status && item.status.lastrun.status ? item.status.lastrun.status + ': ' : '' }} Last run
          {{ ago(item.status.lastrun.finished) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-chip-group outlined v-model="selection" mandatory>
            <v-chip outlined label color="success" @click="startJob(item.id)">
              <v-avatar left><v-icon>mdi-play</v-icon></v-avatar
              >start</v-chip
            >
            <v-chip outlined label color="error" @click="stopJob(item.id)"
              >stop<v-avatar right><v-icon>mdi-stop</v-icon></v-avatar></v-chip
            >
          </v-chip-group>
        </template>
        <!-- Comment 
        <template v-slot:item.id="{ item }">
        
          <v-btn :to="`/job/${item.id}`" text>...</v-btn>
        </template>
        -->
      </v-data-table>
      <job-run-results :item="jobResults" />
    </v-col>
  </v-row>
</template>

<script>
import useJobs from '../composition/useJobs'
import useMoment from '@/core/composition/useMoment.js'
import useJobRunResults from '../composition/useJobRunResults'

import useJob from '../../job/composition/useJob'

import JobRunResults from '../components/JobRunResults'

export default {
  name: 'TheJobs',

  components: { JobRunResults },

  setup(props, context) {
    const job = useJob()
    const jobs = useJobs()
    const moment = useMoment(context)

    const jobRunResult = useJobRunResults()

    return {
      ...job,
      ...jobs,
      ...moment,
      ...jobRunResult
    }
  },

  data() {
    return {
      currentJob: null,
      loading: true,
      openD: false,
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
          text: 'Information',
          align: 'start',
          sortable: false,
          value: 'info'
        },
        { text: 'Status', value: 'status' },
        { text: 'Timing', value: 'timing' },
        { text: 'CPU time', value: 'runtime' },
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
      await this.getRunsJob(item.id)
      this.loading = false
    },
    onStick(data) {
      this.sticked = data.sticked
    }
  }
}
</script>

<style>
.job-table .v-data-table__wrapper {
  max-height: 500px;
}
.job-sub-table .v-data-table__wrapper {
  max-height: 200px;
}
.job-sub-table .v-data-table__wrapper tr th {
  z-index: 1;
}

.job-table .v-data-table__expanded__row {
  background-color: aliceblue;
}

.v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: none !important;
}

.job-sub-table .v-data-table__wrapper table {
  background: aliceblue;
}

.job-sub-table table .v-data-table-header tr th {
  background-color: beige !important;
}
</style>
