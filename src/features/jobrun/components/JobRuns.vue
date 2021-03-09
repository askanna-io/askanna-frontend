<template>
  <v-data-table
    fixed-header
    class="job-runs-table ask-anna-table ask-anna-table--with-links"
    :items="items"
    :page.sync="page"
    :loading="loading"
    :headers="headers"
    :class="tableClass"
    :options.sync="options"
    :server-items-length="count"
    @page-count="pageCount = $event"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td class="text-start">
          <router-link class="table-link table-link--unformated" :to="routeLinkParams({ item })">
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
          <router-link class="table-link table-link--unformated" :to="routeLinkParams({ item })">
            <ask-anna-chip-status :status="item.status" />
          </router-link>
        </td>
        <td class="text-start">
          <router-link class="table-link table-link--unformated" :to="routeLinkParams({ item })">
            <b>Started:</b> &nbsp;{{ $moment(item.created).format(' Do MMMM YYYY, h:mm:ss a') }}
            <br />
            <b>Duration:</b> &nbsp;{{ calculateDuration(item) }}<br />
          </router-link>
        </td>
        <td class="text-start">
          <router-link class="table-link table-link--unformated" :to="routeLinkParams({ item })">
            {{ getPayloadTitle(item.payload) }}
          </router-link>
        </td>
        <td class="text-start">
          <router-link
            class="table-link table-link--unformated"
            :to="routeLinkParams({ item, name: 'workspace-project-jobs-job-jobrun-metrics' })"
          >
            {{ getMetricTitle(item.metricsmeta.count) }}
          </router-link>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import useMoment from '@/core/composition/useMoment'
import useSnackBar from '@/core/components/snackBar/useSnackBar'

import { ref, watch, defineComponent } from '@vue/composition-api'
import { metric } from '@/features/metric/store'

export default defineComponent({
  name: 'JobRuns',

  props: {
    count: {
      type: Number,
      default: () => 0
    },
    items: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: () => 300
    },

    tableClass: {
      type: String,
      default: () => ''
    },
    routeName: {
      type: String,
      default: () => ''
    },
    loading: {
      type: Boolean,
      default: () => false
    }
  },

  setup(props, context) {
    const snackBar = useSnackBar()
    const moment = useMoment(context)

    const page = ref(0)

    const options = ref({ itemsPerPage: 5, page: 1 })

    const pageCount = ref(0)
    const headers = [
      {
        text: 'Run',
        sortable: false,
        value: 'info',
        width: '10%',
        class: 'text-left text-subtitle-2 font-weight-bold h-20'
      },
      { text: 'Status', sortable: false, value: 'status', class: 'text-left text-subtitle-2 font-weight-bold h-20' },
      { text: 'Timing', sortable: false, value: 'runtime', class: 'text-left text-subtitle-2 font-weight-bold h-20' },
      {
        text: 'Input',
        sortable: false,
        value: 'payload',
        class: 'text-left text-subtitle-2 font-weight-bold h-20'
      },
      {
        text: 'Metrics',
        sortable: false,
        value: 'metricsmeta',
        class: 'text-left text-subtitle-2 font-weight-bold h-20'
      }
    ]

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

    const routeLinkParams = ({ item, name = 'workspace-project-jobs-job-jobrun-input' }) => {
      return {
        name,
        params: {
          ...context.root.$route.params,
          jobRunId: item.short_uuid,
          jobId: item.jobdef.short_uuid
        }
      }
    }

    const getPayloadTitle = payload => {
      let title = 'No input'
      if (payload.lines >= 1) {
        title = `${payload.lines} line${payload.lines > 1 ? 's' : ''}`
      }
      return title
    }

    const getMetricTitle = count => {
      let title = 'No metrics'
      if (count >= 1) {
        title = `${count} metric${count > 1 ? 's' : ''}`
      }
      return title
    }

    watch(options, async (options, currentOptions) => {
      const { itemsPerPage: limit = 5, page = 1 } = options
      const { itemsPerPage: currentLimit = 5, page: currentPage = 1 } = currentOptions

      if (limit === currentLimit && page === currentPage) return

      const params = {
        limit,
        offset: (page - 1) * limit
      }

      context.emit('onChangeParams', params)
    })

    return {
      ...moment,
      page,
      headers,
      options,
      pageCount,
      handleCopy,
      getMetricTitle,
      getPayloadTitle,
      routeLinkParams,
      calculateDuration
    }
  }
})
</script>
