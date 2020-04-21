<template>
  <v-data-table
    :items="items"
    :headers="headers"
    :height="height"
    :options="{ itemsPerPage: -1 }"
    fixed-header
    hide-default-footer
    class="job-table scrollbar"
    @click:row="clickOnRow"
  >
    <template v-slot:top>
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" exact>
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <v-divider />
    </template>
    <template v-slot:item.type="{ item }">
      <v-icon v-if="item.is_dir">
        mdi-folder
      </v-icon>
      <v-icon v-else>
        {{ FileIcons[item.ext] }}
      </v-icon>
    </template>
    <template v-slot:item.last_modified="{ item }">
      {{ $moment(item.last_modified).format(' Do MMMM YYYY, h:mm:ss a') }}
    </template>
  </v-data-table>
</template>

<script>
import { headers, FileIcons } from '../utils/index'
import { defineComponent } from '@vue/composition-api'
import useMoment from '@/core/composition/useMoment.js'

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
    breadcrumbs: {
      type: Array,
      default: () => []
    }
  },

  setup(props, context) {
    const moment = useMoment(context)
    const clickOnRow = item => context.emit('clickOnRow', item)

    return {
      ...moment,
      headers,
      FileIcons,
      clickOnRow
    }
  }
})
</script>
