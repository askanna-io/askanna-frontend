<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0">
      <v-data-table :headers="headers" :items="list" @click:row="handleClickRow" fixed-header class="j21">
        <template v-slot:top>
          <v-subheader>Packages</v-subheader>
        </template>

        <template v-slot:item.uuid="{ item }">
          <v-chip outlined label color="primary" @click="startJob(item.id)">
            <v-avatar left><v-icon>mdi-cloud-download</v-icon></v-avatar
            >Download</v-chip
          >
        </template>

        <template v-slot:item.menu="{ item }">
          <v-menu bottom color="primary" :close-on-content-click="false" :nudge-width="200" offset-x :key="item.name">
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" color="primary">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="handleHistory">
                <v-list-item-title>History</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
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
          author: 'Evan You',
          uuid: '1'
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
          value: 'name'
        },
        { text: 'Modified', value: 'date' },
        { text: '', value: 'uuid', sortable: false },
        { text: '', value: 'menu' }
      ],

      headers2: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Modified', value: 'uuid' },
        { text: 'By', value: 'author' },
        { text: '', value: 'menu' }
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
    handleHistory() {
      this.$router.push({
        name: 'workspace-project-packages-uuid-history',
        params: { projectId: '1', packageId: '1', versionId: '1' }
      })
    },
    handleClickRow() {
      this.$router.push({
        name: 'workspace-project-packages-uuid-version-uuid',
        params: { projectId: '1', packageId: '1', versionId: '1' }
      })
    },
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

<style scoped>
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
