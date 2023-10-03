<template>
  <VDataTable
    fixed-header
    :items="items"
    hide-default-footer
    :mobile-breakpoint="0"
    :custom-sort="handleSort"
    :options="{ itemsPerPage: -1 }"
    :items-per-page="-1"
    class="askanna-table code-tree-table"
    :hide-default-header="!items.length"
    :headers="getHeaders($vuetify.display.xs)"
  >
    <template v-slot:item="{ internalItem }">
      <tr class="pointer hover:bg-third">
        <AskAnnaTableItem :to="getRoutePath(internalItem.raw)">
          <AskAnnaIcon
            v-if="internalItem.raw.type === 'directory'"
            icon="mdi-folder"
            color="secondary"
          />
          <AskAnnaIcon
            v-else
            color="secondary"
            :icon="getIcons(internalItem.raw.ext)"
          />
        </AskAnnaTableItem>
        <AskAnnaTableItem :to="getRoutePath(internalItem.raw)">
          {{ internalItem.raw.name }}
        </AskAnnaTableItem>
        <AskAnnaTableItem
          v-if="!$vuetify.display.xs"
          :to="getRoutePath(internalItem.raw)"
        >
          {{ sizeHumanize.humanizeSize(internalItem.raw.size) }}
        </AskAnnaTableItem>
        <AskAnnaTableItem :to="getRoutePath(internalItem.raw)">
          {{ internalItem.raw.last_modified ? getUpdateDate($vuetify.display.xs, internalItem.raw.last_modified) : '' }}
        </AskAnnaTableItem>
      </tr>
    </template>

    <template v-slot:no-data>
      <AskAnnaAlert class="m-4 text-center">
        {{ noDataAvailable }}
      </AskAnnaAlert>
    </template>
    <template v-slot:bottom></template>
  </VDataTable>
</template>

<script setup lang="ts">
import { get } from 'lodash'
import { headers, FileIcons } from '../utils/index'
import { VDataTable } from 'vuetify/labs/VDataTable'

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
<style>
.code-tree-table.v-table.v-table--fixed-header>.v-table__wrapper>table>thead>tr>th {
  height: 39px;
}
</style>