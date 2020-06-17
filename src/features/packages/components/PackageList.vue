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
      <v-subheader>Packages</v-subheader>
      <v-divider />
    </template>

    <template v-slot:item.uuid="{ item }">
      <v-chip outlined label color="primary" @click.stop="handleDownload(item)">
        <v-avatar left><v-icon>mdi-cloud-download</v-icon></v-avatar
        >Download</v-chip
      >
    </template>

    <template v-slot:item.created="{ item }">
      {{ $moment(item.created).format(' Do MMMM YYYY, h:mm:ss a') }}
    </template>

    <template v-slot:item.menu="{ item }">
      <v-menu bottom color="primary" :close-on-content-click="false" :nudge-width="200" offset-x :key="item.name">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" color="primary">
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="handleHistory(item)">
            <v-list-item-title>History</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <template v-slot:no-data>
      <v-icon :size="25" left>
        mdi-package-down
      </v-icon>
      You don't have packages yet.
    </template>
  </v-data-table>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import useMoment from '@/core/composition/useMoment'

export default defineComponent({
  name: 'PackageList',

  props: {
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
  },

  setup(props, context) {
    const moment = useMoment(context)

    const headers = [
      {
        text: 'Name',
        align: 'left',
        value: 'filename'
      },
      { text: 'Created', value: 'created' },
      { text: '', value: 'uuid', sortable: false },
      { text: '', value: 'menu' }
    ]

    const handleClickRow = ({ short_uuid }) => context.emit('handleClickRow', short_uuid)
    const handleDownload = async packageData => context.emit('handleDownload', packageData)
    const handleHistory = ({ short_uuid }) => context.emit('handleHistory', short_uuid)

    return {
      ...moment,
      headers,
      handleHistory,
      handleDownload,
      handleClickRow
    }
  }
})
</script>
