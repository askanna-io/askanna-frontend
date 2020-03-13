<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0">
      <v-data-table
        fixed-header
        :page.sync="page"
        :headers="headers"
        :items="packageHistory"
        class="j21"
        @page-count="pageCount = $event"
        @click:row="handleClickRow"
      >
        <template v-slot:top>
          <v-breadcrumbs :items="items">
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :to="item.to" :disabled="item.disabled" exact>
                {{ item.text }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
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
      items: [
        {
          text: 'Packages',
          disabled: false,
          to: '/workspace/project/1/packages/'
        },
        {
          text: 'Package - #1',
          disabled: false,
          to: '/workspace/project/1/packages/1'
        },
        {
          text: 'History',
          disabled: true,
          to: '/workspace/project/1/packages/1/hystory'
        }
      ],

      packageHistory: [
        {
          name: 'MyGreatPackage',
          date: '12 feb 2020',
          author: 'Evan You',
          id: 2
        },
        {
          name: 'MyGreatPackage',
          date: '10 feb 2020',
          author: 'Evan You',
          id: 1
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
        { text: 'Version', value: 'id' },
        { text: 'Modified', value: 'date' },
        { text: 'Author', value: 'author' }
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
    handleClickRow({ id }) {
      this.$router.push({
        name: 'workspace-project-packages-uuid-version-uuid',
        params: { projectId: '1', packageId: '1', versionId: id }
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
