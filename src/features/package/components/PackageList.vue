<template>
  <VDataTable
    v-if="items.length"
    :items="items"
    :headers="headers"
    :hide-default-header="!items.length"
    :hide-default-footer="!items.length"
    @click:row="handleClickRow"
    fixed-header
  >
    <template v-slot:top>
      <AskAnnaSubHeader>Packages</AskAnnaSubHeader>
      <AskAnnaDivider />
    </template>

    <template v-slot:item.suuid="{ item }">
      <AskAnnaChip
        outlined
        label
        color="primary"
        @click.stop="handleDownload(item)"
      >
        <AskAnnaAvatar left>
          <AskAnnaIcon>mdi-cloud-download</AskAnnaIcon>
        </AskAnnaAvatar>Download
      </AskAnnaChip>
    </template>

    <template v-slot:item.created_at="{ item }">
      {{ dayjs(item.created_at).format(' Do MMMM YYYY, h:mm:ss a') }}
    </template>

    <template v-slot:item.menu="{ item }">
      <VMenu
        bottom
        color="primary"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
        :key="item.name"
      >
        <template v-slot:activator="{ on }">
          <AskAnnaButton
            icon
            v-on="on"
            color="primary"
          >
            <AskAnnaIcon>mdi-dots-horizontal</AskAnnaIcon>
          </AskAnnaButton>
        </template>

        <VList>
          <VListItem @click="handleHistory(item)">
            <VListItemTitle>History</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </template>
    <template v-slot:no-data>
      <AskAnnaIcon
        :size="25"
        left
      > mdi-package-down </AskAnnaIcon>
      You don't have packages yet.
    </template>
  </VDataTable>
</template>

<script setup lang="ts">
defineProps({
  workspaceName: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: true
  },
  settings: {
    type: Object,
    default: function () {
      return {
        projectView: 1
      }
    }
  }
})

const emit = defineEmits(['handleClickRow', 'handleDownload', 'handleHistory'])

const { dayjs } = useDayjs()

const headers = [
  {
    text: 'Name',
    align: 'left',
    value: 'filename',
    class: 'text-left text-subtitle-2 font-weight-bold'
  },
  { text: 'Created', value: 'created_at', class: 'text-left text-subtitle-2 font-weight-bold' },
  { text: '', value: 'suuid', sortable: false, class: 'text-left text-subtitle-2 font-weight-bold' },
  { text: '', value: 'menu', class: 'text-left text-subtitle-2 font-weight-bold' }
]

const handleClickRow = ({ suuid }) => emit('handleClickRow', suuid)
const handleDownload = async packageData => emit('handleDownload', packageData)
const handleHistory = ({ suuid }) => emit('handleHistory', suuid)
</script>
