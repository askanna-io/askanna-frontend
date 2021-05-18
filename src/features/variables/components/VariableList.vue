<template>
  <v-data-table
    class="variables-table ask-anna-table"
    :items="items"
    :headers="headers"
    hide-default-footer
    item-key="short_uuid"
    disable-pagination
  >
    <template v-slot:top>
      <slot name="header" />
    </template>

    <template v-slot:item.short_uuid="{ item }">
      <ask-anna-copy :text="item.short_uuid" prefix="#" :show="4" />
    </template>
    <template v-slot:item.name="{ item }">
      <ask-anna-copy :text="item.name" smartSlice :width="35" />
    </template>
    <template v-slot:item.value="{ item }">
      <ask-anna-copy :text="item.value" smartSlice :width="35" :masked="item.is_masked" expanded />
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn class="my-2 btn--hover" small outlined color="secondary" @click="handleEditItem(item)">
        <v-icon color="secondary" left small class="mr-2">mdi-pencil</v-icon>Edit
      </v-btn>
    </template>
    <template v-slot:no-data>
      There are no variables available for this project. In case you need a variable, you can easily create one with the
      option "+ new variable" above this table.
    </template>
  </v-data-table>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import AskAnnaCopy from '@/core/components/shared/AskAnnaCopy'

import { ref, computed, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'VariableList',

  props: {
    items: {
      type: Array,
      default: () => []
    }
  },

  components: { AskAnnaCopy },

  setup(props, context) {
    const { width } = useWindowSize()

    const modal = ref(null)

    const headers = ref([
      {
        text: 'SUUID',
        align: 'start',
        sortable: false,
        value: 'short_uuid',
        width: '10%',
        class: 'text-left text-subtitle-2 font-weight-bold h-20'
      },
      { text: 'Name', value: 'name', width: '35%', class: 'text-left text-subtitle-2 font-weight-bold h-20' },
      {
        text: 'Value',
        value: 'value',
        width: '45%',
        sortable: true,
        class: 'text-left text-subtitle-2 font-weight-bold h-20'
      },
      {
        text: '',
        value: 'actions',
        width: '10%',
        sortable: false,
        class: 'text-left text-subtitle-2 font-weight-bold h-20'
      }
    ])

    const handleEditItem = item => context.emit('onEditItem', item.short_uuid)

    return {
      headers,
      handleEditItem
    }
  }
})
</script>
