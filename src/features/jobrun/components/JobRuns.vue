<template>
  <v-data-table
    fixed-header
    :items="items"
    :height="height"
    :page.sync="page"
    :headers="headers"
    :class="tableClass"
    :options="{ itemsPerPage: 5 }"
    @page-count="pageCount = $event"
  >
    <template v-slot:item="{ item }">
      <tr @click="handleClickOnRow(item)">
        <td class="text-start">
          <v-tooltip top>
            <template v-slot:activator="{ on, value }">
              <div v-on="on">
                <v-btn class="px-0" text small>#{{ item.short_uuid.slice(0, 4) }}</v-btn>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn icon text x-small v-on="on" v-show="value" @click.stop="handleCopy(item.short_uuid)"
                      ><v-icon>mdi-content-copy</v-icon></v-btn
                    >
                  </template>
                  <span>Copy run UUID</span>
                </v-tooltip>
              </div>
            </template>
            <span>{{ item.short_uuid }}</span>
          </v-tooltip>
        </td>
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
      { text: 'Timing', value: 'timing' },
      { text: 'CPU time  (h:m:s)', value: 'runtime' },
      { text: 'Memory used', value: 'memory' }
    ]

    const handleClickOnRow = value => context.emit('handleClickOnRow', value)

    const handleCopy = id => {
      context.root.$copyText(id).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
        }
      )
    }

    return {
      ...moment,
      headers,
      pageCount,
      handleCopy,
      handleClickOnRow
    }
  }
})
</script>
