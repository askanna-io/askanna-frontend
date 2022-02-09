<template>
  <v-data-table
    fixed-header
    :items="items"
    hide-default-footer
    :mobile-breakpoint="0"
    :options="{ itemsPerPage: -1 }"
    :hide-default-header="!items.length"
    :headers="getHeaders($vuetify.breakpoint.xsOnly)"
    class="job-table scrollbar cursor--pointer ask-anna-table ask-anna-table--with-links file-list"
  >
    <template v-slot:item.type="{ item }">
      <router-link class="table-link table-link--unformated" :to="getRoutePath(item)">
        <v-icon v-if="item.is_dir">mdi-folder</v-icon>
        <v-icon v-else>
          {{ getIcons(item.ext) }}
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
        {{ item.last_modified ? getUpdateDate($vuetify.breakpoint.xsOnly, item.last_modified) : '' }}
      </router-link>
    </template>
    <template v-slot:item.size="{ item }">
      <router-link class="table-link table-link--unformated" :to="getRoutePath(item)">
        {{ sizeHumanize.humanizeSize(item.size) }}
      </router-link>
    </template>
    <template v-slot:no-data>
      <v-alert class="ma-4 text-center" dense outlined>
        {{ noDataAvailable }}
      </v-alert>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { get } from 'lodash'
import { headers, FileIcons } from '../utils/index'
import useMoment from '@/core/composition/useMoment'
import useSizeHumanize from '@/core/composition/useSizeHumanize'

defineProps({
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
})

const moment = useMoment()
const sizeHumanize = useSizeHumanize()

const getIcons = (ext: string) => get(FileIcons, ext) || (ext !== 'parent' ? 'mdi-file-outline' : '')

const getHeaders = (isMobile: boolean) => (isMobile ? headers.filter(el => el.isShowOnMobile) : headers)

const getUpdateDate = (isMobile: boolean, lastModified: string) =>
  isMobile ? moment.ago(lastModified) : moment.$moment(lastModified).format(' Do MMMM YYYY, h:mm:ss a')
</script>

<style lang="scss">
.mobile-view {
  .file-list {
    table > thead > tr > th,
    table tr > td {
      padding: 0 8px !important;
    }
  }
}
</style>
