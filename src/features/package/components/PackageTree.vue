<template>
  <VDataTable
    fixed-header
    :items="items"
    hide-default-footer
    :mobile-breakpoint="0"
    :custom-sort="handleSort"
    :options="{ itemsPerPage: -1 }"
    :hide-default-header="!items.length"
    :headers="getHeaders($vuetify.breakpoint.xsOnly)"
    class="job-table scrollbar ask-anna-table ask-anna-table--with-links file-list"
  >
    <template v-slot:item.type="{ item }">
      <RouterLink
        class="table-link table-link--unformated"
        :to="getRoutePath(item)"
      >
        <AskAnnaIcon v-if="item.type === 'directory'">mdi-folder</AskAnnaIcon>
        <AskAnnaIcon v-else>
          {{ getIcons(item.ext) }}
        </AskAnnaIcon>
      </RouterLink>
    </template>
    <template v-slot:item.name="{ item }">
      <RouterLink
        class="table-link table-link--unformated"
        :to="getRoutePath(item)"
      >
        {{ item.name }}
      </RouterLink>
    </template>
    <template v-slot:item.last_modified="{ item }">
      <RouterLink
        class="table-link table-link--unformated"
        :to="getRoutePath(item)"
      >
        {{ item.last_modified ? getUpdateDate($vuetify.breakpoint.xsOnly, item.last_modified) : '' }}
      </RouterLink>
    </template>
    <template v-slot:item.size="{ item }">
      <RouterLink
        class="table-link table-link--unformated"
        :to="getRoutePath(item)"
      >
        {{ sizeHumanize.humanizeSize(item.size) }}
      </RouterLink>
    </template>
    <template v-slot:no-data>
      <AskAnnaAlert
        class="ma-4 text-center"
        dense
        outlined
      >
        {{ noDataAvailable }}
      </AskAnnaAlert>
    </template>
  </VDataTable>
</template>

<script setup lang="ts">
import { get } from 'lodash'
import { headers, FileIcons } from '../utils/index'

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

const dayjs = useDayjs()
const sizeHumanize = useSizeHumanize()

// we need custom sort to always have: [back parent folder] item in top of list
const handleSort = (items, sortBy, sortDesc) => {
  if (sortBy.length === 1 && sortDesc.length === 1) {
    items.sort((a, b) => {
      const sortA = a[sortBy[0]]
      const sortB = b[sortBy[0]]

      // sort fort date type
      if (sortBy[0] === 'last_modified') {
        if (!sortDesc[0]) {
          return new Date(sortB) - new Date(sortA)
        } else {
          return new Date(sortA) - new Date(sortB)
        }
      }

      if (sortDesc[0]) {
        if (sortA < sortB) return 1
        if (sortA > sortB) return -1
        return 0
      } else {
        if (sortA < sortB) return -1
        if (sortA > sortB) return 1
        return 0
      }
    })

    const findParaentItem = item => item?.ext === 'parent'

    const parentIndex = items.findIndex(findParaentItem)
    if (parentIndex !== -1) {
      items.unshift(items.splice(parentIndex, 1)[0])
    }
  }

  return items
}

const getIcons = (ext: string) => get(FileIcons, ext) || (ext !== 'parent' ? 'mdi-file-outline' : '')

const getHeaders = (isMobile: boolean) => (isMobile ? headers.filter(el => el.isShowOnMobile) : headers)

const getUpdateDate = (isMobile: boolean, lastModified: string) =>
  isMobile ? dayjs.ago(lastModified) : dayjs.dayjs(lastModified).format(' Do MMMM YYYY, h:mm:ss a')
</script>

<style lang="scss">
.mobile-view {
  .file-list {

    table>thead>tr>th,
    table tr>td {
      padding: 0 8px !important;
    }
  }
}
</style>
