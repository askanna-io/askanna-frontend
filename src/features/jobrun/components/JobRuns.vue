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
</template>

<script>
import useMoment from '@/core/composition/useMoment'
import { ref, defineComponent, onBeforeMount, computed, watch } from '@vue/composition-api'

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
    const moment = useMoment(context)
    const pageCount = ref(0)

    const headers = [
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

    const handleClickOnRow = value => context.emit('handleClickOnRow', value)
    return {
      ...moment,
      headers,
      pageCount,
      handleClickOnRow
    }
  }
})
</script>
