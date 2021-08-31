<template>
  <v-data-table
    :hide-default-header="!items.length"
    :items="items"
    :headers="headers"
    :options="{ itemsPerPage: -1 }"
    fixed-header
    hide-default-footer
    class="job-table scrollbar cursor--pointer ask-anna-table ask-anna-table--with-links"
  >
    <template v-slot:item.type="{ item }">
      <router-link class="table-link table-link--unformated" :to="getRoutePath(item)">
        <v-icon v-if="item.is_dir">
          mdi-folder
        </v-icon>
        <v-icon v-else>
          {{ FileIcons[item.ext] }}
        </v-icon>
      </router-link>
    </template>
    <template v-slot:item.name="{ item }">
      <router-link class="table-link table-link--unformated" :to="getRoutePath(item)">
        {{ item.name }}
      </router-link>
    </template>
    <template v-slot:item.last_modified="{ item }">
      <router-link class="table-link table-link--unformated" :to="getRoutePath(item)">
        {{ item.last_modified && $moment(item.last_modified).format(' Do MMMM YYYY, h:mm:ss a') }}
      </router-link>
    </template>
    <template v-slot:item.size="{ item }">
      <router-link class="table-link table-link--unformated" :to="getRoutePath(item)">
        {{ humanizeSize(item.size) }}
      </router-link>
    </template>
    <template v-slot:no-data>
      <v-alert class="ma-4 text-center" dense outlined color="grey">
        {{ noDataAvailable }}
      </v-alert>
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
    },
    getRoutePath: {
      type: Function,
      default: () => ''
    }
  },

  setup(props, context) {
    const moment = useMoment(context)
    const sizeHumanize = useSizeHumanize()

    return {
      ...moment,
      ...sizeHumanize,
      headers,
      FileIcons
    }
  }
})
</script>
