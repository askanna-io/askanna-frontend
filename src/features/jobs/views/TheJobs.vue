<template>
  <v-row align="center" justify="center" class="login-wrapper">
    <v-col cols="12" class="pt-0">
      <v-data-table
        :headers="headers"
        :items="list"
        fixed-header
        class="job-table scrollbar"
        :expanded.sync="expanded"
        @item-expanded="handleExpand"
        show-expand
      >
        <template v-slot:expanded-item>
          <td :colspan="8">
            <v-data-table
              dense
              fixed-header
              :page.sync="page"
              :headers="headers2"
              :items="runs"
              :items-per-page="5"
              :footer-props="{
                disableItemsPerPage: false
              }"
              class="job-sub-table mx-5"
              @page-count="pageCount = $event"
            >
              <template v-slot:item.info="{ item }">
                <v-btn @click="handleJobInfo(item)" class="ma-2" large color="teal" icon>
                  <v-icon>mdi-information-outline</v-icon>
                </v-btn>
              </template>
              <template v-slot:item.timing="{ item }">
                {{ item.created }}
                {{ item.finished }}
                duration
              </template>
            </v-data-table>
          </td>
        </template>

        <template v-slot:item.uuid>
          NPOBP
        </template>
        <template v-slot:item.status="{ item }">
          {{ item.status }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-chip-group outlined v-model="selection" mandatory>
            <v-chip outlined label color="primary" @click="startJob(item.id)">
              <v-avatar left><v-icon>mdi-play</v-icon></v-avatar
              >start</v-chip
            >
            <v-chip outlined label color="error" @click="stopJob(item.id)"
              >stop<v-avatar right><v-icon>mdi-stop</v-icon></v-avatar></v-chip
            >
          </v-chip-group>
        </template>
        <template v-slot:item.id="{ item }">
          <v-btn :to="`job/${item.id}`" text>...</v-btn>
        </template>
      </v-data-table>
      <job-run-results :item="jobResults" />
    </v-col>
  </v-row>
</template>

<script>
import useJobs from '../composition/useJobs'
import useJobRunResults from '../composition/useJobRunResults'

import useJob from '../../job/composition/useJob'

import JobRunResults from '../components/JobRunResults'

export default {
  name: 'TheJobs',

  components: { JobRunResults },

  setup() {
    const job = useJob()
    const jobs = useJobs()
    const jobRunResult = useJobRunResults()

    return {
      ...job,
      ...jobs,
      ...jobRunResult
    }
  },

  data() {
    return {
      currentJob: null,
      openD: false,
      jobResults: null,
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
        { text: 'Actions', value: 'actions' },
        { text: '', value: 'id' }
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
        { text: 'CPU time', value: 'cputime' },
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
      console.log(this.jobResults)
      this.showJobRunResult()
    },
    handleExpand({ item, value }) {
      console.log(item, value)
      if (!value) return
      this.currentJob = item
      this.getRunsJob(item.id)
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

.job-sub-table .v-data-table__wrapper table {
  background: aliceblue;
}
</style>
