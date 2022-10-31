<template>
  <v-data-table
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

    <template v-slot:item.uuid="{ item }">
      <AskAnnaChip outlined label color="primary" @click.stop="handleDownload(item)">
        <AskAnnaAvatar left><AskAnnaIcon>mdi-cloud-download</AskAnnaIcon></AskAnnaAvatar
        >Download</v-chip
      >
    </template>

    <template v-slot:item.created="{ item }">
      {{ $moment(item.created).format(' Do MMMM YYYY, h:mm:ss a') }}
    </template>

    <template v-slot:item.menu="{ item }">
      <v-menu bottom color="primary" :close-on-content-click="false" :nudge-width="200" offset-x :key="item.name">
        <template v-slot:activator="{ on }">
          <AskAnnaButton icon v-on="on" color="primary">
            <AskAnnaIcon>mdi-dots-horizontal</AskAnnaIcon>
          </AskAnnaButton>
        </template>

        <v-list>
          <v-list-item @click="handleHistory(item)">
            <v-list-item-title>History</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <template v-slot:no-data>
      <AskAnnaIcon :size="25" left> mdi-package-down </AskAnnaIcon>
      You don't have packages yet.
    </template>
  </v-data-table>
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

const { $moment } = useMoment()

const headers = [
  {
    text: 'Name',
    align: 'left',
    value: 'filename',
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },
  { text: 'Created', value: 'created', class: 'text-left text-subtitle-2 font-weight-bold h-20' },
  { text: '', value: 'uuid', sortable: false, class: 'text-left text-subtitle-2 font-weight-bold h-20' },
  { text: '', value: 'menu', class: 'text-left text-subtitle-2 font-weight-bold h-20' }
]

const handleClickRow = ({ short_uuid }) => emit('handleClickRow', short_uuid)
const handleDownload = async packageData => emit('handleDownload', packageData)
const handleHistory = ({ short_uuid }) => emit('handleHistory', short_uuid)
</script>
