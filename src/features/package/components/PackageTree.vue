<template>
  <v-data-table
    :items="items"
    :headers="headers"
    :options="{ itemsPerPage: -1 }"
    fixed-header
    hide-default-footer
    class="job-table scrollbar cursor--pointer"
    @click:row="clickOnRow"
  >
    <template v-slot:item.type="{ item }">
      <v-icon v-if="item.is_dir">
        mdi-folder
      </v-icon>
      <v-icon v-else>
        {{ FileIcons[item.ext] }}
      </v-icon>
    </template>
    <template v-slot:item.last_modified="{ item }">
      {{ item.last_modified && $moment(item.last_modified).format(' Do MMMM YYYY, h:mm:ss a') }}
    </template>
    <template v-slot:item.size="{ item }">
      {{ humanizeSize(item.size) }}
    </template>
    <template v-slot:no-data>
      {{ noDataAvailable }}
    </template>
  </v-data-table>
</template>

<script>
import { headers, FileIcons } from '../utils/index'
import useMoment from '@/core/composition/useMoment'
import { defineComponent } from '@vue/composition-api'
import useSizeHumanize from '@/core/composition/useSizeHumanize'

export default defineComponent({
  name: 'PackageTree',

  props: {
    items: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: 300
    },
    noDataAvailable: {
      type: String,
      default: () => 'No data available'
    }
  },

  setup(props, context) {
    const moment = useMoment(context)
    const sizeHumanize = useSizeHumanize()

    const clickOnRow = item => context.emit('clickOnRow', item)

    return {
      ...moment,
      ...sizeHumanize,
      headers,
      FileIcons,
      clickOnRow
    }
  }
})
</script>
