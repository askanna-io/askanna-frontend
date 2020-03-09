<template>
  <v-row align="center" justify="center" class="login-wrapper">
    <v-col cols="12" class="pt-0">
      <v-data-table
        dense
        fixed-header
        :page.sync="page"
        :headers="headers2"
        :items="packageHistory"
        class="job-sub-table"
        @page-count="pageCount = $event"
      >
        <template v-slot:top>
          <v-subheader>Package history</v-subheader>
        </template>
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
    </v-col>
  </v-row>
</template>

<script>
import { createComponent } from '@vue/composition-api'

import useMoment from '@/core/composition/useMoment.js'

export default createComponent({
  name: 'ThePackages',

  setup(props, context) {
    const moment = useMoment(context)

    return {
      ...moment
    }
  },

  data() {
    return {
      list: [
        {
          name: 'MyGreatPackage',
          date: '10 feb 2020',
          author: 'Evan You'
        }
      ],

      packageHistory: [
        {
          name: 'MyGreatPackage',
          date: '10 feb 2020',
          author: 'Evan You'
        }
      ],

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
        { text: 'Modified', value: 'uuid' },
        { text: 'Author', value: 'author' }
      ],

      headers2: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Modified', value: 'uuid' },
        { text: 'By', value: 'author' }
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
      /*     this.currentJob = item
      await this.getRunsJob(item.id) */
      this.loading = false
    },
    onStick(data) {
      this.sticked = data.sticked
    }
  }
})
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
