<template>
  <v-data-table
    fixed-header
    class="job-runs-table ask-anna-table ask-anna-table--with-links"
    :items="items"
    :height="height"
    :page.sync="page"
    :headers="headers"
    :class="tableClass"
    :options="{ itemsPerPage: 5 }"
    @page-count="pageCount = $event"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td class="text-start">
          <router-link class="table-link table-link--unformated" :to="routeLinkParams(item)">
            <v-tooltip top>
              <template v-slot:activator="{ on, value }">
                <div v-on="on">
                  <v-btn class="px-0" text small>#{{ item.short_uuid.slice(0, 4) }}</v-btn>
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-btn icon text x-small v-on="on" v-show="value" @click.prevent="handleCopy(item.short_uuid)"
                        ><v-icon>mdi-content-copy</v-icon></v-btn
                      >
                    </template>
                    <span>Copy run UUID</span>
                  </v-tooltip>
                </div>
              </template>
              <span>{{ item.short_uuid }}</span>
            </v-tooltip>
          </router-link>
        </td>
        <td class="text-start">
          <router-link class="table-link table-link--unformated" :to="routeLinkParams(item)">
            <ask-anna-chip-status :status="item.status" />
          </router-link>
        </td>
        <td class="text-start">
          <router-link class="table-link table-link--unformated" :to="routeLinkParams(item)">
            <b>Started:</b> &nbsp;{{ $moment(item.created).format(' Do MMMM YYYY, h:mm:ss a') }}
            <br />
            <b>Duration:</b> &nbsp;{{ calculateDuration(item) }}<br />
          </router-link>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import useMoment from '@/core/composition/useMoment'
import useSnackBar from '@/core/components/snackBar/useSnackBar'

import { ref, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRuns',

  props: {
    items: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: () => 300
    },
    page: {
      type: Number,
      default: () => 0
    },
    tableClass: {
      type: String,
      default: () => ''
    },
    routeName: {
      type: String,
      default: () => ''
    }
  },

  setup(props, context) {
    const snackBar = useSnackBar()
    const moment = useMoment(context)

    const pageCount = ref(0)
    const headers = [
      {
        text: 'Run',
        sortable: false,
        value: 'info',
        width: '10%'
      },
      { text: 'Status', value: 'status' },
      { text: 'Timing', value: 'runtime' }
    ]

    const handleClickOnRow = value => context.emit('handleClickOnRow', value)

    const handleCopy = id => {
      context.root.$copyText(id).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'failed' })
        }
      )
    }

    const calculateDuration = item => {
      const currentTime = new Date().toTimeString()
      if (['PENDING', 'IN_PROGRESS', 'SUBMITTED'].indexOf(item.status) !== -1) {
        return moment.duratioHumanize(item.created, moment.$moment())
      }

      if (['COMPLETED', 'SUCCESS', 'FAILURE', 'FAILED'].indexOf(item.status) !== -1) {
        return moment.duratioHumanize(item.created, item.modified)
      }
      return ''
    }

    const routeLinkParams = item => {
      return {
        name: 'workspace-project-jobs-job-jobrun-input',
        params: {
          ...context.root.$route.params,
          jobRunId: item.short_uuid,
          jobId: item.jobdef.short_uuid
        }
      }
    }

    return {
      ...moment,
      headers,
      pageCount,
      handleCopy,
      routeLinkParams,
      handleClickOnRow,
      calculateDuration
    }
  }
})
</script>
